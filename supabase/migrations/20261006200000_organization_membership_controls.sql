-- ADMIN-3 organization membership authorization.
-- Apply in the Supabase SQL editor after the RBAC foundation. Do not apply until reviewed.
-- Does not drop tables, does not change ADMIN-1 helper functions, and does not expose auth.users.
-- Email invitations stay server-side. This file does not call inviteUserByEmail.
-- The private schema is not added to the Data API exposed schemas.

create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- Replacing a policy avoids a second permissive policy. PostgreSQL ORs permissive policies together.
drop policy if exists organization_members_insert on public.organization_members;
drop policy if exists organization_members_update on public.organization_members;
drop policy if exists organization_members_delete on public.organization_members;

drop function if exists public.membership_change_allowed(uuid, uuid, uuid, text);
drop function if exists public.membership_delete_allowed(uuid);
drop function if exists public.membership_insert_allowed(uuid, uuid, text);
drop function if exists public.guard_organization_membership();

-- Reads the stored row as the function owner, so it does not recurse through organization_members RLS.
create or replace function private.membership_change_allowed(
  membership_id uuid,
  next_organization uuid,
  next_user uuid,
  next_role text
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as existing
    where existing.id = membership_id
      and existing.organization_id = next_organization
      and existing.user_id = next_user
      and next_role in ('owner', 'admin', 'member')
      and (
        public.is_super_admin()
        or (
          public.is_org_owner(existing.organization_id)
          and existing.user_id is distinct from auth.uid()
          and (
            existing.role is distinct from 'owner'
            or next_role = 'owner'
            or (
              select count(*)
              from public.organization_members as owners
              where owners.organization_id = existing.organization_id
                and owners.role = 'owner'
            ) > 1
          )
        )
        or (
          exists (
            select 1
            from public.organization_members as actor
            where actor.organization_id = existing.organization_id
              and actor.user_id = auth.uid()
              and actor.role = 'admin'
          )
          and existing.role = 'member'
          and next_role = 'member'
          and existing.user_id is distinct from auth.uid()
        )
      )
  );
$$;

create or replace function private.membership_delete_allowed(membership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as existing
    where existing.id = membership_id
      and (
        public.is_super_admin()
        or (
          public.is_org_owner(existing.organization_id)
          and existing.user_id is distinct from auth.uid()
          and (
            existing.role is distinct from 'owner'
            or (
              select count(*)
              from public.organization_members as owners
              where owners.organization_id = existing.organization_id
                and owners.role = 'owner'
            ) > 1
          )
        )
        or (
          exists (
            select 1
            from public.organization_members as actor
            where actor.organization_id = existing.organization_id
              and actor.user_id = auth.uid()
              and actor.role = 'admin'
          )
          and existing.role = 'member'
          and existing.user_id is distinct from auth.uid()
        )
      )
  );
$$;

create or replace function private.membership_insert_allowed(
  target_organization uuid,
  target_user uuid,
  target_role text
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.is_super_admin()
    or (
      public.is_org_owner(target_organization)
      and target_role in ('admin', 'member')
      and target_user is distinct from auth.uid()
    )
    or (
      exists (
        select 1
        from public.organization_members as actor
        where actor.organization_id = target_organization
          and actor.user_id = auth.uid()
          and actor.role = 'admin'
      )
      and target_role = 'member'
      and target_user is distinct from auth.uid()
    );
$$;

create or replace function private.guard_organization_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_count integer;
begin
  if tg_op = 'UPDATE' then
    if new.id is distinct from old.id
      or new.organization_id is distinct from old.organization_id
      or new.user_id is distinct from old.user_id then
      raise exception 'membership_identity_locked';
    end if;

    if new.role is distinct from old.role
      and old.user_id = auth.uid()
      and not public.is_super_admin() then
      raise exception 'cannot_change_own_role';
    end if;

    if old.role = 'owner' and new.role is distinct from 'owner' then
      select count(*) into owner_count
      from public.organization_members
      where organization_id = old.organization_id
        and role = 'owner';
      if owner_count <= 1 then
        raise exception 'cannot_remove_only_owner';
      end if;
    end if;

    return new;
  end if;

  if old.user_id = auth.uid() and not public.is_super_admin() then
    raise exception 'cannot_remove_self';
  end if;

  if old.role = 'owner' then
    select count(*) into owner_count
    from public.organization_members
    where organization_id = old.organization_id
      and role = 'owner';
    if owner_count <= 1 then
      raise exception 'cannot_remove_only_owner';
    end if;
  end if;

  return old;
end;
$$;

revoke execute on function private.membership_change_allowed(uuid, uuid, uuid, text) from public, anon;
grant execute on function private.membership_change_allowed(uuid, uuid, uuid, text) to authenticated;

revoke execute on function private.membership_delete_allowed(uuid) from public, anon;
grant execute on function private.membership_delete_allowed(uuid) to authenticated;

revoke execute on function private.membership_insert_allowed(uuid, uuid, text) from public, anon;
grant execute on function private.membership_insert_allowed(uuid, uuid, text) to authenticated;

revoke all on function private.guard_organization_membership() from public, anon, authenticated;

create policy organization_members_insert on public.organization_members
for insert to authenticated
with check (private.membership_insert_allowed(organization_id, user_id, role));

create policy organization_members_update on public.organization_members
for update to authenticated
using (private.membership_change_allowed(id, organization_id, user_id, role))
with check (private.membership_change_allowed(id, organization_id, user_id, role));

create policy organization_members_delete on public.organization_members
for delete to authenticated
using (private.membership_delete_allowed(id));

drop trigger if exists organization_members_guard on public.organization_members;
create trigger organization_members_guard
before update or delete on public.organization_members
for each row execute function private.guard_organization_membership();

-- No earlier migration creates a profile sync trigger. profiles_set_updated_at only stamps updated_at.
create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), '')
  )
  on conflict (id) do update
  set
    email = coalesce(excluded.email, public.profiles.email),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists sync_profile_from_auth on auth.users;
create trigger sync_profile_from_auth
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_profile_from_auth();

revoke all on function public.sync_profile_from_auth() from public, anon, authenticated;
do $$
begin
  if exists (select 1 from pg_catalog.pg_roles where rolname = 'supabase_auth_admin') then
    grant execute on function public.sync_profile_from_auth() to supabase_auth_admin;
  end if;
end;
$$;

insert into public.profiles (id, email, full_name, avatar_url)
select
  users.id,
  users.email,
  nullif(btrim(coalesce(users.raw_user_meta_data ->> 'full_name', users.raw_user_meta_data ->> 'name', '')), ''),
  nullif(btrim(coalesce(users.raw_user_meta_data ->> 'avatar_url', '')), '')
from auth.users as users
on conflict (id) do update
set
  email = coalesce(excluded.email, public.profiles.email),
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

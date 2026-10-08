-- ADMIN-5 organization audit log.
-- Apply after the RBAC foundation and membership controls. Do not edit those files.
-- Authenticated clients can read their own organization's log when they are an owner or admin.
-- They cannot insert, update, or delete rows, and they cannot choose actor_user_id.
-- Rows are written by AFTER triggers, so a failed organization or membership change records nothing.

create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null check (
    action in (
      'organization.updated',
      'organization.slug_updated',
      'member.role_changed',
      'member.removed'
    )
  ),
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_organization_created_idx
  on public.audit_logs (organization_id, created_at desc);

alter table public.audit_logs enable row level security;

revoke all on table public.audit_logs from public, anon, authenticated;
grant select on table public.audit_logs to authenticated;

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
for select to authenticated
using (
  public.is_super_admin()
  or public.is_org_admin(organization_id)
);

create or replace function private.record_audit_event(
  target_organization uuid,
  event_action text,
  event_target_type text,
  event_target_id text,
  event_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    target_type,
    target_id,
    metadata
  )
  values (
    target_organization,
    auth.uid(),
    event_action,
    event_target_type,
    event_target_id,
    coalesce(event_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function private.record_audit_event(uuid, text, text, text, jsonb) from public, anon, authenticated;

create or replace function private.audit_organization_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.name is distinct from old.name then
    perform private.record_audit_event(
      new.id,
      'organization.updated',
      'organization',
      new.id::text,
      pg_catalog.jsonb_build_object('previous_name', old.name, 'name', new.name)
    );
  end if;

  if new.slug is distinct from old.slug then
    perform private.record_audit_event(
      new.id,
      'organization.slug_updated',
      'organization',
      new.id::text,
      pg_catalog.jsonb_build_object('previous_slug', old.slug, 'slug', new.slug)
    );
  end if;

  return new;
end;
$$;

revoke all on function private.audit_organization_update() from public, anon, authenticated;

drop trigger if exists organizations_audit_update on public.organizations;
create trigger organizations_audit_update
after update on public.organizations
for each row
execute function private.audit_organization_update();

create or replace function private.audit_membership_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    perform private.record_audit_event(
      new.organization_id,
      'member.role_changed',
      'organization_member',
      new.id::text,
      pg_catalog.jsonb_build_object(
        'membership_id', new.id,
        'user_id', new.user_id,
        'previous_role', old.role,
        'role', new.role
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.audit_membership_update() from public, anon, authenticated;

drop trigger if exists organization_members_audit_update on public.organization_members;
create trigger organization_members_audit_update
after update on public.organization_members
for each row
execute function private.audit_membership_update();

create or replace function private.audit_membership_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.record_audit_event(
    old.organization_id,
    'member.removed',
    'organization_member',
    old.id::text,
    pg_catalog.jsonb_build_object(
      'membership_id', old.id,
      'user_id', old.user_id,
      'role', old.role
    )
  );

  return old;
end;
$$;

revoke all on function private.audit_membership_delete() from public, anon, authenticated;

drop trigger if exists organization_members_audit_delete on public.organization_members;
create trigger organization_members_audit_delete
after delete on public.organization_members
for each row
execute function private.audit_membership_delete();

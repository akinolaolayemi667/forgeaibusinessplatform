-- FORGE RBAC foundation.
-- Apply this in the Supabase SQL editor or CLI. It does not drop tables and does not change auth.users.
-- The first super admin must be assigned here with the service role, never from the browser:
-- insert into public.platform_roles (user_id, role) values ('<auth-user-uuid>', 'super_admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.platform_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('super_admin', 'admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_members_user_id_idx on public.organization_members (user_id);
create index if not exists organization_members_organization_id_idx on public.organization_members (organization_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists platform_roles_set_updated_at on public.platform_roles;
create trigger platform_roles_set_updated_at
before update on public.platform_roles
for each row execute function public.set_updated_at();

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_roles
    where user_id = auth.uid()
      and role = 'super_admin'
  );
$$;

create or replace function public.is_org_member(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_org_owner(target_organization uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.shares_organization(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members mine
    join public.organization_members theirs
      on theirs.organization_id = mine.organization_id
    where mine.user_id = auth.uid()
      and theirs.user_id = target_user
  );
$$;

revoke all on function public.set_updated_at() from public;
revoke all on function public.is_super_admin() from public;
revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_org_admin(uuid) from public;
revoke all on function public.is_org_owner(uuid) from public;
revoke all on function public.shares_organization(uuid) from public;

grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;
grant execute on function public.shares_organization(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.platform_roles enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert, update, delete on public.platform_roles to authenticated;

create policy profiles_select on public.profiles
for select to authenticated
using (
  id = auth.uid()
  or public.is_super_admin()
  or public.shares_organization(id)
);

create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy profiles_update on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_super_admin())
with check (id = auth.uid() or public.is_super_admin());

create policy organizations_select on public.organizations
for select to authenticated
using (public.is_super_admin() or public.is_org_member(id));

create policy organizations_insert on public.organizations
for insert to authenticated
with check (public.is_super_admin());

create policy organizations_update on public.organizations
for update to authenticated
using (public.is_super_admin() or public.is_org_admin(id))
with check (public.is_super_admin() or public.is_org_admin(id));

create policy organizations_delete on public.organizations
for delete to authenticated
using (public.is_super_admin());

create policy organization_members_select on public.organization_members
for select to authenticated
using (
  user_id = auth.uid()
  or public.is_super_admin()
  or public.is_org_member(organization_id)
);

create policy organization_members_insert on public.organization_members
for insert to authenticated
with check (
  public.is_super_admin()
  or (public.is_org_owner(organization_id) and role in ('owner', 'admin', 'member'))
  or (public.is_org_admin(organization_id) and role = 'member')
);

create policy organization_members_update on public.organization_members
for update to authenticated
using (
  public.is_super_admin()
  or public.is_org_owner(organization_id)
  or (public.is_org_admin(organization_id) and role = 'member')
)
with check (
  public.is_super_admin()
  or (public.is_org_owner(organization_id) and role in ('owner', 'admin', 'member'))
  or (public.is_org_admin(organization_id) and role = 'member')
);

create policy organization_members_delete on public.organization_members
for delete to authenticated
using (
  public.is_super_admin()
  or public.is_org_owner(organization_id)
  or (public.is_org_admin(organization_id) and role = 'member')
);

create policy platform_roles_select on public.platform_roles
for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());

create policy platform_roles_insert on public.platform_roles
for insert to authenticated
with check (public.is_super_admin());

create policy platform_roles_update on public.platform_roles
for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy platform_roles_delete on public.platform_roles
for delete to authenticated
using (public.is_super_admin());

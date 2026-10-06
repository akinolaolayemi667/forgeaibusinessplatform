import { supabase } from '@/lib/supabase'
import type { Authorization, OrganizationMembership, OrganizationRole, PlatformRole } from '@/types/roles'

type RoleError = { code?: string; message?: string } | null

export async function loadAuthorization(userId: string): Promise<Authorization> {
  const [platform, membership] = await Promise.all([
    supabase.from('platform_roles').select('role').eq('user_id', userId).maybeSingle(),
    supabase.from('organization_members').select('role, organizations(id, name, slug)').eq('user_id', userId),
  ])

  if (isUnavailable(platform.error) || isUnavailable(membership.error)) return { status: 'unavailable' }
  if (platform.error || membership.error) return { status: 'unavailable' }

  const memberships = membershipRows(membership.data)
  const primary = memberships[0] ?? null

  return {
    status: 'ready',
    platformRole: platformRole(platform.data?.role),
    organization: primary ? { id: primary.id, name: primary.name, slug: primary.slug } : null,
    organizationRole: primary?.role ?? null,
    memberships,
  }
}

function isUnavailable(error: RoleError) {
  if (!error) return false
  const message = error.message ?? ''
  return (
    error.code === '42P01' ||
    error.code === 'PGRST204' ||
    error.code === 'PGRST205' ||
    /does not exist|schema cache|could not find the table/i.test(message)
  )
}

function platformRole(value: unknown): PlatformRole {
  if (value === 'super_admin' || value === 'admin' || value === 'user') return value
  return 'user'
}

function organizationRole(value: unknown): OrganizationRole | null {
  if (value === 'owner' || value === 'admin' || value === 'member') return value
  return null
}

function membershipRows(data: unknown): OrganizationMembership[] {
  if (!Array.isArray(data)) return []
  return data.flatMap((row) => {
    if (!row || typeof row !== 'object') return []
    const record = row as { role?: unknown; organizations?: unknown }
    const role = organizationRole(record.role)
    const organization = organizationRecord(record.organizations)
    if (!role || !organization) return []
    return [{ ...organization, role }]
  })
}

function organizationRecord(value: unknown) {
  const record = Array.isArray(value) ? value[0] : value
  if (!record || typeof record !== 'object') return null
  const organization = record as { id?: unknown; name?: unknown; slug?: unknown }
  if (typeof organization.id !== 'string' || typeof organization.name !== 'string' || typeof organization.slug !== 'string') {
    return null
  }
  return { id: organization.id, name: organization.name, slug: organization.slug }
}

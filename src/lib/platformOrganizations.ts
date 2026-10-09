import { auditMessage, getAuditLogs } from '@/lib/auditLogs'
import { getOrganizationMembers } from '@/lib/organizationMembers'
import { supabase } from '@/lib/supabase'
import type { OrganizationMemberRole } from '@/types/organizationMember'
import {
  organizationPageSize,
  type OrganizationSort,
  type PlatformOrganizationDirectory,
  type PlatformOrganizationLookup,
  type PlatformOrganizationMember,
  type PlatformOrganizationProfile,
  type PlatformOrganizationRow,
} from '@/types/platformOrganizations'

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const sortColumns = {
  created_desc: { column: 'created_at', ascending: false },
  created_asc: { column: 'created_at', ascending: true },
  name_asc: { column: 'name', ascending: true },
  name_desc: { column: 'name', ascending: false },
  slug_asc: { column: 'slug', ascending: true },
  slug_desc: { column: 'slug', ascending: false },
} as const

export async function getPlatformOrganizationDirectory(input: {
  search: string
  sort: OrganizationSort
  page: number
}): Promise<PlatformOrganizationDirectory> {
  const page = Math.max(0, input.page)
  const term = searchTerm(input.search)
  if (input.search.trim() && !term) return { rows: [], total: 0, membersStatus: 'live' }

  const order = sortColumns[input.sort]
  const from = page * organizationPageSize
  const to = from + organizationPageSize - 1
  let request = supabase
    .from('organizations')
    .select('id, name, slug, created_at, updated_at', { count: 'exact' })
  if (term) request = request.or(`name.ilike.%${term}%,slug.ilike.%${term}%`)
  const organizations = await request.order(order.column, { ascending: order.ascending }).order('id', { ascending: true }).range(from, to)

  if (organizations.error) throw organizations.error
  const parsed = readOrganizations(rows(organizations.data))
  const memberCounts = await countMembers(parsed.map((row) => row.id))

  return {
    rows: parsed.map((row) => ({
      ...row,
      members: memberCounts.status === 'live' ? (memberCounts.counts.get(row.id) ?? 0) : null,
    })),
    total: organizations.count ?? parsed.length,
    membersStatus: memberCounts.status,
  }
}

export async function getPlatformOrganizationDetail(organizationId: string): Promise<PlatformOrganizationLookup> {
  if (!uuidPattern.test(organizationId)) return { state: 'missing' }

  const organization = await supabase
    .from('organizations')
    .select('id, name, slug, created_at, updated_at')
    .eq('id', organizationId)
    .maybeSingle()

  if (organization.error) throw organization.error
  const profile = readOrganization(organization.data)
  if (!profile || profile.id !== organizationId) return { state: 'missing' }

  const [members, audit] = await Promise.all([loadMembers(organizationId), loadAudit(organizationId)])

  return {
    state: 'found',
    organization: profile,
    members: members.rows,
    memberCount: members.error ? null : members.rows.length,
    membersError: members.error,
    audit: audit.rows,
    auditError: audit.error,
  }
}

export function organizationMessage(error: unknown, fallback: string) {
  const message = errorText(error)
  if (/permission denied|row-level security|not_authorized/i.test(message)) return 'You do not have permission to read platform organizations.'
  return fallback
}

export function organizationSortLabel(sort: OrganizationSort) {
  if (sort === 'created_desc') return 'Newest'
  if (sort === 'created_asc') return 'Oldest'
  if (sort === 'name_asc') return 'Name A–Z'
  if (sort === 'name_desc') return 'Name Z–A'
  if (sort === 'slug_asc') return 'Slug A–Z'
  return 'Slug Z–A'
}

async function countMembers(ids: string[]) {
  const counts = new Map<string, number>()
  if (ids.length === 0) return { status: 'live' as const, counts }
  const members = await supabase.from('organization_members').select('organization_id').in('organization_id', ids)
  if (members.error) return { status: 'not_connected' as const, counts }
  for (const item of rows(members.data)) {
    const organizationId = readString(item, 'organization_id')
    if (!organizationId) continue
    counts.set(organizationId, (counts.get(organizationId) ?? 0) + 1)
  }
  return { status: 'live' as const, counts }
}

async function loadMembers(organizationId: string) {
  try {
    const members = await getOrganizationMembers(organizationId)
    return {
      rows: members.flatMap((member) => {
        if (member.organizationId !== organizationId) return []
        return [toPlatformMember(member)]
      }),
      error: null,
    }
  } catch (caught) {
    if (import.meta.env.DEV) console.info('platform organization members', caught)
    return { rows: [] as PlatformOrganizationMember[], error: 'Unable to load organization members.' }
  }
}

async function loadAudit(organizationId: string) {
  try {
    const audit = await getAuditLogs(organizationId)
    return { rows: audit.filter((event) => event.organizationId === organizationId), error: null }
  } catch (caught) {
    if (import.meta.env.DEV) console.info('platform organization audit', caught)
    return { rows: [], error: auditMessage(caught) }
  }
}

function toPlatformMember(member: {
  id: string
  userId: string
  role: OrganizationMemberRole
  joinedAt: string
  name: string
  email: string
}): PlatformOrganizationMember {
  return {
    id: member.id,
    userId: member.userId,
    role: member.role,
    joinedAt: member.joinedAt,
    name: member.name.trim() || 'Name unavailable',
    email: member.email.trim() || 'Email unavailable',
  }
}

function readOrganizations(data: unknown[]): PlatformOrganizationRow[] {
  return data.flatMap((item) => {
    const row = readOrganization(item)
    return row ? [{ ...row, members: null }] : []
  })
}

function readOrganization(value: unknown): PlatformOrganizationProfile | null {
  const id = readString(value, 'id')
  const name = readString(value, 'name')
  const slug = readString(value, 'slug')
  const createdAt = readString(value, 'created_at')
  const updatedAt = readString(value, 'updated_at')
  if (!id || !name || !slug || !createdAt || !updatedAt) return null
  return { id, name, slug, createdAt, updatedAt }
}

function searchTerm(value: string) {
  return value.trim().replace(/[%_\\,().]/g, '')
}

function rows(data: unknown) {
  return Array.isArray(data) ? data : []
}

function readString(value: unknown, key: string) {
  if (!value || typeof value !== 'object' || !(key in value)) return null
  const field = Reflect.get(value, key)
  return typeof field === 'string' ? field : null
}

function errorText(error: unknown) {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object') {
    const record = error as { message?: unknown; code?: unknown }
    if (typeof record.code === 'string' && typeof record.message === 'string') return `${record.code} ${record.message}`
    if (typeof record.message === 'string') return record.message
    if (typeof record.code === 'string') return record.code
  }
  return ''
}

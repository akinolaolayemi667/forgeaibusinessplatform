import { auditActionLabel } from '@/lib/auditLogs'
import { supabase } from '@/lib/supabase'
import { auditActions, type AuditAction } from '@/types/auditLogs'
import {
  notConnected,
  type GrowthPoint,
  type PlatformActivityEvent,
  type PlatformMetric,
  type PlatformOrganization,
  type PlatformRange,
  type PlatformSnapshot,
  type SystemCheck,
} from '@/types/platformOverview'

type QueryError = { message?: string; code?: string } | null

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const [organizations, profiles, roles, members, activity] = await Promise.all([
    supabase.from('organizations').select('id, name, slug, created_at').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, created_at'),
    supabase.from('platform_roles').select('role'),
    supabase.from('organization_members').select('organization_id'),
    supabase
      .from('audit_logs')
      .select('id, organization_id, actor_user_id, action, target_type, target_id, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const organizationRows = organizations.error ? [] : readOrganizations(rows(organizations.data))
  const memberCounts = members.error ? null : countMembers(rows(members.data))
  const profileDates = profiles.error ? [] : readDates(rows(profiles.data), 'created_at')
  const roleCounts = roles.error ? null : countRoles(rows(roles.data))
  const activityRows = activity.error ? [] : readActivity(rows(activity.data))
  const actorNames = await actorNameMap(activityRows.map((row) => row.actorUserId))
  const organizationNames = new Map(organizationRows.map((row) => [row.id, row.name]))

  const organizationsLive = !organizations.error
  const profilesLive = !profiles.error
  const rolesLive = roleCounts !== null
  const membersLive = memberCounts !== null
  const activityLive = !activity.error

  return {
    organizations: organizationsLive ? live(organizationRows.length) : unavailableMetric(),
    users: profilesLive ? live(profileDates.length) : unavailableMetric(),
    platformAdmins: rolesLive ? live(roleCounts.admin) : unavailableMetric(),
    superAdmins: rolesLive ? live(roleCounts.superAdmin) : unavailableMetric(),
    organizationMembers: membersLive ? live(memberTotal(memberCounts)) : unavailableMetric(),
    activeOrganizations: notConnected,
    leads: notConnected,
    contacts: notConnected,
    opportunities: notConnected,
    automations: notConnected,
    organizationRows: organizationRows.map((row) => ({
      ...row,
      members: memberCounts ? (memberCounts.get(row.id) ?? 0) : null,
    })),
    organizationsStatus: organizationsLive ? 'live' : 'unavailable',
    organizationsError: organizations.error ? 'Unable to load platform organizations.' : null,
    membersStatus: membersLive ? 'live' : 'not_connected',
    organizationDates: organizationRows.map((row) => row.createdAt),
    organizationsGrowthStatus: organizationsLive ? 'live' : 'unavailable',
    profileDates,
    usersGrowthStatus: profilesLive ? 'live' : 'unavailable',
    roleStatus: rolesLive ? 'live' : 'unavailable',
    platformUsers: rolesLive ? live(roleCounts.user) : unavailableMetric(),
    activity: activityRows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      actorName: row.actorUserId ? (actorNames.get(row.actorUserId) ?? 'Name unavailable') : 'Actor unavailable',
      action: row.action,
      organizationName: organizationNames.get(row.organizationId) ?? 'Organization unavailable',
      target: row.target,
    })),
    activityStatus: activityLive ? 'live' : 'unavailable',
    activityError: activity.error ? 'Unable to load platform activity.' : null,
    checks: systemChecks({
      organizations: organizations.error,
      profiles: profiles.error,
      roles: roles.error,
      activity: activity.error,
    }),
  }
}

export function growthSeries(dates: string[], range: PlatformRange, now = new Date()): GrowthPoint[] {
  const start = rangeStart(range, now)
  const buckets = rangeBuckets(range, start, now)
  const times = dates.flatMap((value) => {
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? [] : [time]
  })
  let cumulative = times.filter((time) => time < start.getTime()).length
  return buckets.map((bucket) => {
    const created = times.filter((time) => time >= bucket.start && time < bucket.end).length
    cumulative += created
    return { label: bucket.label, created, cumulative }
  })
}

export function filterActivity(events: PlatformActivityEvent[], range: PlatformRange, now = new Date()) {
  const start = rangeStart(range, now).getTime()
  return events.filter((event) => {
    const time = new Date(event.createdAt).getTime()
    return !Number.isNaN(time) && time >= start
  })
}

export function rangeLabel(range: PlatformRange) {
  if (range === '7d') return '7 days'
  if (range === '30d') return '30 days'
  if (range === '90d') return '90 days'
  return '12 months'
}

function live(value: number): PlatformMetric {
  return { value, source: 'live' }
}

function unavailableMetric(): PlatformMetric {
  return { value: null, source: 'not_connected' }
}

function rows(data: unknown) {
  return Array.isArray(data) ? data : []
}

function readOrganizations(data: unknown[]): PlatformOrganization[] {
  return data.flatMap((item) => {
    const id = readString(item, 'id')
    const name = readString(item, 'name')
    const slug = readString(item, 'slug')
    const createdAt = readString(item, 'created_at')
    if (!id || !name || !slug || !createdAt) return []
    return [{ id, name, slug, createdAt, members: null }]
  })
}

function readDates(data: unknown[], key: string) {
  return data.flatMap((item) => {
    const value = readString(item, key)
    return value ? [value] : []
  })
}

function countMembers(data: unknown[]) {
  const counts = new Map<string, number>()
  for (const item of data) {
    const organizationId = readString(item, 'organization_id')
    if (!organizationId) continue
    counts.set(organizationId, (counts.get(organizationId) ?? 0) + 1)
  }
  return counts
}

function memberTotal(counts: Map<string, number>) {
  let total = 0
  for (const value of counts.values()) total += value
  return total
}

function countRoles(data: unknown[]) {
  const counts = { superAdmin: 0, admin: 0, user: 0 }
  for (const item of data) {
    const role = readString(item, 'role')
    if (role === 'super_admin') counts.superAdmin += 1
    else if (role === 'admin') counts.admin += 1
    else if (role === 'user') counts.user += 1
  }
  return counts
}

function readActivity(data: unknown[]) {
  return data.flatMap((item) => {
    const id = readString(item, 'id')
    const organizationId = readString(item, 'organization_id')
    const createdAt = readString(item, 'created_at')
    const action = readString(item, 'action')
    const targetType = readString(item, 'target_type')
    const targetId = readString(item, 'target_id')
    const actorUserId = readString(item, 'actor_user_id')
    if (!id || !organizationId || !createdAt || !action || !targetType) return []
    return [{
      id,
      organizationId,
      createdAt,
      actorUserId,
      action: actionLabel(action),
      target: targetId ? `${targetType} ${targetId}` : targetType,
    }]
  })
}

function actionLabel(action: string) {
  if (isKnownAction(action)) return auditActionLabel(action)
  return action
}

function isKnownAction(value: string): value is AuditAction {
  return auditActions.some((item) => item === value)
}

async function actorNameMap(ids: Array<string | null>) {
  const unique = [...new Set(ids.flatMap((id) => (id ? [id] : [])))]
  const names = new Map<string, string>()
  if (unique.length === 0) return names
  const result = await supabase.from('profiles').select('id, full_name').in('id', unique)
  if (result.error) return names
  for (const item of result.data ?? []) {
    const id = readString(item, 'id')
    const name = readString(item, 'full_name')
    if (id) names.set(id, name?.trim() || 'Name unavailable')
  }
  return names
}

function systemChecks(errors: { organizations: QueryError; profiles: QueryError; roles: QueryError; activity: QueryError }): SystemCheck[] {
  const databaseOk = !errors.organizations || !errors.profiles
  return [
    {
      id: 'authentication',
      label: 'Authentication',
      state: 'operational',
      detail: 'This dashboard is open inside a signed-in session.',
    },
    {
      id: 'database',
      label: 'Database connection',
      state: databaseOk ? 'operational' : 'not_verified',
      detail: databaseOk ? 'Organization or profile records were read.' : 'Platform tables could not be read from this session.',
    },
    {
      id: 'rbac',
      label: 'Platform RBAC',
      state: errors.roles ? 'not_verified' : 'operational',
      detail: errors.roles ? 'Platform roles could not be read.' : 'Platform roles were read for this session.',
    },
    {
      id: 'audit',
      label: 'Audit logging',
      state: auditState(errors.activity),
      detail: auditDetail(errors.activity),
    },
    {
      id: 'application',
      label: 'Application',
      state: 'operational',
      detail: 'This browser loaded the platform dashboard. Server uptime is not measured.',
    },
  ]
}

function auditState(error: QueryError): SystemCheck['state'] {
  if (!error) return 'operational'
  const text = `${error.code ?? ''} ${error.message ?? ''}`
  if (/42P01|PGRST205|schema cache|audit_logs/i.test(text)) return 'not_connected'
  return 'not_verified'
}

function auditDetail(error: QueryError) {
  if (!error) return 'Recorded organization audit events can be read.'
  if (auditState(error) === 'not_connected') return 'Audit log storage is not connected.'
  return 'Audit events could not be verified from this session.'
}

function rangeStart(range: PlatformRange, now: Date) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  if (range === '7d') start.setDate(start.getDate() - 6)
  else if (range === '30d') start.setDate(start.getDate() - 29)
  else if (range === '90d') start.setDate(start.getDate() - 89)
  else {
    start.setDate(1)
    start.setMonth(start.getMonth() - 11)
  }
  return start
}

function rangeBuckets(range: PlatformRange, start: Date, now: Date) {
  const buckets: { start: number; end: number; label: string }[] = []
  if (range === '12m') {
    const cursor = new Date(start)
    for (let index = 0; index < 12; index += 1) {
      const next = new Date(cursor)
      next.setMonth(next.getMonth() + 1)
      buckets.push({ start: cursor.getTime(), end: next.getTime(), label: monthLabel(cursor) })
      cursor.setMonth(cursor.getMonth() + 1)
    }
    return buckets
  }
  const cursor = new Date(start)
  const end = new Date(now)
  end.setHours(0, 0, 0, 0)
  end.setDate(end.getDate() + 1)
  while (cursor < end) {
    const next = new Date(cursor)
    next.setDate(next.getDate() + 1)
    buckets.push({ start: cursor.getTime(), end: next.getTime(), label: dayLabel(cursor) })
    cursor.setDate(cursor.getDate() + 1)
  }
  return buckets
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date)
}

function readString(value: unknown, key: string) {
  if (!value || typeof value !== 'object' || !(key in value)) return null
  const field = Reflect.get(value, key)
  return typeof field === 'string' ? field : null
}

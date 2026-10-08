import { supabase } from '@/lib/supabase'
import { auditActions, type AuditAction, type AuditLog } from '@/types/auditLogs'

type AuditRow = {
  id: string
  organization_id: string
  actor_user_id: string | null
  action: string
  target_type: string
  target_id: string | null
  metadata: unknown
  created_at: string
}

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
}

export async function getAuditLogs(organizationId: string): Promise<AuditLog[]> {
  const logs = await supabase
    .from('audit_logs')
    .select('id, organization_id, actor_user_id, action, target_type, target_id, metadata, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(200)

  if (logs.error) throw logs.error
  const rows = ((logs.data ?? []) as AuditRow[]).flatMap((row) => {
    if (row.organization_id !== organizationId || !isAuditRow(row)) return []
    return [row]
  })

  const ids = [...new Set(rows.flatMap((row) => (row.actor_user_id ? [row.actor_user_id] : [])))]
  const profiles = new Map<string, ProfileRow>()
  if (ids.length > 0) {
    const result = await supabase.from('profiles').select('id, full_name, email').in('id', ids)
    if (result.error) throw result.error
    for (const profile of (result.data ?? []) as ProfileRow[]) profiles.set(profile.id, profile)
  }

  return rows.map((row) => {
    const profile = row.actor_user_id ? profiles.get(row.actor_user_id) : undefined
    return {
      id: row.id,
      organizationId: row.organization_id,
      actorUserId: row.actor_user_id,
      actorName: row.actor_user_id ? profile?.full_name?.trim() || 'Name unavailable' : 'Actor unavailable',
      actorEmail: row.actor_user_id ? profile?.email?.trim() || 'Email unavailable' : 'Email unavailable',
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      metadata: metadataRecord(row.metadata),
      createdAt: row.created_at,
    }
  })
}

export function auditActionLabel(action: AuditAction) {
  if (action === 'organization.updated') return 'Organization updated'
  if (action === 'organization.slug_updated') return 'Organization slug updated'
  if (action === 'member.role_changed') return 'Member role changed'
  return 'Member removed'
}

export function formatAuditTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export type AuditFilter = 'all' | 'organization' | 'membership'

export function filterAuditLogs(logs: AuditLog[], filter: AuditFilter, search: string) {
  const query = search.trim().toLowerCase()
  return logs.filter((log) => {
    if (filter === 'organization' && !log.action.startsWith('organization.')) return false
    if (filter === 'membership' && !log.action.startsWith('member.')) return false
    if (!query) return true
    const haystack = [log.actorName, log.actorEmail, log.action, auditActionLabel(log.action), log.targetType, log.targetId ?? '', JSON.stringify(log.metadata)]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
}

export function auditMessage(error: unknown) {
  const message = errorText(error)
  if (/42P01|PGRST106|PGRST205|schema cache|audit_logs/i.test(message)) return 'Audit log storage is not ready.'
  if (/permission denied|row-level security|not_authorized/i.test(message)) return 'You do not have permission to read this audit log.'
  return 'Unable to load audit events.'
}

function isAuditRow(row: AuditRow): row is AuditRow & { action: AuditAction } {
  return auditActions.includes(row.action as AuditAction)
}

function metadataRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
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

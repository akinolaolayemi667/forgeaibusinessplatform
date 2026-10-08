export const auditActions = [
  'organization.updated',
  'organization.slug_updated',
  'member.role_changed',
  'member.removed',
] as const

export type AuditAction = (typeof auditActions)[number]

export type AuditLog = {
  id: string
  organizationId: string
  actorUserId: string | null
  actorName: string
  actorEmail: string
  action: AuditAction
  targetType: string
  targetId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

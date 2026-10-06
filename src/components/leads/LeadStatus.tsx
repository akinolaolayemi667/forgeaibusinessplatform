import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import type { LeadStatus } from '@/data/leads'

const tone: Record<LeadStatus, BadgeVariant> = {
  New: 'info',
  Contacted: 'neutral',
  Qualified: 'accent',
  Nurturing: 'warning',
  Converted: 'success',
  Lost: 'neutral',
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={tone[status]}>{status}</Badge>
}

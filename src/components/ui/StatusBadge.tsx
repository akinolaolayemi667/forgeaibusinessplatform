import { Badge, type BadgeVariant } from '@/components/ui/Badge'

const tones: Record<string, BadgeVariant> = {
  New: 'info',
  Working: 'warning',
  Qualified: 'success',
  Disqualified: 'neutral',
  Discovery: 'info',
  Proposal: 'warning',
  Negotiation: 'accent',
  Verbal: 'success',
  Live: 'success',
  Paused: 'warning',
  Draft: 'neutral',
  Connected: 'success',
  Available: 'neutral',
  Email: 'info',
  SMS: 'accent',
  Web: 'neutral',
  Owner: 'accent',
  Admin: 'info',
  Member: 'neutral',
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={tones[status] ?? 'neutral'}>{status}</Badge>
}

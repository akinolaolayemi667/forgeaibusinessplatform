import { StatCard } from '@/components/ui/StatCard'
import type { BadgeVariant } from '@/components/ui/Badge'

export function CRMStatCard({
  label,
  value,
  hint,
  delta,
  deltaTone,
}: {
  label: string
  value: string
  hint: string
  delta?: string
  deltaTone?: BadgeVariant
}) {
  return <StatCard label={label} value={value} hint={hint} delta={delta} deltaTone={deltaTone} />
}

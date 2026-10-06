import { StatCard } from '@/components/ui/StatCard'

export function LeadStatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <StatCard label={label} value={value} hint={hint} />
}

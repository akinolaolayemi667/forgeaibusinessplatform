import type { AdminMetric } from '@/data/adminData'

export function AdminMetricCard({ metric }: { metric: AdminMetric }) {
  return (
    <article className="border border-stroke bg-surface-raised px-4 py-4">
      <p className="type-kicker text-ash">{metric.label}</p>
      <p className="type-data mt-3 font-display text-3xl text-paper">{metric.value}</p>
      <p className="mt-2 text-xs text-ash">{metric.hint}</p>
    </article>
  )
}

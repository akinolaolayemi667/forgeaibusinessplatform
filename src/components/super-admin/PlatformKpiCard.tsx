import type { PlatformMetric } from '@/types/platformOverview'

export function PlatformKpiCard({
  label,
  metric,
  detail,
  loading,
}: {
  label: string
  metric: PlatformMetric | null
  detail: string
  loading: boolean
}) {
  const live = metric?.source === 'live' && metric.value !== null
  return (
    <article className="min-w-0 border border-stroke bg-surface-raised px-4 py-4">
      <h3 className="type-kicker text-ash">{label}</h3>
      <p className="mt-3 font-display text-3xl text-paper">{loading || !metric ? '—' : live ? metric.value : 'Not connected'}</p>
      <p className="mt-2 text-xs text-ash">{loading ? 'Loading platform overview...' : live ? 'Live platform data' : 'Not connected'}</p>
      <p className="mt-1 text-xs text-stone">{detail}</p>
    </article>
  )
}

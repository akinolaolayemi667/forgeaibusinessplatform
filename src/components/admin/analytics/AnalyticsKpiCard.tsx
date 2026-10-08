import { SourceMark } from '@/components/admin/analytics/SourceMark'
import { cn } from '@/lib/cn'
import type { AnalyticsKpi } from '@/types/adminAnalytics'

const toneClass = {
  positive: 'text-badge-ok-fg',
  negative: 'text-badge-danger-fg',
  neutral: 'text-ash',
}

export function AnalyticsKpiCard({ metric }: { metric: AnalyticsKpi }) {
  return (
    <article className="min-w-0 border border-stroke bg-surface-raised px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="type-kicker text-ash">{metric.label}</p>
        <SourceMark source={metric.source} />
      </div>
      <p className="type-data mt-3 font-display text-3xl text-paper">{metric.value}</p>
      <p className={cn('mt-2 font-mono text-xs', toneClass[metric.tone])}>
        {metric.delta}
        <span className="text-ash"> {metric.comparison}</span>
      </p>
      <p className="mt-2 text-xs leading-5 text-ash">{metric.description}</p>
    </article>
  )
}

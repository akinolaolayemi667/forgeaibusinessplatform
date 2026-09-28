import type { Metric } from '@/types'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'

const tone = {
  up: 'success',
  down: 'danger',
  flat: 'neutral',
} as const

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) {
    return <EmptyState title="No metrics yet" description="This workspace has no sample metrics." />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          delta={metric.delta}
          deltaTone={tone[metric.direction]}
          hint={metric.hint}
        />
      ))}
    </div>
  )
}

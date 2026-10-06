import { Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import { formatCompactMoney } from '@/utils/format'
import type { PipelineMetrics } from '@/data/pipeline'

function Metric({ label, value, hint, accent = false }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <Card as="article">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <Tooltip content={hint}>
          <button type="button" className="cursor-pointer text-muted" aria-label={`About ${label}`}>
            <Info aria-hidden size={16} />
          </button>
        </Tooltip>
      </div>
      <p className={cn('type-data text-3xl', accent ? 'text-ember' : 'text-copy')}>{value}</p>
    </Card>
  )
}

export function PipelineStats({ metrics }: { metrics: PipelineMetrics }) {
  return (
    <section aria-label="Pipeline summary">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric label="Pipeline value" value={formatCompactMoney(metrics.openValue)} hint="Sum of open opportunity values." accent />
        <Metric label="Weighted value" value={formatCompactMoney(metrics.weighted)} hint="Each open deal multiplied by its probability." />
        <Metric label="Open opportunities" value={metrics.openCount.toLocaleString('en-US')} hint="Deals still in an open stage." />
        <Metric label="Won this month" value={formatCompactMoney(metrics.wonThisMonth)} hint="Value currently sitting in Won." />
        <Metric label="Win rate" value={`${metrics.winRate.toFixed(1)}%`} hint="Won share of closed opportunities in the book." />
        <Metric label="Average deal" value={formatCompactMoney(metrics.average)} hint="Open pipeline value divided by open opportunities." />
      </div>
    </section>
  )
}

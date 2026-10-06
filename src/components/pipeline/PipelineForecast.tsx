import { formatCompactMoney } from '@/utils/format'
import type { PipelineMetrics } from '@/data/pipeline'

const rows = [
  { key: 'openValue', label: 'Open pipeline', hint: 'Unweighted open value' },
  { key: 'weighted', label: 'Weighted pipeline', hint: 'Value × probability' },
  { key: 'best', label: 'Best case', hint: 'Open deals at 40% or higher' },
  { key: 'commit', label: 'Commit', hint: 'Open deals at 70% or higher' },
] as const

export function PipelineForecast({ metrics }: { metrics: PipelineMetrics }) {
  return (
    <section className="border border-stroke bg-surface-raised">
      <header className="border-b border-stroke px-4 py-3">
        <h2 className="type-kicker text-muted">Forecast</h2>
      </header>
      <dl className="grid grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className="border-b border-r border-stroke px-4 py-3 last:border-r-0">
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="type-data mt-1 text-2xl text-copy">{formatCompactMoney(metrics[row.key])}</dd>
            <p className="mt-1 text-xs text-muted">{row.hint}</p>
          </div>
        ))}
      </dl>
    </section>
  )
}

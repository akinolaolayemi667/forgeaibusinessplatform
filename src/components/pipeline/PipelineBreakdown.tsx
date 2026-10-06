import { formatCompactMoney } from '@/utils/format'
import type { StageBreakdownRow } from '@/data/pipeline'

export function PipelineBreakdown({ rows }: { rows: StageBreakdownRow[] }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1
  return (
    <section className="border border-stroke bg-surface-raised">
      <header className="border-b border-stroke px-4 py-3">
        <h2 className="type-kicker text-muted">Stage breakdown</h2>
        <p className="mt-1 text-xs text-muted">Full book, including rows hidden by search.</p>
      </header>
      <ol>
        {rows.map((row) => {
          const share = Math.round((row.value / total) * 100)
          return (
            <li key={row.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-3">
                <p className="text-sm text-copy">{row.name}</p>
                <p className="type-data text-xs text-muted">{row.count} deals</p>
                <p className="type-data text-sm text-copy">{formatCompactMoney(row.value)}</p>
              </div>
              <div className="mt-2 h-px bg-steel" aria-hidden>
                <div className="h-px bg-ember" style={{ width: `${share}%` }} />
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardTitle } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import type { DashboardSnapshot } from '@/types'

const tone = {
  up: 'success',
  down: 'danger',
  flat: 'neutral',
} as const

export function DashboardView({
  snapshot,
  loading,
  error,
}: {
  snapshot: DashboardSnapshot | null
  loading: boolean
  error: string | null
}) {
  return (
    <QueryState loading={loading} error={error}>
      {snapshot ? <DashboardBody snapshot={snapshot} /> : null}
    </QueryState>
  )
}

function DashboardBody({ snapshot }: { snapshot: DashboardSnapshot }) {
  const peakFunnel = Math.max(1, ...snapshot.funnel.map((stage) => stage.count))
  const peakRuns = Math.max(1, ...snapshot.performance.map((item) => item.runs))

  return (
    <div className="flex flex-col gap-4">
      <section aria-label="Workspace measures">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {snapshot.kpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaTone={tone[kpi.direction]}
              hint={kpi.hint}
            />
          ))}
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <CardTitle>Recent activity</CardTitle>
          {snapshot.activity.length === 0 ? (
            <p className="text-sm text-muted">Nothing has moved in this workspace.</p>
          ) : (
            <ul className="flex flex-col">
              {snapshot.activity.map((item) => (
                <li key={item.id} className="border-t border-stroke py-3 first:border-t-0">
                  <Link to={item.href} className="flex flex-col gap-1 no-underline">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-copy">{item.title}</span>
                      <time className="type-data shrink-0 text-[11px] text-muted" dateTime={item.at}>
                        {formatWhen(item.at)}
                      </time>
                    </span>
                    <span className="line-clamp-2 text-sm text-muted">{item.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card as="section">
          <CardTitle>Lead funnel</CardTitle>
          <ol className="flex flex-col gap-3">
            {snapshot.funnel.map((stage) => (
              <li key={stage.stage}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="text-sm text-copy">{stage.stage}</span>
                  <span className="type-data text-sm text-muted">{stage.count}</span>
                </div>
                <div className="h-1.5 bg-wash" aria-hidden>
                  <div className="h-full bg-ember" style={{ width: `${(stage.count / peakFunnel) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="sr-only">
            {snapshot.funnel.map((stage) => `${stage.stage} ${stage.count}`).join(', ')}
          </p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <CardTitle>Automation performance</CardTitle>
          <ul className="flex flex-col gap-3">
            {snapshot.performance.map((item) => (
              <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-copy">{item.name}</span>
                    <span className="type-data text-xs text-muted">{item.runs}</span>
                  </div>
                  <div className="h-1.5 bg-wash" aria-hidden>
                    <div
                      className={item.status === 'Live' ? 'h-full bg-ember' : 'h-full bg-stone'}
                      style={{ width: `${Math.max(item.runs === 0 ? 0 : 8, (item.runs / peakRuns) * 100)}%` }}
                    />
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card as="section">
          <CardTitle>AI recommendations</CardTitle>
          {snapshot.recommendations.length === 0 ? (
            <p className="text-sm text-muted">No recommendation is waiting.</p>
          ) : (
            <ul className="flex flex-col">
              {snapshot.recommendations.map((item) => (
                <li key={item.id} className="border-t border-stroke py-3 first:border-t-0">
                  <Link to={item.href} className="flex flex-col gap-1 no-underline hover:text-ember">
                    <span className="text-sm text-copy">{item.title}</span>
                    <span className="text-sm text-muted">{item.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
}

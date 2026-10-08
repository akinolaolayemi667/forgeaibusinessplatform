import { AnalyticsEmpty, AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { formatPercent } from '@/lib/adminAnalytics'
import type { AdminAnalyticsModel } from '@/types/adminAnalytics'

export function AutomationAnalytics({ automation }: { automation: AdminAnalyticsModel['automation'] }) {
  const facts = [
    { id: 'total', label: 'Total automation runs', value: String(automation.totalRuns) },
    { id: 'success', label: 'Successful runs', value: String(automation.successfulRuns) },
    { id: 'failed', label: 'Failed runs', value: String(automation.failedRuns) },
    { id: 'rate', label: 'Success rate', value: automation.successRate === null ? '—' : formatPercent(automation.successRate) },
    { id: 'time', label: 'Average execution time', value: automation.averageExecution },
    { id: 'active', label: 'Most active automation', value: automation.mostActive },
  ]

  return (
    <AnalyticsPanel
      title="AUTOMATION PERFORMANCE"
      source="demo"
      note="Run metrics describe executions. Status metrics describe automation definitions. Run timestamps are not stored, so these totals do not follow the date range. Every stored run is counted as successful because no failed execution is recorded."
    >
      <h3 className="type-kicker text-ash">Run metrics</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.id} className="border border-stroke px-3 py-3">
            <dt className="type-kicker text-ash">{fact.label}</dt>
            <dd className="mt-2 text-sm text-paper">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="type-kicker mt-5 text-ash">Runs over time</h3>
      <div className="mt-3">
        <AnalyticsEmpty title="NOT DATED" detail="Sample automations do not store run timestamps, so this chart is not tied to the date range." />
      </div>
      <h3 className="type-kicker mt-5 text-ash">Automation status</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {automation.status.map((slice) => (
          <li key={slice.id} className="border border-stroke px-3 py-3">
            <p className="type-kicker text-ash">{slice.label}</p>
            <p className="mt-2 font-display text-2xl text-paper">{slice.value}</p>
          </li>
        ))}
      </ul>
    </AnalyticsPanel>
  )
}

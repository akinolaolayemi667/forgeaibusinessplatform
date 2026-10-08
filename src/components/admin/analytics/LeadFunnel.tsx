import { AnalyticsEmpty, AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { formatPercent } from '@/lib/adminAnalytics'
import type { FunnelStage } from '@/types/adminAnalytics'

export function LeadFunnel({ stages }: { stages: FunnelStage[] }) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0)

  return (
    <AnalyticsPanel
      title="LEAD FUNNEL"
      source="demo"
      note="Sample leads created in this range. Working groups Contacted and Nurturing. These stages are not opportunity records."
    >
      <div className="mb-4 border border-stroke px-3 py-3">
        <p className="type-kicker text-ash">Qualified → Won</p>
        <p className="mt-2 font-display text-2xl text-paper">Not available</p>
        <p className="mt-1 text-xs leading-5 text-ash">Requires connected opportunity lifecycle data</p>
      </div>
      {total === 0 ? (
        <AnalyticsEmpty title="NO ANALYTICS DATA" detail="No sample leads were created in this range." />
      ) : (
        <ol className="flex flex-col gap-3">
          {stages.map((stage) => (
            <li key={stage.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-paper">{stage.label}</p>
                <p className="font-mono text-xs text-ash">
                  {stage.count} · {formatPercent(stage.share)} of sample leads
                </p>
              </div>
              <div className="mt-2 h-2 bg-wash" aria-hidden>
                <div className="h-full bg-ember" style={{ width: `${Math.max(stage.share * 100, stage.count > 0 ? 4 : 0)}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </AnalyticsPanel>
  )
}

import { AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import type { AnalyticsInsight } from '@/types/adminAnalytics'

export function PerformanceInsights({ insights }: { insights: AnalyticsInsight[] }) {
  return (
    <AnalyticsPanel title="PERFORMANCE INSIGHTS" source="demo" note="Each line uses one sample dataset. Awaiting connected data means that dataset has nothing to report. Not a generated assistant reply.">
      <ol className="flex flex-col gap-3">
        {insights.map((insight, index) => (
          <li key={insight.id} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border border-stroke px-3 py-3">
            <span className="font-mono text-xs text-ember">{String(index + 1).padStart(2, '0')}</span>
            <p className="text-sm leading-6 text-paper">{insight.text}</p>
          </li>
        ))}
      </ol>
    </AnalyticsPanel>
  )
}

import { DateRangeSelector } from '@/components/admin/analytics/DateRangeSelector'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import type { AnalyticsRange } from '@/types/adminAnalytics'

export function AnalyticsHeader({
  range,
  refreshing,
  onRange,
  onRefresh,
}: {
  range: AnalyticsRange
  refreshing: boolean
  onRange: (range: AnalyticsRange) => void
  onRefresh: () => void
}) {
  return (
    <PageHeader
      title="ANALYTICS"
      description="Organization performance, pipeline health, team activity, automation output and AI usage."
      actions={
        <>
          <DateRangeSelector range={range} onChange={onRange} />
          <Button variant="outline" onClick={onRefresh} disabled={refreshing} aria-busy={refreshing || undefined}>
            {refreshing ? 'Refreshing' : 'Refresh'}
          </Button>
        </>
      }
    />
  )
}

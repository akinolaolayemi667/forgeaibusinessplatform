import { ActivityTimeline } from '@/components/admin/analytics/ActivityTimeline'
import { AIUsagePanel } from '@/components/admin/analytics/AIUsagePanel'
import { AnalyticsHeader } from '@/components/admin/analytics/AnalyticsHeader'
import { AnalyticsKpiCard } from '@/components/admin/analytics/AnalyticsKpiCard'
import { AnalyticsEmpty, AnalyticsSkeleton } from '@/components/admin/analytics/AnalyticsPanel'
import { AutomationAnalytics } from '@/components/admin/analytics/AutomationAnalytics'
import { ConversationAnalytics } from '@/components/admin/analytics/ConversationAnalytics'
import { LeadFunnel } from '@/components/admin/analytics/LeadFunnel'
import { PerformanceInsights } from '@/components/admin/analytics/PerformanceInsights'
import { PipelineHealth } from '@/components/admin/analytics/PipelineHealth'
import { RevenuePipelineChart } from '@/components/admin/analytics/RevenuePipelineChart'
import { TeamPerformance } from '@/components/admin/analytics/TeamPerformance'
import { Button } from '@/components/ui/Button'
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics'

export function AdminAnalyticsPage() {
  const analytics = useAdminAnalytics()
  const model = analytics.model

  return (
    <>
      <AnalyticsHeader
        range={analytics.range}
        refreshing={analytics.refreshing}
        onRange={analytics.setRange}
        onRefresh={analytics.refresh}
      />
      {analytics.demoLoading ? <AnalyticsSkeleton label="Loading analytics." rows={6} /> : null}
      {analytics.demoError ? (
        <div className="border border-stroke bg-surface-raised px-4 py-6" role="alert">
          <p className="text-sm text-paper">{analytics.demoError}</p>
          <Button className="mt-3" variant="outline" onClick={analytics.refresh}>Try again</Button>
        </div>
      ) : null}
      {!analytics.demoLoading && !analytics.demoError && !model ? (
        <AnalyticsEmpty title="NO ANALYTICS DATA" detail="There is nothing to calculate for this organization yet." />
      ) : null}
      {model ? (
        <>
          <section aria-label="KPI overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {model.kpis.map((metric) => (
              <AnalyticsKpiCard key={metric.id} metric={metric} />
            ))}
          </section>
          <RevenuePipelineChart points={model.revenue} hasRecords={model.revenueHasRecords} />
          <div className="grid gap-4 xl:grid-cols-2">
            <LeadFunnel stages={model.funnel} />
            <PipelineHealth metrics={model.pipelineMetrics} stages={model.pipelineStages} hasRecords={model.pipelineHasRecords} />
          </div>
          <TeamPerformance
            rows={model.team}
            loading={analytics.membersLoading}
            error={analytics.membersError}
            hasOrganization={Boolean(analytics.organization)}
            onRetry={analytics.reloadMembers}
          />
          <div className="grid gap-4 xl:grid-cols-2">
            <AutomationAnalytics automation={model.automation} />
            <AIUsagePanel ai={model.ai} />
          </div>
          <ConversationAnalytics conversations={model.conversations} />
          <div className="grid gap-4 xl:grid-cols-2">
            <ActivityTimeline events={model.activity} />
            <PerformanceInsights insights={model.insights} />
          </div>
        </>
      ) : null}
    </>
  )
}

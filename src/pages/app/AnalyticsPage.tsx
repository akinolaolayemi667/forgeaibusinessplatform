import { lazy, Suspense } from 'react'
import { forgeData } from '@/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

const QualificationChart = lazy(() =>
  import('@/components/analytics/QualificationChart').then((module) => ({
    default: module.QualificationChart,
  })),
)

export function AnalyticsPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`chart:${workspace.id}`, () => forgeData.listChart(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Analytics"
        title="Qualified against won"
        description={`Weekly sample counts for ${workspace.name}.`}
      />
      <QueryState loading={query.loading} error={query.error}>
        <Suspense fallback={<p role="status" className="text-sm text-muted">Loading chart…</p>}>
          <QualificationChart points={query.data ?? []} />
        </Suspense>
      </QueryState>
    </div>
  )
}

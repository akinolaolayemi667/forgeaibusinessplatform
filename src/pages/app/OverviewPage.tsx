import { Link } from 'react-router-dom'
import { forgeData } from '@/data'
import { MetricGrid } from '@/components/dashboard/MetricGrid'
import { buttonStyles } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function OverviewPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`metrics:${workspace.id}`, () => forgeData.listMetrics(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={workspace.name}
        title="Overview"
        description="A short read of the sample workspace before you open a record."
      />
      <QueryState loading={query.loading} error={query.error}>
        <MetricGrid metrics={query.data ?? []} />
      </QueryState>
      <div className="flex flex-wrap gap-2">
        <Link to="/app/leads" className={buttonStyles()}>
          Review leads
        </Link>
        <Link to="/app/pipeline" className={buttonStyles('outline')}>
          Open pipeline
        </Link>
      </div>
    </div>
  )
}

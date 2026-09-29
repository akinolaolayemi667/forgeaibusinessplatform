import { Link } from 'react-router-dom'
import { forgeData } from '@/data'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { buttonStyles } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function OverviewPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`dashboard:${workspace.id}`, () => forgeData.getDashboard(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={workspace.name}
        title="Overview"
        description="Revenue, pipeline, and the work that still needs a person."
        actions={
          <>
            <Link to="/app/leads" className={buttonStyles()}>
              Review leads
            </Link>
            <Link to="/app/pipeline" className={buttonStyles('outline')}>
              Open pipeline
            </Link>
          </>
        }
      />
      <DashboardView snapshot={query.data} loading={query.loading} error={query.error} />
    </div>
  )
}

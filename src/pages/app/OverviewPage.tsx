import { Link } from 'react-router-dom'
import { forgeData } from '@/data'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { buttonStyles } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { useWorkspace } from '@/hooks/useWorkspace'
import { signedInConsoles } from '@/lib/permissions'

export function OverviewPage() {
  const { workspace } = useWorkspace()
  const { accessStatus, isAdmin, isSuperAdmin } = useAuth()
  const consoles = accessStatus === 'ready' ? signedInConsoles({ isAdmin, isSuperAdmin }) : []
  const query = useAsyncData(`dashboard:${workspace.id}`, () => forgeData.getDashboard(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={workspace.name}
        title="Overview"
        description="Revenue, pipeline, and the work that still needs a person."
        actions={
          <>
            {consoles.map((item) => (
              <Link key={item.id} to={item.to} className={buttonStyles(item.id === 'platform-control' ? 'outline' : 'primary')}>
                {item.label}
              </Link>
            ))}
            <Link to="/app/leads" className={buttonStyles(consoles.length > 0 ? 'outline' : 'primary')}>
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

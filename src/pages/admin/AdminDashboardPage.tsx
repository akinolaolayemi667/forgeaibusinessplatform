import { Link } from 'react-router-dom'
import { AdminActivityFeed } from '@/components/admin/AdminActivityFeed'
import { AdminChart } from '@/components/admin/AdminChart'
import { AdminMetricCard } from '@/components/admin/AdminMetricCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { buttonStyles } from '@/components/ui/Button'
import { adminActivity, adminMetrics, adminPerformance } from '@/data/adminData'

const actions = [
  { to: '/admin/users?invite=1', label: 'Invite User' },
  { to: '/app/automations', label: 'Create Automation' },
  { to: '/app/integrations', label: 'Connect Integration' },
  { to: '/admin/billing', label: 'View Billing' },
  { to: '/app', label: 'Open Workspace' },
]

export function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="ADMINISTRATION" description="Manage your organization, users, operations and account." />
      <section aria-label="Organization metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {adminMetrics.map((metric) => (
          <AdminMetricCard key={metric.id} metric={metric} />
        ))}
      </section>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <AdminActivityFeed items={adminActivity.slice(0, 5)} />
        <section className="border border-stroke bg-surface-raised" aria-labelledby="admin-performance-heading">
          <div className="border-b border-stroke px-4 py-3">
            <h2 id="admin-performance-heading" className="font-display text-lg text-paper">
              Organization performance
            </h2>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {adminPerformance.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div>
                  <p className="type-kicker text-ash">{item.label}</p>
                  <p className="type-data mt-1 text-2xl text-paper">{item.value}</p>
                  <p className="text-xs text-ash">{item.hint}</p>
                </div>
                <AdminChart title={item.label} points={item.points} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="border border-stroke bg-surface-raised" aria-labelledby="admin-actions-heading">
        <div className="border-b border-stroke px-4 py-3">
          <h2 id="admin-actions-heading" className="font-display text-lg text-paper">
            Quick actions
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {actions.map((action) => (
            <Link key={action.to} to={action.to} className={buttonStyles('outline', 'md')}>
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { buttonStyles } from '@/components/ui/Button'

const actions = [
  { to: '/super-admin/organizations', label: 'Manage organizations' },
  { to: '/super-admin/users', label: 'Manage users' },
  { to: '/super-admin/admins', label: 'Manage platform admins' },
  { to: '/super-admin/audit-logs', label: 'View audit logs' },
  { to: '/super-admin/settings', label: 'Platform settings' },
]

export function PlatformQuickActions() {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="platform-actions-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="platform-actions-heading" className="font-display text-xl text-paper">Quick actions</h2>
        <p className="mt-1 text-sm text-ash">These open the protected platform sections. Those sections are not built yet.</p>
      </div>
      <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-5">
        {actions.map((action) => (
          <Link key={action.to} to={action.to} className={buttonStyles('outline', 'sm')}>
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

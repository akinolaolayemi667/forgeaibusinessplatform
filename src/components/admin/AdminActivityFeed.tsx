import { Link } from 'react-router-dom'
import type { AdminActivityItem } from '@/data/adminData'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'

export function AdminActivityFeed({ items }: { items: AdminActivityItem[] }) {
  return (
    <section className="border border-stroke bg-surface-raised" aria-labelledby="admin-activity-heading">
      <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
        <h2 id="admin-activity-heading" className="font-display text-lg text-paper">
          Recent activity
        </h2>
        <Link to="/admin/activity" className="type-kicker text-ember no-underline hover:text-ember-hot">
          View all activity
        </Link>
      </div>
      <ol className="divide-y divide-stroke">
        {items.map((item) => (
          <li key={item.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm text-paper">{item.title}</p>
              <p className="text-sm text-ash">{item.detail}</p>
            </div>
            <p className="font-mono text-[11px] text-stone">
              {item.day} · {item.clock}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function AdminActivityRow({ item }: { item: AdminActivityItem }) {
  return (
    <article className="grid gap-2 border-b border-stroke px-4 py-3 last:border-b-0 sm:grid-cols-[4.5rem_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center">
      <p className="font-mono text-xs text-stone">
        <span className="block text-ash">{item.day}</span>
        {item.clock}
      </p>
      <p className="text-sm text-paper">{item.actor}</p>
      <p className="text-sm text-stone">{item.action}</p>
      <p className="text-sm text-ash">{item.resource}</p>
      <AdminStatusBadge status={item.status} />
    </article>
  )
}

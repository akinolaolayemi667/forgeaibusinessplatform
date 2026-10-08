import { AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import type { ActivityEvent } from '@/types/adminAnalytics'

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <AnalyticsPanel
      title="ORGANIZATION ACTIVITY"
      source="demo"
      note="SAMPLE WORKSPACE ACTIVITY. These actors are not members of the signed-in organization, and this log is not filtered by the date range."
    >
      {events.length === 0 ? (
        <p className="text-sm text-ash">No sample activity is available.</p>
      ) : (
        <ol className="flex flex-col">
          {events.map((event) => (
            <li key={event.id} className="grid gap-2 border-b border-stroke py-3 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center">
              <p className="font-mono text-[11px] text-ash">{event.time}</p>
              <div className="min-w-0">
                <p className="truncate text-sm text-paper">{event.event}</p>
                <p className="truncate text-xs text-ash">Sample actor · {event.actor}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminStatusBadge status={event.category} />
                <AdminStatusBadge status={event.status} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </AnalyticsPanel>
  )
}

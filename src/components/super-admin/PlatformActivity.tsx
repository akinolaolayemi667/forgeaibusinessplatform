import { formatAuditTime } from '@/lib/auditLogs'
import type { PlatformActivityEvent } from '@/types/platformOverview'

export function PlatformActivity({
  rows,
  loading,
  error,
}: {
  rows: PlatformActivityEvent[]
  loading: boolean
  error: string | null
}) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="platform-activity-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="platform-activity-heading" className="font-display text-xl text-paper">Recent platform admin activity</h2>
        <p className="mt-1 text-sm text-ash">These are recorded organization and membership events. This is not a complete platform activity feed.</p>
      </div>
      {loading ? <p className="px-4 py-8 text-sm text-ash sm:px-5">Loading activity...</p> : null}
      {!loading && error ? <p role="alert" className="px-4 py-8 text-sm text-badge-danger-fg sm:px-5">{error} Try again.</p> : null}
      {!loading && !error && rows.length === 0 ? (
        <div className="px-4 py-8 sm:px-5">
          <p className="type-kicker text-ash">No recent platform activity</p>
          <p className="mt-2 text-sm text-paper">No recorded platform activity is available in this range.</p>
        </div>
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left md:min-w-0">
            <thead className="border-b border-stroke">
              <tr>
                {['Time', 'Actor', 'Action', 'Organization', 'Target'].map((label) => (
                  <th key={label} className="px-4 py-2 type-kicker font-normal text-ash sm:px-5">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-stroke last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs text-ash sm:px-5">{formatAuditTime(row.createdAt)}</td>
                  <td className="truncate px-4 py-3 text-sm text-paper sm:px-5">{row.actorName}</td>
                  <td className="px-4 py-3 text-sm text-paper sm:px-5">{row.action}</td>
                  <td className="truncate px-4 py-3 text-sm text-paper sm:px-5">{row.organizationName}</td>
                  <td className="truncate px-4 py-3 font-mono text-xs text-ash sm:px-5">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

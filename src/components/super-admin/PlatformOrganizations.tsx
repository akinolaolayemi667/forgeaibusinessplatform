import { formatAuditTime } from '@/lib/auditLogs'
import type { PlatformOrganization } from '@/types/platformOverview'

export function PlatformOrganizations({
  rows,
  loading,
  error,
  membersConnected,
}: {
  rows: PlatformOrganization[]
  loading: boolean
  error: string | null
  membersConnected: boolean
}) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="platform-organizations-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="platform-organizations-heading" className="font-display text-xl text-paper">Organizations</h2>
        <p className="mt-1 text-sm text-ash">Status data is not connected. Organizations do not have a persisted status.</p>
      </div>
      {loading ? <p className="px-4 py-8 text-sm text-ash sm:px-5">Loading organizations...</p> : null}
      {!loading && error ? <p role="alert" className="px-4 py-8 text-sm text-badge-danger-fg sm:px-5">{error} Try again.</p> : null}
      {!loading && !error && rows.length === 0 ? (
        <div className="px-4 py-8 sm:px-5">
          <p className="type-kicker text-ash">No organizations</p>
          <p className="mt-2 text-sm text-paper">No organizations have been created yet.</p>
        </div>
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left md:min-w-0 md:table-fixed">
            <thead className="border-b border-stroke">
              <tr>
                {['Organization', 'Slug', 'Created', 'Members'].map((label) => (
                  <th key={label} className="px-4 py-2 type-kicker font-normal text-ash sm:px-5">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-stroke last:border-b-0">
                  <td className="truncate px-4 py-3 text-sm text-paper sm:px-5">{row.name}</td>
                  <td className="truncate px-4 py-3 font-mono text-xs text-ash sm:px-5">{row.slug}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ash sm:px-5">{formatAuditTime(row.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-paper sm:px-5">{membersConnected && row.members !== null ? row.members : 'Not connected'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

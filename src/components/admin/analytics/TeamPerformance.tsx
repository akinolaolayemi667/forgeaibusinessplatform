import { AnalyticsEmpty, AnalyticsPanel, AnalyticsSkeleton } from '@/components/admin/analytics/AnalyticsPanel'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import type { TeamPerformanceRow } from '@/types/adminAnalytics'

export function TeamPerformance({
  rows,
  loading,
  error,
  hasOrganization,
  onRetry,
}: {
  rows: TeamPerformanceRow[]
  loading: boolean
  error: string | null
  hasOrganization: boolean
  onRetry: () => void
}) {
  return (
    <AnalyticsPanel
      title="TEAM PERFORMANCE"
      source="live"
      note="Roster from the signed-in organization. Performance figures are not stored on members."
    >
      {loading ? <AnalyticsSkeleton label="Loading team members." /> : null}
      {!loading && error ? (
        <div className="border border-stroke px-4 py-6" role="alert">
          <p className="text-sm text-paper">{error}</p>
          <Button className="mt-3" variant="outline" onClick={onRetry}>Try again</Button>
        </div>
      ) : null}
      {!loading && !error && !hasOrganization ? (
        <AnalyticsEmpty title="NO TEAM MEMBERS" detail="No organization is attached to this session." />
      ) : null}
      {!loading && !error && hasOrganization && rows.length === 0 ? (
        <AnalyticsEmpty title="NO TEAM MEMBERS" detail="This organization has no membership records." />
      ) : null}
      {!loading && !error && rows.length > 0 ? (
        <>
          <div className="hidden min-w-0 overflow-x-auto md:block">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">Organization members</caption>
              <thead>
                <tr className="border-b border-stroke">
                  {['User', 'Role', 'Status', 'Joined'].map((header) => (
                    <th key={header} scope="col" className="type-kicker px-3 py-2 font-medium text-ash">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-stroke last:border-b-0 hover:bg-wash">
                    <th scope="row" className="px-3 py-3 font-normal">
                      <MemberIdentity row={row} />
                    </th>
                    <td className="px-3 py-3"><AdminStatusBadge status={row.role} /></td>
                    <td className="px-3 py-3"><AdminStatusBadge status={row.status} /></td>
                    <td className="px-3 py-3 text-stone">{row.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="border border-stroke p-3">
                <MemberIdentity row={row} />
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Stat label="Role" value={row.role} />
                  <Stat label="Status" value={row.status} />
                  <Stat label="Joined" value={row.joined} />
                </dl>
              </li>
            ))}
          </ul>
          <div className="mt-4 border border-stroke px-4 py-4">
            <p className="type-kicker text-ash">Performance data</p>
            <p className="mt-2 text-sm text-paper">Not yet connected to persisted team activity</p>
            <p className="mt-1 text-xs leading-5 text-ash">Organization sample totals stay in the panels above. They are not assigned to these members.</p>
          </div>
        </>
      ) : null}
    </AnalyticsPanel>
  )
}

function MemberIdentity({ row }: { row: TeamPerformanceRow }) {
  return (
    <span className="flex items-center gap-3">
      <Avatar name={row.name} src={row.avatarUrl ?? undefined} size="sm" />
      <span className="min-w-0">
        <span className="block truncate text-paper">{row.name}</span>
        <span className="block truncate text-xs text-ash">{row.email}</span>
      </span>
    </span>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="type-kicker text-ash">{label}</dt>
      <dd className="mt-1 text-paper">{value}</dd>
    </div>
  )
}

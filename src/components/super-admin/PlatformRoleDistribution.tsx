import type { PlatformMetric } from '@/types/platformOverview'

export function PlatformRoleDistribution({
  superAdmins,
  platformAdmins,
  platformUsers,
  loading,
  status,
}: {
  superAdmins: PlatformMetric
  platformAdmins: PlatformMetric
  platformUsers: PlatformMetric
  loading: boolean
  status: 'live' | 'unavailable'
}) {
  const rows = [
    { label: 'Super admins', metric: superAdmins },
    { label: 'Platform admins', metric: platformAdmins },
    { label: 'Platform users', metric: platformUsers },
  ]
  const max = Math.max(...rows.map((row) => (row.metric.source === 'live' && row.metric.value !== null ? row.metric.value : 0)), 1)

  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="platform-roles-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="platform-roles-heading" className="font-display text-xl text-paper">Platform roles</h2>
        <p className="mt-1 text-sm text-ash">Counts are explicit rows in public.platform_roles. Accounts with no platform role row are not included.</p>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
        {loading ? <p className="text-sm text-ash">Loading platform overview...</p> : null}
        {!loading && status === 'unavailable' ? <p role="alert" className="text-sm text-badge-danger-fg">Unable to load platform roles. Try again.</p> : null}
        {!loading && status === 'live'
          ? rows.map((row) => {
              const value = row.metric.source === 'live' && row.metric.value !== null ? row.metric.value : 0
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm text-paper">{row.label}</p>
                    <p className="font-mono text-xs text-ash">{value}</p>
                  </div>
                  <div className="mt-2 h-1.5 bg-steel" role="meter" aria-label={row.label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
                    <div className="h-full bg-ember" style={{ width: `${Math.round((value / max) * 100)}%` }} />
                  </div>
                </div>
              )
            })
          : null}
        {!loading && status === 'live' ? <p className="text-xs text-ash">Live platform data</p> : null}
      </div>
    </section>
  )
}

import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { usePlatformOverview } from '@/hooks/usePlatformOverview'
import type { PlatformCount } from '@/lib/platformOverview'

const cards = [
  { key: 'organizations', label: 'Total organizations', source: 'public.organizations' },
  { key: 'users', label: 'Total users', source: 'public.profiles' },
  { key: 'platformAdmins', label: 'Platform admins', source: 'public.platform_roles' },
  { key: 'superAdmins', label: 'Super admins', source: 'public.platform_roles' },
] as const

export function SuperAdminDashboardPage() {
  const { isSuperAdmin } = useAuth()
  const overview = usePlatformOverview(isSuperAdmin)

  return (
    <>
      <PageHeader
        eyebrow="Platform data"
        title="PLATFORM"
        description="Counts are read with the current session. A figure appears only when that table can be counted. Nothing on this page is a sample."
        actions={<Button variant="outline" onClick={overview.reload} disabled={overview.loading || !isSuperAdmin}>Refresh</Button>}
      />
      {overview.loading ? <p className="text-sm text-ash">Loading platform data.</p> : null}
      {!overview.loading && !overview.overview ? (
        <p role="alert" className="text-sm text-badge-danger-fg">Platform counts could not be loaded.</p>
      ) : null}
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform counts">
        {cards.map((card) => (
          <PlatformCard key={card.key} label={card.label} source={card.source} count={overview.overview?.[card.key] ?? null} loading={overview.loading} />
        ))}
      </section>
    </>
  )
}

function PlatformCard({ label, source, count, loading }: { label: string; source: string; count: PlatformCount | null; loading: boolean }) {
  const live = count?.status === 'live' && count.value !== null
  return (
    <article className="min-w-0 border border-stroke bg-surface-raised px-4 py-4">
      <p className="type-kicker text-ash">{label}</p>
      <p className="type-data mt-3 font-display text-3xl text-paper">{loading ? '—' : live ? count.value : 'Not connected'}</p>
      <p className="mt-2 text-xs text-ash">{live ? 'Live platform data' : 'Not connected'}</p>
      <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-stone">{source}</p>
    </article>
  )
}

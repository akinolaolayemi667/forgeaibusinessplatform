import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlatformActivity } from '@/components/super-admin/PlatformActivity'
import { PlatformGrowthChart } from '@/components/super-admin/PlatformGrowthChart'
import { PlatformKpiCard } from '@/components/super-admin/PlatformKpiCard'
import { PlatformOrganizations } from '@/components/super-admin/PlatformOrganizations'
import { PlatformQuickActions } from '@/components/super-admin/PlatformQuickActions'
import { PlatformRoleDistribution } from '@/components/super-admin/PlatformRoleDistribution'
import { SystemStatus } from '@/components/super-admin/SystemStatus'
import { useAuth } from '@/hooks/useAuth'
import { usePlatformOverview } from '@/hooks/usePlatformOverview'
import { cn } from '@/lib/cn'
import { rangeLabel } from '@/lib/platformOverview'
import type { PlatformRange } from '@/types/platformOverview'

const ranges: PlatformRange[] = ['7d', '30d', '90d', '12m']

export function SuperAdminDashboardPage() {
  const { isSuperAdmin } = useAuth()
  const platform = usePlatformOverview(isSuperAdmin)
  const view = platform.view
  const showLoading = platform.loading && !view

  return (
    <>
      <PageHeader
        eyebrow="Platform control"
        title="PLATFORM"
        description="Current totals stay current. The selected range applies only to growth and recorded activity."
        actions={
          <Button variant="outline" onClick={platform.reload} loading={platform.refreshing} disabled={!isSuperAdmin || showLoading}>
            Refresh
          </Button>
        }
      />
      <div role="tablist" aria-label="Platform date range" className="flex gap-2 overflow-x-auto">
        {ranges.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={platform.range === item}
            className={cn(
              'h-9 shrink-0 border px-3 font-mono text-[11px] uppercase tracking-[0.12em]',
              platform.range === item ? 'border-ember text-ember' : 'border-stroke text-ash hover:text-paper',
            )}
            onClick={() => platform.setRange(item)}
          >
            {rangeLabel(item)}
          </button>
        ))}
      </div>
      {platform.error ? (
        <p role="alert" className="text-sm text-badge-danger-fg">{platform.error} Try again.</p>
      ) : null}
      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform totals">
        <PlatformKpiCard label="Total organizations" metric={view?.organizations ?? null} detail="public.organizations" loading={showLoading} />
        <PlatformKpiCard label="Total users" metric={view?.users ?? null} detail="public.profiles. Not auth.users." loading={showLoading} />
        <PlatformKpiCard label="Platform admins" metric={view?.platformAdmins ?? null} detail="platform_roles.role = admin" loading={showLoading} />
        <PlatformKpiCard label="Super admins" metric={view?.superAdmins ?? null} detail="platform_roles.role = super_admin" loading={showLoading} />
        <PlatformKpiCard label="Organization members" metric={view?.organizationMembers ?? null} detail="public.organization_members" loading={showLoading} />
        <PlatformKpiCard label="Active organizations" metric={view?.activeOrganizations ?? null} detail="No persisted organization status." loading={showLoading} />
        <PlatformKpiCard label="Total leads" metric={view?.leads ?? null} detail="No platform lead table." loading={showLoading} />
        <PlatformKpiCard label="Total contacts" metric={view?.contacts ?? null} detail="No platform contact table." loading={showLoading} />
        <PlatformKpiCard label="Total opportunities" metric={view?.opportunities ?? null} detail="No platform opportunity table." loading={showLoading} />
        <PlatformKpiCard label="Total automations" metric={view?.automations ?? null} detail="No platform automation table." loading={showLoading} />
      </section>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <PlatformGrowthChart
          title="Organization growth"
          note="New and cumulative organizations from public.organizations.created_at. Cumulative includes records created before this range."
          points={view?.organizationGrowth ?? []}
          loading={showLoading}
          error={view?.organizationsGrowthStatus === 'unavailable' ? 'Unable to load organization growth.' : null}
          emptyTitle="No organizations"
          emptyDetail="No organizations have been created yet."
          hasRecords={(view?.organizations.value ?? 0) > 0}
        />
        <PlatformGrowthChart
          title="User growth"
          note="New and cumulative profile records from public.profiles.created_at. This does not read auth.users. Cumulative includes records created before this range."
          points={view?.userGrowth ?? []}
          loading={showLoading}
          error={view?.usersGrowthStatus === 'unavailable' ? 'Unable to load user growth.' : null}
          emptyTitle="No users"
          emptyDetail="No platform user profiles are available."
          hasRecords={(view?.users.value ?? 0) > 0}
        />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <PlatformRoleDistribution
          superAdmins={view?.superAdmins ?? { value: null, source: 'not_connected' }}
          platformAdmins={view?.platformAdmins ?? { value: null, source: 'not_connected' }}
          platformUsers={view?.platformUsers ?? { value: null, source: 'not_connected' }}
          loading={showLoading}
          status={view?.roleStatus ?? 'unavailable'}
        />
        <SystemStatus checks={view?.checks ?? []} loading={showLoading} />
      </div>
      <PlatformOrganizations
        rows={view?.organizationRows ?? []}
        loading={showLoading}
        error={view?.organizationsError ?? null}
        membersConnected={view?.membersStatus === 'live'}
      />
      <PlatformActivity rows={view?.activity ?? []} loading={showLoading} error={view?.activityError ?? null} />
      <PlatformQuickActions />
    </>
  )
}

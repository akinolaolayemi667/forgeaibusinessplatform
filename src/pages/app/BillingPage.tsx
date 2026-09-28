import { Link } from 'react-router-dom'
import { forgeData } from '@/data'
import { buttonStyles } from '@/components/ui/Button'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { StatCard } from '@/components/ui/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'
import { formatCurrency, formatDate } from '@/utils/format'

export function BillingPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`billing:${workspace.id}`, () => forgeData.getBilling(workspace.id))
  const billing = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Billing"
        title="Plan"
        description={`Sample subscription for ${workspace.name}. No card is charged.`}
      />
      <QueryState loading={query.loading} error={query.error}>
        {billing ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Monthly" value={formatCurrency(billing.monthlyAmount)} hint="Sample amount for the seats on this plan." />
              <StatCard label="Seats" value={String(billing.seats)} hint="Operators counted on the sample invoice." />
            </div>
            <Card>
              <CardTitle>{billing.planName}</CardTitle>
              <CardDescription>Renews {formatDate(billing.renewsOn)}</CardDescription>
              <p className="text-sm text-copy">{billing.note}</p>
              <Link to="/pricing" className={buttonStyles('outline')}>
                Compare plans
              </Link>
            </Card>
          </div>
        ) : null}
      </QueryState>
    </div>
  )
}

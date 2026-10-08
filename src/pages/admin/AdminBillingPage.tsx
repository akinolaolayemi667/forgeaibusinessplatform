import { useState } from 'react'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useBilling } from '@/hooks/useBilling'

const unavailableActions = ['Connect Stripe', 'Manage Billing', 'View Invoices'] as const

export function AdminBillingPage() {
  const { organization } = useAuth()
  const billing = useBilling(organization?.id ?? null)
  const [notice, setNotice] = useState<(typeof unavailableActions)[number] | null>(null)
  const seats = billing.view.seatsUsed

  return (
    <>
      <PageHeader
        title="BILLING"
        description="Stripe is not connected. This page shows the plan catalog and the live member count. It does not show a subscription, invoices, or payment methods."
      />
      <section className="grid min-w-0 gap-4 lg:grid-cols-2">
        <article className="min-w-0 border border-stroke bg-surface-raised p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="type-kicker text-ember">Subscription</p>
            <AdminStatusBadge status="Not connected" />
          </div>
          <h2 className="mt-3 font-display text-3xl text-paper sm:text-4xl">No subscription</h2>
          <p className="mt-3 text-sm text-ash">No billing provider is attached to this organization. A plan name, price, cycle, or next invoice is not available.</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div>
              <dt className="type-kicker text-ash">Connection</dt>
              <dd className="mt-1 text-paper">Not connected</dd>
            </div>
            <div>
              <dt className="type-kicker text-ash">Invoices</dt>
              <dd className="mt-1 text-paper">None</dd>
            </div>
            <div>
              <dt className="type-kicker text-ash">Payment methods</dt>
              <dd className="mt-1 text-paper">None</dd>
            </div>
          </dl>
        </article>
        <article className="min-w-0 border border-stroke bg-surface-raised p-5">
          <h2 className="font-display text-xl text-paper">Usage</h2>
          <p className="mt-1 text-sm text-ash">Only the live organization member count is shown. Automation and AI usage are not billing records.</p>
          <div className="mt-5 border border-stroke px-3 py-3">
            <p className="type-kicker text-ash">Members</p>
            <p className="mt-2 font-display text-3xl text-paper">{seats === null ? '—' : seats}</p>
            <p className="mt-1 text-sm text-ash">
              {billing.loading ? 'Loading member count.' : billing.error ? 'Member count unavailable.' : 'Live count from organization membership.'}
            </p>
          </div>
        </article>
      </section>
      <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="plan-architecture-title">
        <div className="border-b border-stroke px-4 py-4 sm:px-5">
          <h2 id="plan-architecture-title" className="font-display text-xl text-paper">Plan architecture</h2>
          <p className="mt-1 text-sm text-ash">Catalog entries for a future Stripe integration. None of these plans is assigned to this organization.</p>
        </div>
        <ul className="grid gap-px bg-stroke md:grid-cols-3">
          {billing.view.plans.map((plan) => (
            <li key={plan.id} className="bg-surface-raised px-4 py-4 sm:px-5">
              <p className="type-kicker text-ash">Not assigned</p>
              <h3 className="mt-2 font-display text-2xl text-paper">{plan.name}</h3>
              <p className="mt-2 text-sm text-ash">{plan.summary}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="grid min-w-0 gap-4 md:grid-cols-2">
        <article className="border border-stroke bg-surface-raised p-5">
          <h2 className="font-display text-xl text-paper">Invoices</h2>
          <p className="mt-3 text-sm text-ash">No invoices. Billing is not connected.</p>
        </article>
        <article className="border border-stroke bg-surface-raised p-5">
          <h2 className="font-display text-xl text-paper">Payment methods</h2>
          <p className="mt-3 text-sm text-ash">No payment methods. Billing is not connected.</p>
        </article>
      </section>
      <div className="flex flex-wrap gap-2">
        {unavailableActions.map((action) => (
          <Button key={action} variant="outline" onClick={() => setNotice(action)}>
            {action}
          </Button>
        ))}
      </div>
      <Modal open={notice !== null} title={notice ?? 'Billing'} description="Stripe is not connected. This action does not create a subscription, invoice, or payment method." onClose={() => setNotice(null)}>
        <div className="flex justify-end">
          <Button onClick={() => setNotice(null)}>Close</Button>
        </div>
      </Modal>
    </>
  )
}

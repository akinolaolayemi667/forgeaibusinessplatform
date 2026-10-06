import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { adminBilling } from '@/data/adminData'

const actions = ['Upgrade Plan', 'Manage Billing', 'View Invoices'] as const

export function AdminBillingPage() {
  const [notice, setNotice] = useState<(typeof actions)[number] | null>(null)
  const usage = [
    { label: 'Seats', value: `${adminBilling.seats.used} / ${adminBilling.seats.limit} seats`, ratio: adminBilling.seats.used / adminBilling.seats.limit },
    { label: 'Automations', value: `${adminBilling.automations.used} / ${adminBilling.automations.limit} automations`, ratio: adminBilling.automations.used / adminBilling.automations.limit },
    { label: 'AI usage', value: `${adminBilling.ai}% AI usage`, ratio: adminBilling.ai / 100 },
  ]

  return (
    <>
      <PageHeader title="BILLING" description="Plan and usage for this organization. Payments are not connected." />
      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <article className="border border-stroke bg-surface-raised p-5">
          <p className="type-kicker text-ember">Current Plan</p>
          <h2 className="mt-3 font-display text-4xl text-paper">{adminBilling.plan}</h2>
          <p className="type-data mt-3 text-2xl text-paper">
            {adminBilling.price} <span className="text-base text-ash">/ {adminBilling.period}</span>
          </p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div>
              <dt className="type-kicker text-ash">Billing Cycle</dt>
              <dd className="mt-1 text-paper">{adminBilling.cycle}</dd>
            </div>
            <div>
              <dt className="type-kicker text-ash">Next Invoice</dt>
              <dd className="mt-1 text-paper">{adminBilling.nextDate}</dd>
            </div>
          </dl>
        </article>
        <article className="border border-stroke bg-surface-raised p-5">
          <h2 className="font-display text-xl text-paper">Usage</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {usage.map((item) => (
              <li key={item.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-paper">{item.label}</p>
                  <p className="font-mono text-xs text-ash">{item.value}</p>
                </div>
                <div className="mt-2 h-1.5 bg-steel" role="meter" aria-label={item.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(item.ratio * 100)}>
                  <div className="h-full bg-ember" style={{ width: `${Math.round(item.ratio * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action} variant={action === 'Upgrade Plan' ? 'primary' : 'outline'} onClick={() => setNotice(action)}>
            {action}
          </Button>
        ))}
      </div>
      <Modal open={notice !== null} title={notice ?? 'Billing'} description="This control is interface-only. Stripe is not connected." onClose={() => setNotice(null)}>
        <div className="flex justify-end">
          <Button onClick={() => setNotice(null)}>Close</Button>
        </div>
      </Modal>
    </>
  )
}

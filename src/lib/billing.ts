import type { BillingView, PlanArchitecture } from '@/types/billing'

export const planArchitecture: PlanArchitecture[] = [
  { id: 'bench', name: 'Bench', summary: 'Catalog entry for a future small workspace plan. Not assigned to this organization.' },
  { id: 'studio', name: 'Studio', summary: 'Catalog entry for a future operating workspace plan. Not assigned to this organization.' },
  { id: 'professional', name: 'Professional', summary: 'Catalog entry for a future larger workspace plan. Not assigned to this organization.' },
]

export function billingView(seatsUsed: number | null): BillingView {
  return {
    connection: 'not_connected',
    subscription: null,
    invoices: [],
    paymentMethods: [],
    plans: planArchitecture,
    seatsUsed,
  }
}

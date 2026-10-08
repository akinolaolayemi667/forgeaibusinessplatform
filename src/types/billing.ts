export type BillingConnection = 'not_connected'

export type PlanArchitecture = {
  id: string
  name: string
  summary: string
}

export type BillingView = {
  connection: BillingConnection
  subscription: null
  invoices: []
  paymentMethods: []
  plans: PlanArchitecture[]
  seatsUsed: number | null
}

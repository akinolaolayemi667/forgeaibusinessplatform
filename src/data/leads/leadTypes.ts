export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Nurturing', 'Converted', 'Lost'] as const

export type LeadStatus = (typeof leadStatuses)[number]

export const leadOwners = ['Michael Reed', 'Daniel Brooks', 'Alicia Morgan', 'Sarah Johnson'] as const

export type LeadOwner = (typeof leadOwners)[number]

export const leadSourceNames = ['Website', 'Referral', 'LinkedIn', 'Google Ads', 'WhatsApp', 'Other'] as const

export type LeadSourceName = (typeof leadSourceNames)[number]

export type LeadScoreBand = 'HOT' | 'WARM' | 'COLD'

export type LeadEngagement = {
  emailOpens: number
  emailReplies: number
  websiteVisits: number
  messages: number
  calls: number
  lastEngagementAt: string
}

export type SalesLead = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title: string
  location: string
  source: LeadSourceName
  campaign: string
  landingPage: string
  status: LeadStatus
  score: number
  owner: string
  tags: string[]
  createdAt: string
  lastActivityAt: string
  engagement: LeadEngagement
}

export type LeadActivityType =
  | 'created'
  | 'form'
  | 'email'
  | 'assigned'
  | 'call'
  | 'status'
  | 'task'
  | 'conversation'
  | 'proposal'
  | 'note'
  | 'qualified'
  | 'converted'

export type LeadActivity = {
  id: string
  leadId: string
  type: LeadActivityType
  title: string
  description: string
  at: string
  actor: string
}

export type LeadTask = {
  id: string
  leadId: string
  title: string
  description: string
  dueAt: string
  priority: 'Low' | 'Medium' | 'High'
  assignee: string
  done: boolean
}

export type LeadNote = {
  id: string
  leadId: string
  body: string
  author: string
  at: string
}

export type LeadDraft = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title: string
  location: string
  source: LeadSourceName
  status: LeadStatus
  score: number
  owner: string
  tags: string[]
  notes: string
}

export type LeadSourceMix = {
  label: LeadSourceName
  share: number
}

export type LeadFlowStage = {
  stage: string
  count: number
}

export function leadName(lead: Pick<SalesLead, 'firstName' | 'lastName'>) {
  return `${lead.firstName} ${lead.lastName}`
}

export function scoreBand(score: number): LeadScoreBand {
  if (score >= 75) return 'HOT'
  if (score >= 50) return 'WARM'
  return 'COLD'
}

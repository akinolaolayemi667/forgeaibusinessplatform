import type { PipelineStageId } from '@/data/pipeline/pipelineStages'

export const opportunityPriorities = ['Low', 'Medium', 'High'] as const

export type OpportunityPriority = (typeof opportunityPriorities)[number]

export const lossReasons = ['Budget', 'Timing', 'Competitor', 'No Response', 'Not a Fit', 'Other'] as const

export type LossReason = (typeof lossReasons)[number]

export const opportunitySources = ['Website', 'Referral', 'LinkedIn', 'Google Ads', 'WhatsApp', 'Lead conversion', 'Other'] as const

export type OpportunitySource = (typeof opportunitySources)[number]

export const pipelineOwners = [
  { id: 'owner_michael', name: 'Michael Reed' },
  { id: 'owner_daniel', name: 'Daniel Brooks' },
  { id: 'owner_alicia', name: 'Alicia Morgan' },
  { id: 'owner_sarah', name: 'Sarah Johnson' },
] as const

export type PipelineOwnerId = (typeof pipelineOwners)[number]['id']

export type Opportunity = {
  id: string
  name: string
  companyId: string
  company: string
  contactId: string
  contact: string
  contactEmail: string
  contactPhone: string
  value: number
  probability: number
  stageId: PipelineStageId
  ownerId: string
  owner: string
  expectedCloseDate: string
  source: OpportunitySource
  priority: OpportunityPriority
  createdAt: string
  updatedAt: string
  lastActivityAt: string
  tags: string[]
  lossReason: LossReason | null
  previousStageId: PipelineStageId | null
}

export type OpportunityActivityType =
  | 'created'
  | 'converted'
  | 'call'
  | 'contact'
  | 'proposal'
  | 'email'
  | 'task'
  | 'stage'
  | 'note'
  | 'won'
  | 'lost'
  | 'restored'
  | 'owner'
  | 'value'

export type OpportunityActivity = {
  id: string
  opportunityId: string
  type: OpportunityActivityType
  title: string
  description: string
  at: string
  actor: string
}

export type OpportunityTask = {
  id: string
  opportunityId: string
  title: string
  description: string
  dueAt: string
  priority: OpportunityPriority
  assignee: string
  done: boolean
}

export type OpportunityNote = {
  id: string
  opportunityId: string
  body: string
  author: string
  at: string
}

export type OpportunityDraft = {
  name: string
  company: string
  contact: string
  contactEmail: string
  contactPhone: string
  value: number
  probability: number
  stageId: PipelineStageId
  ownerId: string
  expectedCloseDate: string
  source: OpportunitySource
  priority: OpportunityPriority
  tags: string[]
  notes: string
  lossReason: LossReason | null
}

export function ownerName(ownerId: string) {
  return pipelineOwners.find((owner) => owner.id === ownerId)?.name ?? pipelineOwners[0].name
}

export function weightedValue(value: number, probability: number) {
  return Math.round((value * probability) / 100)
}

const knownCompanies: Record<string, string> = {
  'northstar properties': 'co_northstar',
  'apex growth': 'co_apex',
  'vertex systems': 'co_vertex',
  'harborline logistics': 'co_harborline',
  'kiln works': 'co_kiln',
  'brightwater clinics': 'co_brightwater',
  'lumen freight': 'co_lumen',
  'paperroom studio': 'co_paperroom',
}

const knownContacts: Record<string, string> = {
  'sarah mitchell|co_northstar': 'ct_sarah',
  'james carter|co_apex': 'ct_james',
  'olivia brown|co_vertex': 'ct_olivia',
  'helen cho|co_northstar': 'ct_helen',
  'marcus ellison|co_harborline': 'ct_marcus',
  'priya nandakumar|co_kiln': 'ct_priya',
  'noah feldman|co_brightwater': 'ct_noah',
  'lana okoye|co_lumen': 'ct_lana',
  'evan price|co_apex': 'ct_evan',
  'mina alvarez|co_vertex': 'ct_mina',
  'chris dalton|co_paperroom': 'ct_chris',
  'ruth keller|co_harborline': 'ct_ruth',
  'omar said|co_lumen': 'ct_omar',
  'grace ito|co_brightwater': 'ct_grace',
  'leo martens|co_kiln': 'ct_leo',
  'nina petrova|co_northstar': 'ct_nina',
}

export function companyIdFor(name: string) {
  const known = knownCompanies[name.trim().toLowerCase()]
  if (known) return known
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `co_${slug || 'company'}`
}

export function contactIdFor(name: string, companyId: string) {
  return knownContacts[`${name.trim().toLowerCase()}|${companyId}`] ?? null
}

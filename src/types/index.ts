export type Workspace = {
  id: string
  name: string
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Member'
}

export type HomePoint = {
  id: string
  kicker: string
  title: string
  summary: string
}

export type FeatureArea = {
  id: string
  title: string
  summary: string
}

export type Plan = {
  id: string
  name: string
  price: string
  period: string
  description: string
  highlights: string[]
  featured: boolean
}

export type ArchitectureLayer = {
  id: string
  name: string
  detail: string
}

export type CaseStudy = {
  client: string
  sector: string
  summary: string
  outcomes: { label: string; value: string }[]
}

export type Metric = {
  id: string
  workspaceId: string
  label: string
  value: string
  delta: string
  direction: 'up' | 'down' | 'flat'
  hint: string
}

export type ChartPoint = {
  workspaceId: string
  label: string
  qualified: number
  won: number
}

export type LeadStatus = 'New' | 'Working' | 'Qualified' | 'Disqualified'

export type Lead = {
  id: string
  workspaceId: string
  name: string
  company: string
  email: string
  source: string
  status: LeadStatus
  score: number
  owner: string
  createdAt: string
}

export type Contact = {
  id: string
  workspaceId: string
  name: string
  company: string
  email: string
  title: string
  lastActivity: string
}

export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Verbal'

export type Deal = {
  id: string
  workspaceId: string
  name: string
  company: string
  stage: DealStage
  value: number
  owner: string
  closeDate: string
}

export type ConversationChannel = 'Email' | 'SMS' | 'Web'

export type Conversation = {
  id: string
  workspaceId: string
  contact: string
  channel: ConversationChannel
  preview: string
  updatedAt: string
  unread: boolean
}

export type AutomationStatus = 'Live' | 'Paused' | 'Draft'

export type Automation = {
  id: string
  workspaceId: string
  name: string
  trigger: string
  status: AutomationStatus
  runs: number
}

export type Briefing = {
  id: string
  workspaceId: string
  account: string
  summary: string
  nextStep: string
}

export type IntegrationStatus = 'Connected' | 'Available'

export type Integration = {
  id: string
  workspaceId: string
  name: string
  category: string
  status: IntegrationStatus
  owner: string
}

export type TeamMember = {
  id: string
  workspaceId: string
  name: string
  email: string
  role: SessionUser['role']
  focus: string
}

export type BillingSnapshot = {
  workspaceId: string
  planName: string
  monthlyAmount: number
  seats: number
  renewsOn: string
  note: string
}

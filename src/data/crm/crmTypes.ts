export const crmStatuses = ['New', 'Contacted', 'Qualified', 'Active', 'Customer', 'Inactive'] as const

export type CrmStatus = (typeof crmStatuses)[number]

export const crmOwners = ['Michael Reed', 'Daniel Brooks', 'Alicia Morgan', 'Sarah Johnson'] as const

export type CrmOwner = (typeof crmOwners)[number]

export const companyStatuses = ['Active', 'Prospect', 'Customer', 'Inactive'] as const

export type CompanyStatus = (typeof companyStatuses)[number]

export const taskPriorities = ['Low', 'Medium', 'High'] as const

export type TaskPriority = (typeof taskPriorities)[number]

export type CrmCompany = {
  id: string
  name: string
  industry: string
  website: string
  phone: string
  location: string
  owner: string
  status: CompanyStatus
  contactCount: number
  openOpportunities: number
  lastActivityAt: string
}

export type CrmContact = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyId: string
  title: string
  status: CrmStatus
  owner: string
  tags: string[]
  location: string
  source: string
  createdAt: string
  lastActivityAt: string
}

export type ActivityType = 'created' | 'email' | 'status' | 'note' | 'task' | 'conversation' | 'assigned' | 'company'

export type CrmActivity = {
  id: string
  contactId?: string
  companyId?: string
  type: ActivityType
  title: string
  description: string
  at: string
  actor: string
}

export type CrmTask = {
  id: string
  contactId?: string
  companyId?: string
  title: string
  description: string
  dueAt: string
  priority: TaskPriority
  assignee: string
  done: boolean
}

export type CrmNote = {
  id: string
  contactId?: string
  companyId?: string
  body: string
  author: string
  at: string
}

export type CrmBook = {
  contacts: number
  activeLeads: number
  companies: number
  followUps: number
}

export type ContactDraft = {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyId: string
  title: string
  status: CrmStatus
  owner: string
  tags: string[]
  location: string
}

export type TaskDraft = {
  title: string
  description: string
  dueAt: string
  priority: TaskPriority
  assignee: string
  contactId?: string
  companyId?: string
}

export type CompanyDraft = {
  name: string
  industry: string
  website: string
  phone: string
  location: string
  owner: string
  status: CompanyStatus
}

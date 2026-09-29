export { seedActivities } from '@/data/crm/activities'
export { seedCompanies } from '@/data/crm/companies'
export { contactName, seedContacts } from '@/data/crm/contacts'
export { seedNotes, seedTasks } from '@/data/crm/tasks'
export type {
  ActivityType,
  CompanyDraft,
  CompanyStatus,
  ContactDraft,
  CrmActivity,
  CrmBook,
  CrmCompany,
  CrmContact,
  CrmNote,
  CrmOwner,
  CrmStatus,
  CrmTask,
  TaskDraft,
  TaskPriority,
} from '@/data/crm/crmTypes'
export { companyStatuses, crmOwners, crmStatuses, taskPriorities } from '@/data/crm/crmTypes'
export { formatActivityWhen, formatDue, hoursAgo, hoursAhead, withinActivityWindow } from '@/data/crm/time'

export const crmBook = {
  contacts: 2847,
  activeLeads: 486,
  companies: 312,
  followUps: 38,
}

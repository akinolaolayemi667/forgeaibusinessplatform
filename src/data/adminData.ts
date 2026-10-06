export type AdminMetric = {
  id: string
  label: string
  value: string
  hint: string
}

export type AdminActivityCategory = 'Users' | 'CRM' | 'Automations' | 'AI' | 'Integrations' | 'Billing' | 'Security'

export type AdminActivityStatus = 'Success' | 'Warning' | 'Failed'

export type AdminActivityItem = {
  id: string
  clock: string
  day: string
  actor: string
  action: string
  resource: string
  status: AdminActivityStatus
  category: AdminActivityCategory
  title: string
  detail: string
}

export type AdminMemberRole = 'Owner' | 'Admin' | 'Member'
export type AdminMemberStatus = 'Active' | 'Invited' | 'Inactive'

export type AdminMember = {
  id: string
  name: string
  email: string
  role: AdminMemberRole
  status: AdminMemberStatus
  lastActive: string
  joined: string
}

export type AdminRange = '7D' | '30D' | '90D' | '12M'

export type AdminPoint = {
  label: string
  value: number
}

export type AdminAnalytics = {
  growth: AdminPoint[]
  userActivity: AdminPoint[]
  leadGrowth: AdminPoint[]
  automationRuns: AdminPoint[]
  aiUsage: AdminPoint[]
  conversion: AdminPoint[]
}

export const adminOrganization = {
  name: 'Harbor & Co.',
  slug: 'harbor-and-co',
  timezone: 'Europe/London',
  currency: 'USD',
}

export const adminMetrics: AdminMetric[] = [
  { id: 'users', label: 'Active Users', value: '24', hint: 'Seats currently signed in' },
  { id: 'leads', label: 'Leads', value: '1,284', hint: 'Open records this cycle' },
  { id: 'opportunities', label: 'Open Opportunities', value: '87', hint: 'Still moving through stages' },
  { id: 'automations', label: 'Automations', value: '36', hint: 'Live rules in this organization' },
  { id: 'ai', label: 'AI Usage', value: '72%', hint: 'Of the monthly allowance' },
]

export const adminActivity: AdminActivityItem[] = [
  { id: 'a1', clock: '09:42', day: 'Today', actor: 'Sarah Mitchell', action: 'Updated automation', resource: 'Lead Qualification', status: 'Success', category: 'Automations', title: 'Automation activated', detail: 'Lead qualification workflow enabled' },
  { id: 'a2', clock: '09:31', day: 'Today', actor: 'David Carter', action: 'Moved opportunity', resource: 'Acme Corp', status: 'Success', category: 'CRM', title: 'Pipeline updated', detail: '12 opportunities moved to Proposal' },
  { id: 'a3', clock: '09:20', day: 'Today', actor: 'System', action: 'Automation executed', resource: 'Lead Follow-up', status: 'Success', category: 'Automations', title: 'Automation executed', detail: 'Lead follow-up ran on schedule' },
  { id: 'a4', clock: '08:54', day: 'Today', actor: 'Sarah Mitchell', action: 'Added team member', resource: 'Michael Reed', status: 'Success', category: 'Users', title: 'New team member added', detail: 'Sarah Mitchell joined the organization' },
  { id: 'a5', clock: '08:11', day: 'Today', actor: 'System', action: 'Usage recorded', resource: 'AI allowance', status: 'Warning', category: 'AI', title: 'AI usage threshold', detail: 'AI usage reached 72%' },
  { id: 'a6', clock: '17:40', day: 'Yesterday', actor: 'Priya Shah', action: 'Connected integration', resource: 'HubSpot', status: 'Success', category: 'Integrations', title: 'Integration connected', detail: 'HubSpot connected successfully' },
  { id: 'a7', clock: '16:05', day: 'Yesterday', actor: 'David Carter', action: 'Updated invoice contact', resource: 'Billing profile', status: 'Success', category: 'Billing', title: 'Billing contact updated', detail: 'Invoice recipient set to finance@harbor.co' },
  { id: 'a8', clock: '11:18', day: 'Yesterday', actor: 'System', action: 'Signed in', resource: 'Google', status: 'Success', category: 'Security', title: 'Sign-in recorded', detail: 'Google session opened for David Carter' },
  { id: 'a9', clock: '10:02', day: 'Oct 4', actor: 'Sarah Mitchell', action: 'Paused automation', resource: 'Quiet thread', status: 'Warning', category: 'Automations', title: 'Automation paused', detail: 'Quiet thread rule was paused' },
  { id: 'a10', clock: '15:22', day: 'Oct 4', actor: 'System', action: 'Briefing generated', resource: 'Peck Freight', status: 'Success', category: 'AI', title: 'Briefing generated', detail: 'Assistant prepared a reply brief' },
]

export const adminMembers: AdminMember[] = [
  { id: 'u1', name: 'Sarah Mitchell', email: 'sarah@harbor.co', role: 'Admin', status: 'Active', lastActive: 'Today, 09:42', joined: 'Mar 12, 2026' },
  { id: 'u2', name: 'David Carter', email: 'david@harbor.co', role: 'Member', status: 'Active', lastActive: 'Today, 09:31', joined: 'Apr 2, 2026' },
  { id: 'u3', name: 'Michael Reed', email: 'michael@harbor.co', role: 'Member', status: 'Invited', lastActive: 'Invite pending', joined: 'Oct 6, 2026' },
  { id: 'u4', name: 'Priya Shah', email: 'priya@harbor.co', role: 'Member', status: 'Active', lastActive: 'Yesterday', joined: 'May 19, 2026' },
  { id: 'u5', name: 'Jonah Peck', email: 'jonah@peckfreight.co', role: 'Member', status: 'Inactive', lastActive: 'Sep 2, 2026', joined: 'Jan 8, 2026' },
  { id: 'u6', name: 'Lena Voss', email: 'lena@vossclinic.co', role: 'Admin', status: 'Active', lastActive: 'Today, 08:05', joined: 'Feb 14, 2026' },
  { id: 'u7', name: 'Nia Okonkwo', email: 'nia@harbor.co', role: 'Owner', status: 'Active', lastActive: 'Today, 07:48', joined: 'Nov 3, 2025' },
  { id: 'u8', name: 'Amira Solano', email: 'amira@solano.co', role: 'Member', status: 'Invited', lastActive: 'Invite pending', joined: 'Oct 1, 2026' },
]

export const adminRanges: AdminRange[] = ['7D', '30D', '90D', '12M']

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const month = ['W1', 'W2', 'W3', 'W4']
const quarter = ['Aug', 'Sep', 'Oct']
const year = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

function series(labels: string[], start: number, step: number): AdminPoint[] {
  return labels.map((label, index) => ({ label, value: start + index * step }))
}

export const analyticsByRange: Record<AdminRange, AdminAnalytics> = {
  '7D': {
    growth: series(week, 18, 2),
    userActivity: series(week, 40, 6),
    leadGrowth: series(week, 22, 4),
    automationRuns: series(week, 30, 5),
    aiUsage: series(week, 58, 2),
    conversion: series(week, 14, 1),
  },
  '30D': {
    growth: series(month, 62, 11),
    userActivity: series(month, 180, 24),
    leadGrowth: series(month, 90, 18),
    automationRuns: series(month, 140, 22),
    aiUsage: series(month, 61, 4),
    conversion: series(month, 15, 1),
  },
  '90D': {
    growth: series(quarter, 210, 36),
    userActivity: series(quarter, 540, 70),
    leadGrowth: series(quarter, 280, 48),
    automationRuns: series(quarter, 410, 55),
    aiUsage: series(quarter, 54, 9),
    conversion: series(quarter, 13, 2),
  },
  '12M': {
    growth: series(year, 40, 8),
    userActivity: series(year, 120, 18),
    leadGrowth: series(year, 70, 12),
    automationRuns: series(year, 90, 14),
    aiUsage: series(year, 28, 4),
    conversion: series(year, 9, 1),
  },
}

export const adminPerformance = [
  { id: 'conversion', label: 'Lead conversion', value: '18%', hint: 'Qualified leads that reached a proposal', points: analyticsByRange['30D'].conversion },
  { id: 'execution', label: 'Automation execution', value: '36 live', hint: 'Rules that ran in the last 30 days', points: analyticsByRange['30D'].automationRuns },
  { id: 'team', label: 'Team activity', value: '24 active', hint: 'Members with a session this week', points: analyticsByRange['30D'].userActivity },
  { id: 'ai', label: 'AI usage', value: '72%', hint: 'Allowance consumed this cycle', points: analyticsByRange['30D'].aiUsage },
]

export const adminBilling = {
  plan: 'PROFESSIONAL',
  price: '$299',
  period: 'month',
  nextDate: 'October 30, 2026',
  cycle: 'Sep 30 – Oct 30, 2026',
  seats: { used: 24, limit: 50 },
  automations: { used: 36, limit: 100 },
  ai: 72,
}

export const adminIntegrations = [
  { id: 'hubspot', name: 'HubSpot', state: 'Connected' },
  { id: 'gmail', name: 'Gmail', state: 'Connected' },
  { id: 'slack', name: 'Slack', state: 'Available' },
]

export const adminNotificationDefaults = {
  email: true,
  automation: true,
  team: false,
  billing: true,
}

export const activityCategories = ['All', 'Users', 'CRM', 'Automations', 'AI', 'Integrations', 'Billing', 'Security'] as const

export const memberRoles: AdminMemberRole[] = ['Owner', 'Admin', 'Member']
export const memberStatuses: AdminMemberStatus[] = ['Active', 'Invited', 'Inactive']

export const adminPageSize = 5

export function paginate<T>(rows: T[], page: number, size = adminPageSize) {
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const current = Math.min(Math.max(page, 1), pages)
  const start = (current - 1) * size
  return { pages, current, rows: rows.slice(start, start + size) }
}

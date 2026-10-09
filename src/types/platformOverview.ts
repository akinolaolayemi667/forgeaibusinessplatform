export type MetricSource = 'live' | 'not_connected'

export type PlatformMetric = {
  value: number | null
  source: MetricSource
}

export type PlatformRange = '7d' | '30d' | '90d' | '12m'

export type GrowthPoint = {
  label: string
  created: number
  cumulative: number
}

export type PlatformOrganization = {
  id: string
  name: string
  slug: string
  createdAt: string
  members: number | null
}

export type PlatformActivityEvent = {
  id: string
  createdAt: string
  actorName: string
  action: string
  organizationName: string
  target: string
}

export type SystemState = 'operational' | 'configured' | 'not_connected' | 'not_verified'

export type SystemCheck = {
  id: string
  label: string
  state: SystemState
  detail: string
}

export type PlatformSnapshot = {
  organizations: PlatformMetric
  users: PlatformMetric
  platformAdmins: PlatformMetric
  superAdmins: PlatformMetric
  organizationMembers: PlatformMetric
  activeOrganizations: PlatformMetric
  leads: PlatformMetric
  contacts: PlatformMetric
  opportunities: PlatformMetric
  automations: PlatformMetric
  organizationRows: PlatformOrganization[]
  organizationsStatus: 'live' | 'unavailable'
  organizationsError: string | null
  membersStatus: MetricSource
  organizationDates: string[]
  organizationsGrowthStatus: 'live' | 'unavailable'
  profileDates: string[]
  usersGrowthStatus: 'live' | 'unavailable'
  roleStatus: 'live' | 'unavailable'
  platformUsers: PlatformMetric
  activity: PlatformActivityEvent[]
  activityStatus: 'live' | 'unavailable'
  activityError: string | null
  checks: SystemCheck[]
}

export const notConnected: PlatformMetric = { value: null, source: 'not_connected' }

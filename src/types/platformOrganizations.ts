import type { AuditLog } from '@/types/auditLogs'
import type { OrganizationMemberRole } from '@/types/organizationMember'

export const organizationPageSize = 25

export const organizationSorts = [
  'created_desc',
  'created_asc',
  'name_asc',
  'name_desc',
  'slug_asc',
  'slug_desc',
] as const

export type OrganizationSort = (typeof organizationSorts)[number]

export type PlatformOrganizationRow = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  members: number | null
}

export type PlatformOrganizationDirectory = {
  rows: PlatformOrganizationRow[]
  total: number
  membersStatus: 'live' | 'not_connected'
}

export type PlatformOrganizationProfile = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type PlatformOrganizationMember = {
  id: string
  userId: string
  role: OrganizationMemberRole
  joinedAt: string
  name: string
  email: string
}

export type PlatformOrganizationDetail = {
  state: 'found'
  organization: PlatformOrganizationProfile
  members: PlatformOrganizationMember[]
  memberCount: number | null
  membersError: string | null
  audit: AuditLog[]
  auditError: string | null
}

export type PlatformOrganizationLookup =
  | PlatformOrganizationDetail
  | { state: 'missing' }

export const platformRoles = ['super_admin', 'admin', 'user'] as const
export type PlatformRole = (typeof platformRoles)[number]

export const organizationRoles = ['owner', 'admin', 'member'] as const
export type OrganizationRole = (typeof organizationRoles)[number]

export const permissions = [
  'platform.organizations',
  'platform.users',
  'platform.admins',
  'platform.analytics',
  'platform.settings',
  'platform.billing',
  'platform.ai',
  'platform.audit',
  'org.users',
  'org.settings',
  'org.analytics',
  'org.crm',
  'org.automations',
  'org.integrations',
  'org.billing',
  'workspace.access',
] as const

export type Permission = (typeof permissions)[number]

export type OrganizationSummary = {
  id: string
  name: string
  slug: string
}

export type OrganizationMembership = OrganizationSummary & {
  role: OrganizationRole
}

export type Authorization =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'unavailable' }
  | {
      status: 'ready'
      platformRole: PlatformRole
      organization: OrganizationSummary | null
      organizationRole: OrganizationRole | null
      memberships: OrganizationMembership[]
    }

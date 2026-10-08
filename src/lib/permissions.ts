import type { Authorization, OrganizationRole, Permission, PlatformRole } from '@/types/roles'

const organizationPermissions: Permission[] = [
  'org.users',
  'org.settings',
  'org.analytics',
  'org.crm',
  'org.automations',
  'org.integrations',
  'org.billing',
  'workspace.access',
]

const platformPermissions: Permission[] = [
  'platform.organizations',
  'platform.users',
  'platform.admins',
  'platform.analytics',
  'platform.settings',
  'platform.billing',
  'platform.ai',
  'platform.audit',
]

export function signedInConsoles(access: { isAdmin: boolean; isSuperAdmin: boolean }) {
  return [
    ...(access.isAdmin ? [{ id: 'organization-admin', to: '/admin', label: 'Admin' }] : []),
    ...(access.isSuperAdmin ? [{ id: 'platform-control', to: '/super-admin', label: 'Super admin' }] : []),
  ]
}

export function defaultSignedInPath(access: { isAdmin: boolean; isSuperAdmin: boolean }) {
  if (access.isSuperAdmin) return '/super-admin'
  if (access.isAdmin) return '/admin'
  return '/app'
}

export function isSuperAdmin(access: Authorization) {
  return access.status === 'ready' && access.platformRole === 'super_admin'
}

export function isAdmin(access: Authorization) {
  if (access.status !== 'ready') return false
  if (access.platformRole === 'super_admin' || access.platformRole === 'admin') return true
  return access.memberships.some((membership) => membership.role === 'owner' || membership.role === 'admin')
}

export function hasRole(access: Authorization, role: PlatformRole | OrganizationRole) {
  if (access.status !== 'ready') return false
  if (role === 'super_admin' || role === 'user') return access.platformRole === role
  if (role === 'owner' || role === 'member') return access.memberships.some((membership) => membership.role === role)
  return access.platformRole === 'admin' || access.memberships.some((membership) => membership.role === 'admin')
}

export function hasPermission(access: Authorization, permission: Permission) {
  if (access.status !== 'ready') return false
  if (isSuperAdmin(access)) return true
  if (permission === 'workspace.access') return true
  if (platformPermissions.includes(permission)) return false
  return isAdmin(access) && organizationPermissions.includes(permission)
}

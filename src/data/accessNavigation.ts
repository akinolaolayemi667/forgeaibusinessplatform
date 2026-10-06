import type { Authorization } from '@/types/roles'
import { isAdmin, isSuperAdmin } from '@/lib/permissions'

export type AccessNavItem = {
  to: string
  label: string
  end?: boolean
}

export const adminNavigation: AccessNavItem[] = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users & Team' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/activity', label: 'Activity' },
  { to: '/admin/billing', label: 'Billing' },
  { to: '/admin/settings', label: 'Settings' },
]

export const superAdminNavigation: AccessNavItem[] = [
  { to: '/super-admin', label: 'Platform Administration' },
  { to: '/admin', label: 'Organization Administration' },
]

export function administrationItems(access: Authorization): AccessNavItem[] {
  if (isSuperAdmin(access)) return superAdminNavigation
  if (isAdmin(access)) return adminNavigation
  return []
}

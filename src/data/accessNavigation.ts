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

export type PlatformNavGroup = {
  id: string
  label: string
  items: AccessNavItem[]
}

export const platformNavigation: PlatformNavGroup[] = [
  {
    id: 'platform',
    label: 'Platform',
    items: [
      { to: '/super-admin', label: 'Dashboard', end: true },
      { to: '/super-admin/organizations', label: 'Organizations' },
      { to: '/super-admin/users', label: 'Users' },
      { to: '/super-admin/admins', label: 'Admins' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      { to: '/super-admin/analytics', label: 'Analytics' },
      { to: '/super-admin/revenue', label: 'Revenue' },
      { to: '/super-admin/ai-usage', label: 'AI Usage' },
    ],
  },
  {
    id: 'configuration',
    label: 'Configuration',
    items: [
      { to: '/super-admin/plans', label: 'Plans' },
      { to: '/super-admin/integrations', label: 'Integrations' },
      { to: '/super-admin/system', label: 'System' },
      { to: '/super-admin/audit-logs', label: 'Audit Logs' },
      { to: '/super-admin/settings', label: 'Settings' },
    ],
  },
]

export const superAdminNavigation: AccessNavItem[] = platformNavigation.flatMap((group) => group.items)

export function administrationItems(access: Authorization): AccessNavItem[] {
  if (isSuperAdmin(access)) return superAdminNavigation
  if (isAdmin(access)) return adminNavigation
  return []
}

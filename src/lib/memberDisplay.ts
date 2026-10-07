import type { OrganizationMember } from '@/types/organizationMember'

const roleLabel = { owner: 'Owner', admin: 'Admin', member: 'Member' } as const

export function displayRole(role: OrganizationMember['role']) {
  return roleLabel[role]
}

export function formatJoined(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

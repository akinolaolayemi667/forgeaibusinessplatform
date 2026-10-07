import type { OrganizationMember } from '@/types/organizationMember'
import type { OrganizationRole } from '@/types/roles'

export function ownerCount(members: OrganizationMember[]) {
  return members.filter((member) => member.role === 'owner').length
}

export function inviteRoles(organizationRole: OrganizationRole | null, superAdmin: boolean) {
  if (superAdmin || organizationRole === 'owner') return ['admin', 'member'] as const
  if (organizationRole === 'admin') return ['member'] as const
  return [] as const
}

export function canChangeMemberRole(
  member: OrganizationMember,
  actorId: string,
  organizationRole: OrganizationRole | null,
  superAdmin: boolean,
  owners: number,
) {
  if (!superAdmin && organizationRole !== 'owner') return false
  if (member.userId === actorId) return false
  if (member.role === 'owner' && owners <= 1) return false
  return true
}

export function canRemoveMember(
  member: OrganizationMember,
  actorId: string,
  organizationRole: OrganizationRole | null,
  superAdmin: boolean,
  owners: number,
) {
  if (member.userId === actorId) return false
  if (member.role === 'owner' && owners <= 1) return false
  if (superAdmin || organizationRole === 'owner') return true
  return organizationRole === 'admin' && member.role === 'member'
}

export function membershipHint(
  member: OrganizationMember,
  actorId: string,
  owners: number,
) {
  if (member.userId === actorId) return 'You cannot change your own membership.'
  if (member.role === 'owner' && owners <= 1) return 'The only organization owner must stay in place.'
  return undefined
}

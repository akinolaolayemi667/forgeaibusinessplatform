export type OrganizationMemberRole = 'owner' | 'admin' | 'member'

export type OrganizationMember = {
  id: string
  userId: string
  organizationId: string
  role: OrganizationMemberRole
  joinedAt: string
  name: string
  email: string
  avatarUrl: string | null
  status: 'active'
}

export type AssignableMemberRole = OrganizationMemberRole

export type MembershipActivity =
  | { type: 'member_invited'; organizationId: string; email: string; role: AssignableMemberRole }
  | { type: 'role_changed'; organizationId: string; userId: string; role: AssignableMemberRole }
  | { type: 'member_removed'; organizationId: string; userId: string }

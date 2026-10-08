import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AssignableMemberRole, OrganizationMember, OrganizationMemberRole } from '@/types/organizationMember'

type MembershipRow = {
  id: string
  user_id: string
  organization_id: string
  role: string
  created_at: string
}

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const membership = await supabase
    .from('organization_members')
    .select('id, user_id, organization_id, role, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: true })

  if (membership.error) throw membership.error
  const rows = (membership.data ?? []) as MembershipRow[]
  const ids = rows.map((row) => row.user_id)
  const profileMap = new Map<string, ProfileRow>()

  if (ids.length > 0) {
    const profiles = await supabase.from('profiles').select('id, full_name, email, avatar_url').in('id', ids)
    if (profiles.error) throw profiles.error
    for (const profile of (profiles.data ?? []) as ProfileRow[]) {
      profileMap.set(profile.id, profile)
    }
  }

  return rows.flatMap((row) => {
    const role = asRole(row.role)
    if (!role || row.organization_id !== organizationId) return []
    const profile = profileMap.get(row.user_id)
    const email = profile?.email?.trim() || ''
    const name = profile?.full_name?.trim() || ''
    return [{
      id: row.id,
      userId: row.user_id,
      organizationId: row.organization_id,
      role,
      joinedAt: row.created_at,
      name,
      email,
      avatarUrl: profile?.avatar_url ?? null,
      status: 'active' as const,
    }]
  })
}

export function withSessionIdentity(members: OrganizationMember[], user: User | null) {
  if (!user) return members
  const sessionEmail = user.email?.trim() || ''
  const sessionName = metadataText(user.user_metadata, ['full_name', 'name', 'preferred_username'])
  const sessionAvatar = metadataText(user.user_metadata, ['avatar_url'])
  return members.map((member) => {
    if (member.userId !== user.id) return member
    const email = member.email || sessionEmail
    const name = member.name || sessionName || email
    return {
      ...member,
      email,
      name,
      avatarUrl: member.avatarUrl || sessionAvatar || null,
    }
  })
}

// A successful role change is recorded by organization_members_audit_update. Do not insert an audit row here.
export async function updateOrganizationMemberRole(membershipId: string, role: AssignableMemberRole) {
  const { data, error } = await supabase.from('organization_members').update({ role }).eq('id', membershipId).select('id')
  if (error) throw error
  if (!changed(data)) throw new Error('not_authorized')
}

// A successful removal is recorded by organization_members_audit_delete. Do not insert an audit row here.
export async function removeOrganizationMember(membershipId: string) {
  const { data, error } = await supabase.from('organization_members').delete().eq('id', membershipId).select('id')
  if (error) throw error
  if (!changed(data)) throw new Error('not_authorized')
}

export function memberMessage(error: unknown, fallback: string) {
  const message = errorText(error)
  if (/account_not_found/i.test(message)) {
    return 'That email does not have a FORGE account yet. Sending a new-account invitation needs a server-side endpoint.'
  }
  if (/already_member/i.test(message)) return 'That person is already in this organization.'
  if (/cannot_remove_self/i.test(message)) return 'You cannot remove yourself from the organization.'
  if (/cannot_remove_only_owner|cannot_assign_owner/i.test(message)) return 'The only organization owner must stay in place.'
  if (/cannot_change_own_role/i.test(message)) return 'You cannot change your own role.'
  if (/not_authorized|permission denied|row-level security/i.test(message)) return 'You do not have permission to change this membership.'
  if (/invalid_role/i.test(message)) return 'Choose Owner, Admin, or Member.'
  return fallback
}

function errorText(error: unknown) {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
  return ''
}

function changed(data: unknown) {
  return Array.isArray(data) && data.length > 0
}

function metadataText(metadata: unknown, keys: string[]) {
  if (!metadata || typeof metadata !== 'object') return ''
  const record = metadata as Record<string, unknown>
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function asRole(value: unknown): OrganizationMemberRole | null {
  if (value === 'owner' || value === 'admin' || value === 'member') return value
  return null
}

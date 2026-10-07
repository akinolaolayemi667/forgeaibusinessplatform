import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { AdminMetricCard } from '@/components/admin/AdminMetricCard'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import {
  ChangeRoleModal,
  InviteMemberModal,
  MemberDetailModal,
  RemoveMemberModal,
} from '@/components/admin/MemberDialogs'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { displayRole, formatJoined } from '@/lib/memberDisplay'
import { recordMembershipActivity } from '@/lib/membershipActivity'
import { memberMessage, removeOrganizationMember, updateOrganizationMemberRole, withSessionIdentity } from '@/lib/organizationMembers'
import { canChangeMemberRole, canRemoveMember, inviteRoles, membershipHint, ownerCount } from '@/lib/teamAccess'
import type { AssignableMemberRole, OrganizationMember } from '@/types/organizationMember'

type RoleFilter = 'all' | 'owner' | 'admin' | 'member'

export function AdminUsersPage() {
  const { user, organization, organizationRole, isSuperAdmin, accessStatus } = useAuth()
  const organizationId = organization?.id ?? null
  const { members, loading, error, reload } = useOrganizationMembers(organizationId)
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')
  const [inviteOpen, setInviteOpen] = useState(false)
  const showInvite = inviteOpen || params.get('invite') === '1'
  const [detail, setDetail] = useState<OrganizationMember | null>(null)
  const [roleTarget, setRoleTarget] = useState<OrganizationMember | null>(null)
  const [removeTarget, setRemoveTarget] = useState<OrganizationMember | null>(null)
  const [pending, setPending] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const actorId = user?.id ?? ''
  const roles = inviteRoles(organizationRole, isSuperAdmin)
  const denied = accessStatus === 'ready' && !isSuperAdmin && organizationRole === 'member'

  function closeInvite() {
    setInviteOpen(false)
    setActionError(null)
    if (params.get('invite') !== '1') return
    const next = new URLSearchParams(params)
    next.delete('invite')
    setParams(next, { replace: true })
  }

  const roster = useMemo(
    () =>
      withSessionIdentity(members, user).map((member) => ({
        ...member,
        name: member.name || 'Name unavailable',
        email: member.email || 'Email unavailable',
      })),
    [members, user],
  )
  const owners = ownerCount(roster)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return roster.filter((member) => {
      const matchesQuery = !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
      const matchesRole = role === 'all' || member.role === role
      return matchesQuery && matchesRole
    })
  }, [roster, role, search])

  const stats = [
    { id: 'total', label: 'Total members', value: String(roster.length), hint: 'People in this organization' },
    { id: 'admins', label: 'Admins', value: String(roster.filter((member) => member.role === 'owner' || member.role === 'admin').length), hint: 'Owners and admins' },
    { id: 'members', label: 'Members', value: String(roster.filter((member) => member.role === 'member').length), hint: 'Workspace access' },
    { id: 'pending', label: 'Pending invites', value: '0', hint: 'No invitation records are stored' },
  ]

  function openDetail(member: OrganizationMember) {
    setActionError(null)
    setDetail(member)
  }

  async function saveRole(nextRole: AssignableMemberRole) {
    if (!roleTarget || !organizationId) return
    setPending(true)
    setActionError(null)
    try {
      await updateOrganizationMemberRole(roleTarget.id, nextRole)
      recordMembershipActivity({ type: 'role_changed', organizationId, userId: roleTarget.userId, role: nextRole })
      setRoleTarget(null)
      setDetail(null)
      setNotice('Role updated.')
      await reload()
    } catch (caught) {
      if (import.meta.env.DEV) console.info('role update', caught)
      setActionError(memberMessage(caught, 'Unable to update member role.'))
    } finally {
      setPending(false)
    }
  }

  async function confirmRemove() {
    if (!removeTarget || !organizationId) return
    setPending(true)
    setActionError(null)
    try {
      await removeOrganizationMember(removeTarget.id)
      recordMembershipActivity({ type: 'member_removed', organizationId, userId: removeTarget.userId })
      setRemoveTarget(null)
      setDetail(null)
      setNotice('Member removed.')
      await reload()
    } catch (caught) {
      if (import.meta.env.DEV) console.info('member removal', caught)
      setActionError(memberMessage(caught, 'Unable to remove member.'))
    } finally {
      setPending(false)
    }
  }

  function sendInvite() {
    setActionError('Invitation setup requires a secure server-side function.')
  }

  return (
    <>
      <PageHeader
        title="USERS & TEAM"
        description="Manage organization members, roles and access."
        actions={
          <Button onClick={() => { setActionError(null); setInviteOpen(true) }} disabled={!organizationId || roles.length === 0}>
            + INVITE MEMBER
          </Button>
        }
      />
      {notice ? (
        <p role="status" className="border border-stroke bg-surface-raised px-4 py-3 text-sm text-paper">
          {notice}
        </p>
      ) : null}
      {denied ? (
        <p role="alert" className="border border-stroke bg-surface-raised px-4 py-6 text-sm text-ash">
          You do not have permission to manage this organization.
        </p>
      ) : null}
      {!denied && accessStatus === 'ready' && !organization ? (
        <p className="border border-stroke bg-surface-raised px-4 py-6 text-sm text-ash">
          No organization is attached to this session.
        </p>
      ) : null}
      {!denied && organization ? (
        <>
          <section aria-label="Team totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((metric) => (
              <AdminMetricCard key={metric.id} metric={loading ? { ...metric, value: '—' } : metric} />
            ))}
          </section>
          <AdminFilters
            search={search}
            onSearch={setSearch}
            placeholder="Search by name or email"
            filters={[
              {
                id: 'role',
                label: 'Role',
                value: role,
                onChange: (value) => setRole(value === 'owner' || value === 'admin' || value === 'member' ? value : 'all'),
                options: [
                  { value: 'all', label: 'All' },
                  { value: 'owner', label: 'Owner' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'member', label: 'Member' },
                ],
              },
            ]}
          />
          {loading ? <MemberSkeleton /> : null}
          {error ? (
            <div className="border border-stroke bg-surface-raised px-4 py-6" role="alert">
              <p className="text-sm text-paper">Unable to load team members.</p>
              <Button className="mt-3" variant="outline" onClick={() => void reload()}>
                Try again
              </Button>
            </div>
          ) : null}
          {!loading && !error && roster.length === 0 ? (
            <div className="border border-stroke bg-surface-raised px-4 py-8">
              <h2 className="font-display text-2xl text-paper">NO TEAM MEMBERS</h2>
              <p className="mt-2 max-w-md text-sm text-ash">This organization has no membership records.</p>
            </div>
          ) : null}
          {!loading && !error && roster.length > 0 && filtered.length === 0 ? (
            <div className="border border-stroke bg-surface-raised px-4 py-8">
              <h2 className="font-display text-2xl text-paper">NO MEMBERS FOUND</h2>
              <p className="mt-2 max-w-md text-sm text-ash">No one in this organization matches that name, email, or role.</p>
            </div>
          ) : null}
          {!loading && !error && filtered.length > 0 ? (
            <>
              <div className="hidden md:block">
                <AdminDataTable
                  caption="Organization members"
                  rows={filtered}
                  rowKey={(member) => member.id}
                  empty="NO MEMBERS FOUND"
                  minWidthClass="min-w-0"
                  overflowClass="overflow-visible"
                  onRowClick={openDetail}
                  columns={[
                    {
                      key: 'user',
                      header: 'User',
                      render: (member) => (
                        <span className="flex items-center gap-3">
                          <Avatar name={member.name} src={member.avatarUrl ?? undefined} size="sm" />
                          <span>
                            <span className="block text-paper">{member.name}</span>
                            <span className="block text-xs text-ash lg:hidden">{member.email}</span>
                          </span>
                        </span>
                      ),
                    },
                    { key: 'email', header: 'Email', className: 'hidden lg:table-cell', render: (member) => member.email },
                    { key: 'role', header: 'Role', render: (member) => <AdminStatusBadge status={displayRole(member.role)} /> },
                    { key: 'status', header: 'Status', render: () => <AdminStatusBadge status="Active" /> },
                    { key: 'joined', header: 'Joined', className: 'hidden lg:table-cell', render: (member) => formatJoined(member.joinedAt) },
                    {
                      key: 'actions',
                      header: 'Actions',
                      render: (member) => (
                        <MemberActions
                          member={member}
                          actorId={actorId}
                          organizationRole={organizationRole}
                          superAdmin={isSuperAdmin}
                          owners={owners}
                          onDetail={() => openDetail(member)}
                          onRole={() => { setActionError(null); setRoleTarget(member) }}
                          onRemove={() => { setActionError(null); setRemoveTarget(member) }}
                        />
                      ),
                    },
                  ]}
                />
              </div>
              <ul className="flex flex-col gap-3 md:hidden">
                {filtered.map((member) => (
                  <li key={member.id} className="border border-stroke bg-surface-raised p-4">
                    <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => openDetail(member)}>
                      <Avatar name={member.name} src={member.avatarUrl ?? undefined} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-paper">{member.name}</span>
                        <span className="block truncate text-xs text-ash">{member.email}</span>
                      </span>
                    </button>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <AdminStatusBadge status={displayRole(member.role)} />
                      <AdminStatusBadge status="Active" />
                      <span className="font-mono text-[11px] text-ash">{formatJoined(member.joinedAt)}</span>
                    </div>
                    <div className="mt-3">
                      <MemberActions
                        member={member}
                        actorId={actorId}
                        organizationRole={organizationRole}
                        superAdmin={isSuperAdmin}
                        owners={owners}
                        onDetail={() => openDetail(member)}
                        onRole={() => { setActionError(null); setRoleTarget(member) }}
                        onRemove={() => { setActionError(null); setRemoveTarget(member) }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : null}
      <InviteMemberModal
        key={showInvite ? 'invite-open' : 'invite-closed'}
        open={showInvite}
        roles={roles}
        pending={pending}
        error={actionError}
        onClose={() => { if (!pending) closeInvite() }}
        onInvite={() => sendInvite()}
      />
      <MemberDetailModal
        member={detail}
        organization={organization?.name ?? 'Organization'}
        canChange={detail ? canChangeMemberRole(detail, actorId, organizationRole, isSuperAdmin, owners) : false}
        canRemove={detail ? canRemoveMember(detail, actorId, organizationRole, isSuperAdmin, owners) : false}
        hint={detail ? membershipHint(detail, actorId, owners) : undefined}
        onClose={() => setDetail(null)}
        onChangeRole={() => { if (detail) { setActionError(null); setRoleTarget(detail); setDetail(null) } }}
        onRemove={() => { if (detail) { setActionError(null); setRemoveTarget(detail); setDetail(null) } }}
      />
      <ChangeRoleModal
        key={roleTarget?.id ?? 'role'}
        member={roleTarget}
        pending={pending}
        error={actionError}
        onClose={() => { if (!pending) { setRoleTarget(null); setActionError(null) } }}
        onSave={(nextRole) => void saveRole(nextRole)}
      />
      <RemoveMemberModal
        member={removeTarget}
        pending={pending}
        error={actionError}
        onClose={() => { if (!pending) { setRemoveTarget(null); setActionError(null) } }}
        onConfirm={() => void confirmRemove()}
      />
    </>
  )
}

function MemberActions({
  member,
  actorId,
  organizationRole,
  superAdmin,
  owners,
  onDetail,
  onRole,
  onRemove,
}: {
  member: OrganizationMember
  actorId: string
  organizationRole: ReturnType<typeof useAuth>['organizationRole']
  superAdmin: boolean
  owners: number
  onDetail: () => void
  onRole: () => void
  onRemove: () => void
}) {
  const change = canChangeMemberRole(member, actorId, organizationRole, superAdmin, owners)
  const remove = canRemoveMember(member, actorId, organizationRole, superAdmin, owners)
  return (
    <Dropdown
      label="Actions"
      menuLabel={`Actions for ${member.name}`}
      align="end"
      hint={membershipHint(member, actorId, owners)}
      items={[
        { id: 'view', label: 'View details', onSelect: onDetail },
        { id: 'role', label: 'Change role', disabled: !change, onSelect: onRole },
        { id: 'remove', label: 'Remove member', disabled: !remove, onSelect: onRemove },
      ]}
    />
  )
}

function MemberSkeleton() {
  return (
    <div>
      <div className="border border-stroke bg-surface-raised" aria-hidden>
        {['one', 'two', 'three', 'four'].map((row) => (
          <div key={row} className="flex items-center gap-3 border-b border-stroke px-4 py-3 last:border-b-0">
            <span className="size-7 bg-steel" />
            <span className="h-3 flex-1 bg-steel" />
          </div>
        ))}
      </div>
      <p className="sr-only" role="status">Loading team members.</p>
    </div>
  )
}

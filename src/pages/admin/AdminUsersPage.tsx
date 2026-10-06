import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { AdminFilters } from '@/components/admin/AdminFilters'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { AdminUserModal } from '@/components/admin/AdminUserModal'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { adminMembers, adminPageSize, memberRoles, memberStatuses, paginate, type AdminMember, type AdminMemberRole } from '@/data/adminData'

export function AdminUsersPage() {
  const [params, setParams] = useSearchParams()
  const [members, setMembers] = useState(adminMembers)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<'invite' | 'role' | 'deactivate' | null>(null)
  const [selected, setSelected] = useState<AdminMember | null>(null)

  useEffect(() => {
    if (params.get('invite') !== '1') return
    setMode('invite')
    const next = new URLSearchParams(params)
    next.delete('invite')
    setParams(next, { replace: true })
  }, [params, setParams])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesQuery = !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
      const matchesRole = role === 'All' || member.role === role
      const matchesStatus = status === 'All' || member.status === status
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [members, role, search, status])

  const view = paginate(filtered, page, adminPageSize)

  function openRole(member: AdminMember) {
    setSelected(member)
    setMode('role')
  }

  function openDeactivate(member: AdminMember) {
    setSelected(member)
    setMode('deactivate')
  }

  return (
    <>
      <PageHeader
        title="TEAM MEMBERS"
        description="Organization roster for this session. Membership changes are not written to Supabase yet."
        actions={
          <Button
            onClick={() => {
              setSelected(null)
              setMode('invite')
            }}
          >
            Invite User
          </Button>
        }
      />
      <AdminFilters
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        filters={[
          {
            id: 'role',
            label: 'Role',
            value: role,
            onChange: (value) => {
              setRole(value)
              setPage(1)
            },
            options: [{ value: 'All', label: 'All roles' }, ...memberRoles.map((item) => ({ value: item, label: item }))],
          },
          {
            id: 'status',
            label: 'Status',
            value: status,
            onChange: (value) => {
              setStatus(value)
              setPage(1)
            },
            options: [{ value: 'All', label: 'All statuses' }, ...memberStatuses.map((item) => ({ value: item, label: item }))],
          },
        ]}
      />
      <AdminDataTable
        caption="Team members"
        rows={view.rows}
        rowKey={(member) => member.id}
        empty="No team members match these filters."
        columns={[
          {
            key: 'user',
            header: 'User',
            render: (member) => (
              <span className="flex items-center gap-3">
                <Avatar name={member.name} size="sm" />
                <span>
                  <span className="block text-paper">{member.name}</span>
                  <span className="block text-xs text-ash">{member.email}</span>
                </span>
              </span>
            ),
          },
          { key: 'role', header: 'Role', render: (member) => <AdminStatusBadge status={member.role} /> },
          { key: 'status', header: 'Status', render: (member) => <AdminStatusBadge status={member.status} /> },
          { key: 'active', header: 'Last Active', render: (member) => member.lastActive },
          { key: 'joined', header: 'Joined', render: (member) => member.joined },
          {
            key: 'actions',
            header: 'Actions',
            render: (member) => (
              <span className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => openRole(member)}>
                  Edit role
                </Button>
                <Button size="sm" variant="ghost" disabled={member.status === 'Inactive'} onClick={() => openDeactivate(member)}>
                  Deactivate
                </Button>
              </span>
            ),
          },
        ]}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-ash">
          Page {view.current} of {view.pages}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={view.current === 1} onClick={() => setPage(view.current - 1)}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={view.current === view.pages} onClick={() => setPage(view.current + 1)}>
            Next
          </Button>
        </div>
      </div>
      <AdminUserModal
        mode={mode}
        member={selected}
        onClose={() => setMode(null)}
        onInvite={(invite) => {
          setMembers((current) => [
            {
              id: crypto.randomUUID(),
              name: invite.name,
              email: invite.email,
              role: invite.role,
              status: 'Invited',
              lastActive: 'Invite pending',
              joined: 'Oct 6, 2026',
            },
            ...current,
          ])
          setPage(1)
        }}
        onRole={(id, nextRole: AdminMemberRole) => {
          setMembers((current) => current.map((member) => (member.id === id ? { ...member, role: nextRole } : member)))
        }}
        onDeactivate={(id) => {
          setMembers((current) => current.map((member) => (member.id === id ? { ...member, status: 'Inactive' } : member)))
        }}
      />
    </>
  )
}

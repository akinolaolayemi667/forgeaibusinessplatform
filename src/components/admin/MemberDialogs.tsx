import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextField } from '@/components/ui/TextField'
import { Avatar } from '@/components/ui/Avatar'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { displayRole, formatJoined } from '@/lib/memberDisplay'
import { isEmail } from '@/utils/format'
import type { AssignableMemberRole, OrganizationMember } from '@/types/organizationMember'

export function InviteMemberModal({
  open,
  roles,
  pending,
  error,
  onClose,
  onInvite,
}: {
  open: boolean
  roles: readonly AssignableMemberRole[]
  pending: boolean
  error: string | null
  onClose: () => void
  onInvite: (input: { fullName: string; email: string; role: AssignableMemberRole }) => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AssignableMemberRole>(roles[0] ?? 'member')
  const [localError, setLocalError] = useState<string | null>(null)
  const selected = roles.includes(role) ? role : (roles[0] ?? 'member')

  return (
    <Modal
      open={open}
      title="Invite member"
      description="Invitation setup requires a secure server-side function."
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!fullName.trim()) {
            setLocalError('Enter a full name.')
            return
          }
          if (!isEmail(email)) {
            setLocalError('Enter a valid email.')
            return
          }
          setLocalError(null)
          onInvite({ fullName: fullName.trim(), email: email.trim(), role: selected })
        }}
      >
        <TextField id="invite-name" label="Full name" value={fullName} onChange={setFullName} autoComplete="name" />
        <TextField id="invite-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <label className="flex flex-col gap-1.5 text-sm font-medium text-copy" htmlFor="invite-role">
          Role
          <select
            id="invite-role"
            value={selected}
            onChange={(event) => setRole(event.target.value === 'admin' ? 'admin' : 'member')}
            className="h-11 border border-stroke bg-surface px-3 text-copy outline-none focus-visible:border-ember"
          >
            {roles.map((item) => (
              <option key={item} value={item}>
                {displayRole(item)}
              </option>
            ))}
          </select>
        </label>
        {localError || error ? (
          <p role="alert" className="text-sm text-badge-danger-fg">
            {localError || error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" loading={pending} disabled={roles.length === 0}>
            Invite member
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function MemberDetailModal({
  member,
  organization,
  canChange,
  canRemove,
  hint,
  onClose,
  onChangeRole,
  onRemove,
}: {
  member: OrganizationMember | null
  organization: string
  canChange: boolean
  canRemove: boolean
  hint?: string
  onClose: () => void
  onChangeRole: () => void
  onRemove: () => void
}) {
  return (
    <Modal open={Boolean(member)} title={member?.name ?? 'Member'} description={organization} onClose={onClose}>
      {member ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatarUrl ?? undefined} size="lg" />
            <div>
              <p className="text-copy">{member.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <AdminStatusBadge status={displayRole(member.role)} />
                <AdminStatusBadge status="Active" />
              </div>
            </div>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="type-kicker text-muted">Joined</dt>
              <dd className="mt-1 text-copy">{formatJoined(member.joinedAt)}</dd>
            </div>
            <div>
              <dt className="type-kicker text-muted">User ID</dt>
              <dd className="mt-1 font-mono text-xs break-all text-copy">{member.userId}</dd>
            </div>
          </dl>
          {hint ? <p className="text-sm text-muted">{hint}</p> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={onChangeRole} disabled={!canChange}>
              Change role
            </Button>
            <Button variant="danger" onClick={onRemove} disabled={!canRemove}>
              Remove member
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

export function ChangeRoleModal({
  member,
  pending,
  error,
  onClose,
  onSave,
}: {
  member: OrganizationMember | null
  pending: boolean
  error: string | null
  onClose: () => void
  onSave: (role: AssignableMemberRole) => void
}) {
  const initial: AssignableMemberRole = member?.role ?? 'member'
  const [role, setRole] = useState<AssignableMemberRole>(initial)

  return (
    <Modal
      open={Boolean(member)}
      title="Change role"
      description={member ? `Current role: ${displayRole(member.role).toUpperCase()}` : undefined}
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(role)
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium text-copy" htmlFor="change-role">
          Role
          <select
            id="change-role"
            value={role}
            onChange={(event) => setRole(asMemberRole(event.target.value))}
            className="h-11 border border-stroke bg-surface px-3 text-copy outline-none focus-visible:border-ember"
          >
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </label>
        {error ? (
          <p role="alert" className="text-sm text-badge-danger-fg">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" loading={pending} disabled={!member || role === member.role}>
            Save role
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function asMemberRole(value: string): AssignableMemberRole {
  if (value === 'owner' || value === 'admin' || value === 'member') return value
  return 'member'
}

export function RemoveMemberModal({
  member,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  member: OrganizationMember | null
  pending: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal open={Boolean(member)} title="REMOVE MEMBER?" description="They will lose access to this organization." onClose={onClose}>
      {member ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">You are about to remove:</p>
          <div>
            <p className="text-copy">{member.name}</p>
            <p className="text-sm text-muted">{member.email}</p>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-badge-danger-fg">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button variant="danger" loading={pending} onClick={onConfirm}>
              Remove member
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

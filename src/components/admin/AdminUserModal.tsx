import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextField } from '@/components/ui/TextField'
import { memberRoles, type AdminMember, type AdminMemberRole } from '@/data/adminData'

export function AdminUserModal({
  mode,
  member,
  onClose,
  onInvite,
  onRole,
  onDeactivate,
}: {
  mode: 'invite' | 'role' | 'deactivate' | null
  member: AdminMember | null
  onClose: () => void
  onInvite: (member: Pick<AdminMember, 'name' | 'email' | 'role'>) => void
  onRole: (id: string, role: AdminMemberRole) => void
  onDeactivate: (id: string) => void
}) {
  return (
    <>
      <InviteForm open={mode === 'invite'} onClose={onClose} onInvite={onInvite} />
      <RoleForm key={member?.id ?? 'role'} open={mode === 'role'} member={member} onClose={onClose} onRole={onRole} />
      <Modal open={mode === 'deactivate'} title="Deactivate user" description={member ? `${member.name} will lose access to this organization in this preview.` : undefined} onClose={onClose}>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (member) onDeactivate(member.id)
              onClose()
            }}
          >
            Deactivate
          </Button>
        </div>
      </Modal>
    </>
  )
}

function InviteForm({
  open,
  onClose,
  onInvite,
}: {
  open: boolean
  onClose: () => void
  onInvite: (member: Pick<AdminMember, 'name' | 'email' | 'role'>) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminMemberRole>('Member')
  const [error, setError] = useState('')

  function submit() {
    if (!name.trim() || !email.includes('@')) {
      setError('Enter a name and a valid email.')
      return
    }
    onInvite({ name: name.trim(), email: email.trim(), role })
    setName('')
    setEmail('')
    setRole('Member')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} title="Invite user" description="The invitation stays in this session until organization membership is stored in Supabase." onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <TextField id="invite-name" label="Name" value={name} onChange={setName} autoComplete="name" />
        <TextField id="invite-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" error={error || undefined} />
        <RoleSelect id="invite-role" value={role} onChange={setRole} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Send invite</Button>
        </div>
      </form>
    </Modal>
  )
}

function RoleForm({
  open,
  member,
  onClose,
  onRole,
}: {
  open: boolean
  member: AdminMember | null
  onClose: () => void
  onRole: (id: string, role: AdminMemberRole) => void
}) {
  const [role, setRole] = useState<AdminMemberRole>(member?.role ?? 'Member')

  return (
    <Modal open={open} title="Edit role" description={member ? member.email : undefined} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (member) onRole(member.id, role)
          onClose()
        }}
      >
        <RoleSelect id="edit-role" value={role} onChange={setRole} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save role</Button>
        </div>
      </form>
    </Modal>
  )
}

function RoleSelect({ id, value, onChange }: { id: string; value: AdminMemberRole; onChange: (role: AdminMemberRole) => void }) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-copy">Role</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as AdminMemberRole)} className="h-10 border border-stroke bg-surface px-3 text-sm text-copy">
        {memberRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </label>
  )
}

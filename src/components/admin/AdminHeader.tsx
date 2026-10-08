import { useState, type ReactNode } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { adminActivity, adminOrganization } from '@/data/adminData'
import { Dropdown } from '@/components/ui/Dropdown'
import { useAuth } from '@/hooks/useAuth'
import { signedInConsoles } from '@/lib/permissions'
import { useSession } from '@/hooks/useSession'

export function AdminHeader({ menuButton }: { menuButton: ReactNode }) {
  const navigate = useNavigate()
  const { user, signOut } = useSession()
  const { user: authUser, signOut: signOutAuth, organization, organizationRole, role, isSuperAdmin } = useAuth()
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const name = authUser ? operatorName(authUser.user_metadata, authUser.email) : (user?.name ?? 'Operator')
  const email = authUser?.email ?? user?.email ?? 'No email on this session'
  const roleLabel = isSuperAdmin ? 'Super admin' : organizationRole === 'owner' ? 'Owner' : role === 'admin' || organizationRole === 'admin' ? 'Admin' : 'Admin'
  const organizationName = organization?.name ?? adminOrganization.name
  const signedIn = Boolean(user || authUser)
  const platformLink = signedInConsoles({ isAdmin: false, isSuperAdmin }).find((item) => item.id === 'platform-control')

  function endSession() {
    if (!signedIn) {
      navigate('/login')
      return
    }
    setSignOutError(null)
    void (async () => {
      try {
        await signOutAuth()
        signOut()
        navigate('/')
      } catch {
        setSignOutError('Sign out did not complete. Try again.')
      }
    })()
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-stroke bg-surface px-2 sm:px-4">
      {menuButton}
      <Dropdown
        label={organizationName}
        menuLabel="Organization"
        hint="Current organization"
        items={[{ id: 'current', label: organizationName, onSelect: () => undefined }]}
      />
      <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ember sm:block">{roleLabel}</p>
      <div className="ml-auto flex items-center gap-1">
        <Dropdown
          label="Notifications"
          align="end"
          trigger={
            <span className="inline-flex size-10 items-center justify-center" aria-hidden>
              <Bell size={16} />
            </span>
          }
          items={adminActivity.slice(0, 4).map((item) => ({
            id: item.id,
            label: item.title,
            onSelect: () => navigate('/admin/activity'),
          }))}
        />
        <Dropdown
          label={name}
          menuLabel={`${name}, ${email}, ${roleLabel}`}
          align="end"
          items={[
            { id: 'identity-name', label: name, disabled: true, onSelect: () => undefined },
            { id: 'identity-email', label: email, disabled: true, onSelect: () => undefined },
            { id: 'identity-role', label: roleLabel, disabled: true, onSelect: () => undefined },
            { id: 'workspace', label: 'Open Workspace', onSelect: () => navigate('/app') },
            ...(platformLink ? [{ id: platformLink.id, label: platformLink.label, onSelect: () => navigate(platformLink.to) }] : []),
            { id: 'account', label: 'Account', onSelect: () => navigate('/admin/settings') },
            { id: 'sign-out', label: signedIn ? 'Sign out' : 'Sign in', onSelect: endSession },
          ]}
        />
      </div>
      {signOutError ? (
        <p role="alert" className="max-w-40 truncate text-xs text-danger">
          {signOutError}
        </p>
      ) : null}
    </header>
  )
}

function operatorName(metadata: unknown, email: string | undefined) {
  if (metadata && typeof metadata === 'object') {
    const record = metadata as Record<string, unknown>
    for (const key of ['full_name', 'name', 'preferred_username']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return email ?? 'Operator'
}

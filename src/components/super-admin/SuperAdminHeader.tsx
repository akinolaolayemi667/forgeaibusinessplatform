import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from '@/components/ui/Dropdown'
import { useAuth } from '@/hooks/useAuth'
import { useSession } from '@/hooks/useSession'

export function SuperAdminHeader({ menuButton }: { menuButton: ReactNode }) {
  const navigate = useNavigate()
  const { user, signOut } = useSession()
  const { user: authUser, signOut: signOutAuth, organizationRole, role } = useAuth()
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const name = authUser ? operatorName(authUser.user_metadata, authUser.email) : (user?.name ?? 'Operator')
  const email = authUser?.email ?? user?.email ?? 'No email on this session'
  const avatar = authUser ? metadataText(authUser.user_metadata, 'avatar_url') : ''
  const roleLabel = role === 'super_admin' ? 'SUPER ADMIN' : 'PLATFORM ROLE UNAVAILABLE'
  const canOpenOrganizationAdmin = organizationRole === 'owner' || organizationRole === 'admin'
  const signedIn = Boolean(user || authUser)

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

  const identity = [
    { id: 'identity-name', label: name, disabled: true, onSelect: () => undefined },
    { id: 'identity-email', label: email, disabled: true, onSelect: () => undefined },
    { id: 'identity-role', label: roleLabel, disabled: true, onSelect: () => undefined },
    { id: 'workspace', label: 'Open Workspace', onSelect: () => navigate('/app') },
    ...(canOpenOrganizationAdmin
      ? [{ id: 'organization-admin', label: 'Organization Admin', onSelect: () => navigate('/admin') }]
      : []),
    { id: 'sign-out', label: signedIn ? 'Sign out' : 'Sign in', onSelect: endSession },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-14 min-w-0 items-center gap-2 border-b border-stroke bg-surface px-2 sm:px-4">
      {menuButton}
      <div className="min-w-0">
        <p className="truncate font-display text-sm tracking-[-0.04em] text-paper">FORGE PLATFORM CONTROL</p>
      </div>
      <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ember sm:block">{roleLabel}</p>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        {avatar ? <img src={avatar} alt="" className="size-8 border border-stroke object-cover" /> : null}
        <Dropdown label={name} menuLabel={`${name}, ${email}, ${roleLabel}`} align="end" items={identity} />
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
  const name = metadataText(metadata, 'full_name') || metadataText(metadata, 'name') || metadataText(metadata, 'preferred_username')
  return name || email || 'Operator'
}

function metadataText(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== 'object') return ''
  const value = (metadata as Record<string, unknown>)[key]
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

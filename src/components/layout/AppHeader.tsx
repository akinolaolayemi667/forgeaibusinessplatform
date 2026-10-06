import { useState, type ReactNode } from 'react'
import { ChevronDown, CircleHelp, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { NotificationMenu } from '@/components/layout/NotificationMenu'
import { useAuth } from '@/hooks/useAuth'
import { useSession } from '@/hooks/useSession'
import { useWorkspace } from '@/hooks/useWorkspace'

export function AppHeader({
  menuButton,
  onSearch,
}: {
  menuButton: ReactNode
  onSearch: () => void
}) {
  const navigate = useNavigate()
  const { user, signOut } = useSession()
  const { user: authUser, signOut: signOutAuth } = useAuth()
  const { workspace, workspaces, selectWorkspace } = useWorkspace()
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const operatorName = authUser ? discordName(authUser.user_metadata, authUser.email) : (user?.name ?? 'Guest operator')
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

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-stroke bg-surface px-2 sm:gap-2 sm:px-4">
      {menuButton}
      <div className="hidden min-w-0 md:block">
        <Breadcrumb />
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
      <button
        type="button"
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm text-muted hover:bg-wash hover:text-copy"
        aria-label="Search"
        onClick={onSearch}
      >
        <Search aria-hidden size={16} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden border border-stroke px-1.5 py-0.5 font-mono text-[10px] text-muted lg:inline">Ctrl K</kbd>
      </button>
      <NotificationMenu />
      <Dropdown
        label="Help"
        align="end"
        trigger={
          <span className="inline-flex size-10 items-center justify-center" aria-hidden>
            <CircleHelp size={16} />
          </span>
        }
        items={[
          { id: 'search', label: 'Search the workspace', onSelect: onSearch },
          { id: 'architecture', label: 'How the product is structured', onSelect: () => navigate('/architecture') },
          { id: 'demo', label: 'What this preview includes', onSelect: () => navigate('/demo') },
        ]}
      />
      <Dropdown
        label={workspace.name}
        menuLabel={`Workspace: ${workspace.name}`}
        hint="Sample workspace"
        align="end"
        trigger={
          <span className="inline-flex max-w-36 items-center gap-1">
            <span className="hidden truncate sm:inline">{workspace.name}</span>
            <ChevronDown aria-hidden size={14} />
          </span>
        }
        items={workspaces.map((item) => ({
          id: item.id,
          label: item.name,
          onSelect: () => selectWorkspace(item.id),
        }))}
      />
      <Dropdown
        label="Account menu"
        align="end"
        hint={authUser?.email ?? user?.email ?? 'No session in this tab'}
        trigger={
          <span className="inline-flex items-center gap-2">
            <Avatar name={operatorName} size="sm" />
            <span className="hidden max-w-32 truncate lg:inline">{operatorName}</span>
          </span>
        }
        items={[
          { id: 'settings', label: 'Settings', onSelect: () => navigate('/app/settings') },
          { id: 'billing', label: 'Billing', onSelect: () => navigate('/app/billing') },
          {
            id: 'session',
            label: signedIn ? 'Sign out' : 'Sign in',
            onSelect: endSession,
          },
        ]}
      />
      {signOutError ? (
        <p role="alert" className="max-w-40 truncate text-xs text-danger">
          {signOutError}
        </p>
      ) : null}
      </div>
    </header>
  )
}

function discordName(metadata: unknown, email: string | undefined) {
  if (metadata && typeof metadata === 'object') {
    const record = metadata as Record<string, unknown>
    for (const key of ['full_name', 'name', 'preferred_username']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return email ?? 'Operator'
}

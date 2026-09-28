import { useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSession } from '@/hooks/useSession'
import { useWorkspace } from '@/hooks/useWorkspace'
import { trapTabKey } from '@/utils/focus'

export function AppLayout() {
  const drawer = useDisclosure()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { user, signOut } = useSession()
  const { workspace, workspaces, selectWorkspace } = useWorkspace()
  const navigate = useNavigate()
  const operatorName = user?.name ?? 'Guest operator'
  const drawerOpen = drawer.isOpen && !isDesktop

  useEffect(() => {
    if (isDesktop) drawer.close()
  }, [isDesktop, drawer.close])

  useEffect(() => {
    if (!drawerOpen) return
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') drawer.close()
      const panel = panelRef.current
      if (panel) trapTabKey(event, panel)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      menuButtonRef.current?.focus()
    }
  }, [drawerOpen, drawer.close])

  return (
    <div data-theme="iron" className="min-h-dvh bg-surface text-copy">
      <SkipLink />
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/55" onClick={drawer.close} />
          <div
            ref={panelRef}
            id="app-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-stroke bg-surface p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Logo to="/app" />
              <Button ref={closeRef} variant="ghost" size="sm" onClick={drawer.close} aria-label="Close navigation">
                Close
              </Button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <AppSidebar onNavigate={drawer.close} />
            </div>
            <p className="pt-4 text-xs text-muted">Sample records</p>
          </div>
        </div>
      ) : null}
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]" inert={drawerOpen ? true : undefined}>
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-stroke p-4 lg:flex">
          <Logo to="/app" />
          <div className="mt-6 flex-1 overflow-y-auto">
            <AppSidebar />
          </div>
          <p className="pt-4 text-xs text-muted">Sample records</p>
        </aside>
        <div className="min-w-0">
          <header className="flex h-14 items-center gap-2 border-b border-stroke px-3 sm:px-4">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="sm"
              className="lg:hidden"
              aria-expanded={drawer.isOpen}
              aria-controls={drawer.isOpen ? 'app-drawer' : undefined}
              onClick={drawer.toggle}
            >
              <Menu aria-hidden size={16} />
              Menu
            </Button>
            <Dropdown
              label={workspace.name}
              menuLabel={`Workspace: ${workspace.name}`}
              hint="Sample workspace"
              items={workspaces.map((item) => ({
                id: item.id,
                label: item.name,
                onSelect: () => selectWorkspace(item.id),
              }))}
            />
            <div className="ml-auto">
              <Dropdown
                label="Account menu"
                align="end"
                hint={user?.email ?? 'No session in this tab'}
                trigger={
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={operatorName} size="sm" />
                    <span className="hidden max-w-40 truncate sm:inline">{operatorName}</span>
                  </span>
                }
                items={[
                  { id: 'settings', label: 'Settings', onSelect: () => navigate('/app/settings') },
                  { id: 'billing', label: 'Billing', onSelect: () => navigate('/app/billing') },
                  {
                    id: 'session',
                    label: user ? 'Sign out' : 'Sign in',
                    onSelect: () => {
                      if (user) {
                        signOut()
                        navigate('/')
                      } else {
                        navigate('/login')
                      }
                    },
                  },
                ]}
              />
            </div>
          </header>
          <main id="main" tabIndex={-1} className="px-4 py-6 outline-none sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

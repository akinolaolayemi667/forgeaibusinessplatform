import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { Button } from '@/components/ui/Button'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { readStorage, writeStorage } from '@/lib/storage'
import { trapTabKey } from '@/utils/focus'

const SIDEBAR_KEY = 'forge.admin.sidebar'

export function AdminShell() {
  const drawer = useDisclosure()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [collapsed, setCollapsed] = useState(() => readStorage(SIDEBAR_KEY) === true)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
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

  function toggleCollapsed() {
    setCollapsed((value) => {
      writeStorage(SIDEBAR_KEY, !value)
      return !value
    })
  }

  return (
    <div data-theme="iron" className="forge-canvas min-h-dvh text-copy">
      <SkipLink />
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/70" onClick={drawer.close} />
          <div
            ref={panelRef}
            id="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Administration navigation"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-stroke bg-surface p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Logo to="/admin" />
              <Button ref={closeRef} variant="ghost" size="sm" onClick={drawer.close} aria-label="Close navigation">
                Close
              </Button>
            </div>
            <p className="type-kicker mt-4 text-ash">Administration</p>
            <div className="mt-3 min-h-0 flex-1">
              <AdminSidebar onNavigate={drawer.close} />
            </div>
          </div>
        </div>
      ) : null}
      <div className="lg:grid lg:grid-cols-[auto_minmax(0,1fr)]" inert={drawerOpen ? true : undefined}>
        <aside
          className={cn(
            'sticky top-0 hidden h-dvh flex-col border-r border-stroke bg-surface p-3 lg:flex',
            collapsed ? 'w-[4.5rem]' : 'w-60',
          )}
        >
          <div className={cn('flex flex-col gap-1', collapsed ? 'items-center' : 'px-1')}>
            <Logo to="/admin" compact={collapsed} />
            <p className={cn('type-kicker text-ash', collapsed && 'sr-only')}>Administration</p>
          </div>
          <div className="mt-4 min-h-0 flex-1">
            <AdminSidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
          </div>
        </aside>
        <div className="min-w-0">
          <AdminHeader
            menuButton={
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="sm"
                className="px-2 lg:hidden"
                aria-expanded={drawer.isOpen}
                aria-controls={drawer.isOpen ? 'admin-drawer' : undefined}
                aria-label="Open navigation"
                onClick={drawer.toggle}
              >
                <Menu aria-hidden size={16} />
              </Button>
            }
          />
          <main id="main" tabIndex={-1} className="px-4 py-6 outline-none sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

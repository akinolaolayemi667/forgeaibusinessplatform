import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'
import { cn } from '@/lib/cn'
import { trapTabKey } from '@/utils/focus'

export function AppLayout() {
  const drawer = useDisclosure()
  const command = useDisclosure()
  const { collapsed, toggle } = useSidebarCollapsed()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const reduce = useReducedMotion()
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        command.open()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [command.open])

  return (
    <div data-theme="iron" className="forge-canvas min-h-dvh text-copy">
      <SkipLink />
      <CommandPalette open={command.isOpen} onClose={command.close} />
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
            <div className="mt-6 min-h-0 flex-1">
              <AppSidebar onNavigate={drawer.close} />
            </div>
          </div>
        </div>
      ) : null}
      <div className="lg:grid lg:grid-cols-[auto_minmax(0,1fr)]" inert={drawerOpen ? true : undefined}>
        <aside
          className={cn(
            'sticky top-0 hidden h-dvh flex-col border-r border-stroke bg-surface p-3 motion-safe:transition-[width] motion-safe:duration-200 lg:flex',
            collapsed ? 'w-[4.5rem]' : 'w-60',
          )}
        >
          <div className={cn('flex items-center', collapsed ? 'justify-center' : 'px-1')}>
            <Logo to="/app" compact={collapsed} />
          </div>
          <div className="mt-4 min-h-0 flex-1">
            <AppSidebar collapsed={collapsed} onToggleCollapse={toggle} />
          </div>
        </aside>
        <div className="min-w-0">
          <AppHeader
            onSearch={command.open}
            menuButton={
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="sm"
                className="px-2 lg:hidden"
                aria-expanded={drawer.isOpen}
                aria-controls={drawer.isOpen ? 'app-drawer' : undefined}
                aria-label="Open navigation"
                onClick={drawer.toggle}
              >
                <Menu aria-hidden size={16} />
              </Button>
            }
          />
          <div className="border-b border-stroke px-4 py-2 md:hidden">
            <Breadcrumb />
          </div>
          <main id="main" tabIndex={-1} className="px-4 py-6 outline-none sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

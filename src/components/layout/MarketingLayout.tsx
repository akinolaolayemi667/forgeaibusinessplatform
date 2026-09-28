import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { marketingNav } from '@/data/navigation'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { buttonStyles } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { SkipLink } from '@/components/layout/SkipLink'
import { cn } from '@/lib/cn'

function navClass(isActive: boolean) {
  return cn(
    'text-sm no-underline',
    isActive ? 'border-b-2 border-ember pb-0.5 text-copy' : 'border-b-2 border-transparent pb-0.5 text-muted hover:text-copy',
  )
}

export function MarketingLayout() {
  const menu = useDisclosure()
  const isWide = useMediaQuery('(min-width: 768px)')
  const home = useLocation().pathname === '/'

  useEffect(() => {
    if (isWide) menu.close()
  }, [isWide, menu.close])

  useEffect(() => {
    if (!menu.isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') menu.close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu.isOpen, menu.close])

  return (
    <div className="forge-canvas flex min-h-dvh flex-col text-copy">
      <SkipLink />
      <header className="sticky top-0 z-20 border-b border-stroke bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-5">
              {marketingNav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => navClass(isActive)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className={buttonStyles('ghost', 'sm')}>
              Log in
            </Link>
            <Link to="/signup" className={buttonStyles('primary', 'sm')}>
              Sign up
            </Link>
          </div>
            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm text-copy hover:bg-wash md:hidden"
              aria-expanded={menu.isOpen}
              aria-controls="primary-menu"
              onClick={menu.toggle}
            >
              {menu.isOpen ? <X aria-hidden size={18} /> : <Menu aria-hidden size={18} />}
              Menu
            </button>
          </div>
        </div>
        <nav
          id="primary-menu"
          aria-label="Primary"
          className={cn('border-t border-stroke md:hidden', !menu.isOpen && 'hidden')}
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
            {marketingNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => navClass(isActive)} onClick={menu.close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/login" className="text-sm text-copy no-underline" onClick={menu.close}>
                Log in
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-sm text-copy no-underline" onClick={menu.close}>
                Sign up
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className={cn(
          'w-full flex-1 outline-none',
          home ? '' : 'mx-auto max-w-6xl px-4 py-10 sm:px-6',
        )}
      >
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}

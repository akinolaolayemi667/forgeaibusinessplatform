import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { marketingNav } from '@/data/navigation'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { buttonStyles } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { cn } from '@/lib/cn'

function navClass(isActive: boolean) {
  return cn(
    'text-sm no-underline',
    isActive ? 'border-b border-ember text-copy' : 'text-muted hover:text-copy',
  )
}

export function MarketingLayout() {
  const menu = useDisclosure()
  const isWide = useMediaQuery('(min-width: 768px)')

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
    <div className="flex min-h-dvh flex-col bg-surface text-copy">
      <SkipLink />
      <header className="sticky top-0 z-20 border-b border-stroke bg-surface/95 backdrop-blur">
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
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 outline-none sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-stroke">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>FORGE · AI business automation</p>
          <p>Preview records stay in this browser.</p>
        </div>
      </footer>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { PageHeader } from '@/components/ui/PageHeader'
import type { AccessNavItem } from '@/data/accessNavigation'

export function AccessHome({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string
  title: string
  description: string
  items: AccessNavItem[]
}) {
  return (
    <div className="forge-canvas flex min-h-dvh flex-col text-copy">
      <SkipLink />
      <header className="border-b border-stroke bg-surface-raised">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo to="/app" />
          <p className="type-kicker text-muted">{eyebrow}</p>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 outline-none sm:px-6">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <nav aria-label={eyebrow} className="border border-stroke bg-surface-raised">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.to} className="border-b border-stroke last:border-b-0">
                <Link to={item.to} className="block px-4 py-3 text-sm text-copy no-underline hover:bg-wash">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  )
}

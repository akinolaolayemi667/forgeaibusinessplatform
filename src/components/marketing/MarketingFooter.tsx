import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/Logo'
import { marketingNav } from '@/data/navigation'

const workspaceLinks = [
  { to: '/app/leads', label: 'Leads' },
  { to: '/app/pipeline', label: 'Pipeline' },
  { to: '/app/automations', label: 'Automations' },
  { to: '/app/ai', label: 'Assistant' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/integrations', label: 'Integrations' },
] as const

export function MarketingFooter() {
  return (
    <footer className="border-t border-stroke">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex max-w-xs flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted">
            FORGE is the operating system for CRM, AI, communication, and workflow automation.
          </p>
        </div>
        <FooterColumn title="Platform">
          {marketingNav.map((item) => (
            <li key={item.to}>
              <FooterLink to={item.to}>{item.label}</FooterLink>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Workspace">
          {workspaceLinks.map((item) => (
            <li key={item.to}>
              <FooterLink to={item.to}>{item.label}</FooterLink>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Start">
          <li>
            <FooterLink to="/signup">Sign up</FooterLink>
          </li>
          <li>
            <FooterLink to="/login">Log in</FooterLink>
          </li>
          <li>
            <FooterLink to="/pricing">Pricing</FooterLink>
          </li>
        </FooterColumn>
      </div>
      <div className="border-t border-stroke">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 FORGE</p>
          <p>Preview records stay in this browser.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="type-kicker text-muted">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">{children}</ul>
    </nav>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm text-copy no-underline hover:text-ember">
      {children}
    </Link>
  )
}

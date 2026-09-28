import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-copy no-underline">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect x="1" y="1" width="20" height="20" rx="3" fill="currentColor" />
        <path d="M6 15.5V6.5h6.2a3 3 0 0 1 0 6H8.6" fill="none" stroke="var(--surface)" strokeWidth="1.7" />
        <rect x="13.4" y="13.4" width="3.4" height="3.4" fill="#c2410c" />
      </svg>
      <span className="font-display text-lg leading-none tracking-tight">FORGE</span>
    </Link>
  )
}

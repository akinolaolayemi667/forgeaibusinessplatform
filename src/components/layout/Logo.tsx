import { Link } from 'react-router-dom'

export function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-copy no-underline" aria-label="FORGE">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect width="22" height="22" fill="currentColor" />
        <path d="M5.5 16.5V5.5h6.4a3.1 3.1 0 0 1 0 6.2H8.2" fill="none" stroke="var(--surface)" strokeWidth="1.7" />
        <rect x="14" y="14" width="3.5" height="3.5" fill="#ff6a00" />
      </svg>
      <span className={compact ? 'sr-only' : 'font-display text-[15px] leading-none tracking-[-0.04em]'}>FORGE</span>
    </Link>
  )
}

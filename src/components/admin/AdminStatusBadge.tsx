import { cn } from '@/lib/cn'
import type { AdminActivityStatus, AdminMemberStatus } from '@/data/adminData'

const tone: Record<string, string> = {
  Success: 'border-badge-ok-fg/40 bg-badge-ok-bg text-badge-ok-fg',
  Active: 'border-badge-ok-fg/40 bg-badge-ok-bg text-badge-ok-fg',
  Connected: 'border-badge-ok-fg/40 bg-badge-ok-bg text-badge-ok-fg',
  Warning: 'border-badge-warn-fg/40 bg-badge-warn-bg text-badge-warn-fg',
  Invited: 'border-badge-warn-fg/40 bg-badge-warn-bg text-badge-warn-fg',
  Available: 'border-badge-info-fg/40 bg-badge-info-bg text-badge-info-fg',
  Failed: 'border-badge-danger-fg/40 bg-badge-danger-bg text-badge-danger-fg',
  Inactive: 'border-badge-danger-fg/40 bg-badge-danger-bg text-badge-danger-fg',
  Admin: 'border-badge-accent-fg/40 bg-badge-accent-bg text-badge-accent-fg',
  Owner: 'border-ember text-ember',
  Member: 'border-stroke bg-wash text-stone',
}

export function AdminStatusBadge({ status }: { status: AdminActivityStatus | AdminMemberStatus | string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]', tone[status] ?? 'border-stroke text-stone')}>
      <span aria-hidden className="size-1.5 bg-current" />
      {status}
    </span>
  )
}

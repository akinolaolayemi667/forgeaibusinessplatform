import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-badge-neutral-bg text-badge-neutral-fg',
  success: 'bg-badge-ok-bg text-badge-ok-fg',
  warning: 'bg-badge-warn-bg text-badge-warn-fg',
  danger: 'bg-badge-danger-bg text-badge-danger-fg',
  info: 'bg-badge-info-bg text-badge-info-fg',
  accent: 'bg-badge-accent-bg text-badge-accent-fg',
}

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-[-0.02em]', variantClass[variant], className)}>
      {children}
    </span>
  )
}

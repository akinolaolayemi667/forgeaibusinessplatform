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
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', variantClass[variant], className)}>
      {children}
    </span>
  )
}

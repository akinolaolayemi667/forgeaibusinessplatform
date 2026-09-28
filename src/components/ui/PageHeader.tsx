import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  size?: 'md' | 'lg'
  className?: string
}

const titleClass = {
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
}

export function PageHeader({ eyebrow, title, description, actions, size = 'md', className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow ? <p className="type-kicker text-muted">{eyebrow}</p> : null}
        <h1 className={cn('font-display text-copy', titleClass[size])}>{title}</h1>
        {description ? <p className="text-base text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

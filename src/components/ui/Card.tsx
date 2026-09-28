import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardProps = {
  children: ReactNode
  className?: string
  padded?: boolean
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className, padded = true, as = 'div' }: CardProps) {
  const Tag = as
  return (
    <Tag className={cn('flex flex-col gap-3 rounded-sm border border-stroke bg-surface-raised', padded && 'p-5', className)}>
      {children}
    </Tag>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1', className)}>{children}</div>
}

export function CardTitle({
  children,
  as = 'h2',
  className,
}: {
  children: ReactNode
  as?: 'h2' | 'h3'
  className?: string
}) {
  const Tag = as
  return <Tag className={cn('font-display text-lg text-copy sm:text-xl', className)}>{children}</Tag>
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted', className)}>{children}</p>
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap gap-2', className)}>{children}</div>
}

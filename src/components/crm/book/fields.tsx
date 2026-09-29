import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function FieldSelect({
  id,
  label,
  value,
  onChange,
  children,
  hideLabel = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  hideLabel?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-sm font-medium text-copy'}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-sm border border-stroke bg-surface px-2 text-sm text-copy outline-none focus-visible:border-ember"
      >
        {children}
      </select>
    </div>
  )
}

export function controlClass(className?: string) {
  return cn(
    'h-10 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none placeholder:text-muted focus-visible:border-ember',
    className,
  )
}

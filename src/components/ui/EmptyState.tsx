import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-stroke px-5 py-8">
      {icon ? (
        <div className="text-ember" aria-hidden>
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-2xl text-copy">{title}</h2>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {action}
    </div>
  )
}

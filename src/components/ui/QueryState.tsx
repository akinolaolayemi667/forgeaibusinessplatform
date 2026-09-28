import type { ReactNode } from 'react'

type QueryStateProps = {
  loading: boolean
  error: string | null
  children: ReactNode
}

export function QueryState({ loading, error, children }: QueryStateProps) {
  if (loading) {
    return (
      <p role="status" className="text-sm text-muted">
        Loading records…
      </p>
    )
  }
  if (error) {
    return (
      <p role="alert" className="text-sm text-badge-danger-fg">
        {error}
      </p>
    )
  }
  return children
}

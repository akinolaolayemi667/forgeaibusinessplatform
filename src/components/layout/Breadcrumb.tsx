import { Link, useMatches } from 'react-router-dom'
import { currentRouteTitle } from '@/hooks/useRouteTitle'
import { useWorkspace } from '@/hooks/useWorkspace'

export function Breadcrumb() {
  const matches = useMatches()
  const { workspace } = useWorkspace()
  const title = currentRouteTitle(matches)
  const onOverview = title === 'Overview'

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2 text-sm">
        <li className="truncate text-muted">
          {onOverview ? (
            <span className="text-copy">{workspace.name}</span>
          ) : (
            <Link to="/app" className="text-muted no-underline hover:text-copy">
              {workspace.name}
            </Link>
          )}
        </li>
        <li aria-hidden className="text-muted">
          /
        </li>
        <li className="truncate text-copy" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  )
}

import { useEffect } from 'react'
import { useMatches, type UIMatch } from 'react-router-dom'

export function titleFromHandle(handle: unknown) {
  if (!handle || typeof handle !== 'object' || !('title' in handle)) return null
  const title = handle.title
  return typeof title === 'string' ? title : null
}

export function currentRouteTitle(matches: UIMatch[]) {
  return [...matches].reverse().map((match) => titleFromHandle(match.handle)).find(Boolean) ?? 'Overview'
}

export function useRouteTitle() {
  const matches = useMatches()

  useEffect(() => {
    const custom = document.documentElement.dataset.pageTitle
    if (custom) {
      document.title = custom
      return
    }
    const title = currentRouteTitle(matches)
    document.title = !title || title === 'Home' ? 'FORGE · AI Business Automation' : `${title} · FORGE`
  }, [matches])
}

import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

function titleFromHandle(handle: unknown) {
  if (!handle || typeof handle !== 'object' || !('title' in handle)) return null
  const title = handle.title
  return typeof title === 'string' ? title : null
}

export function useRouteTitle() {
  const matches = useMatches()

  useEffect(() => {
    const title = [...matches].reverse().map((match) => titleFromHandle(match.handle)).find(Boolean)
    document.title = !title || title === 'Home' ? 'FORGE · AI Business Automation' : `${title} · FORGE`
  }, [matches])
}

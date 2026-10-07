const OAUTH_RETURN_KEY = 'forge.oauth.return'

function isAuthPath(path: string) {
  return path === '/login' || path.startsWith('/login?') || path === '/signup' || path.startsWith('/signup?')
}

export function safeAppPath(value: string | null | undefined) {
  if (!value) return null
  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null
  if (path.includes('\\') || path.includes('://') || path.includes('\0')) return null

  const query = path.indexOf('?')
  const pathname = query >= 0 ? path.slice(0, query) : path
  const search = query >= 0 ? path.slice(query) : ''
  if (!pathname.startsWith('/') || pathname.includes('..') || search.includes('#')) return null

  try {
    const decoded = decodeURIComponent(pathname)
    if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('..') || decoded.includes('\\')) return null
  } catch {
    return null
  }

  if (pathname.length + search.length > 512) return null
  return `${pathname}${search}`
}

export function rememberAuthDestination(path: string) {
  const safe = safeAppPath(path)
  if (!safe || isAuthPath(safe)) return
  sessionStorage.setItem(OAUTH_RETURN_KEY, safe)
}

export function peekAuthDestination() {
  return safeAppPath(sessionStorage.getItem(OAUTH_RETURN_KEY))
}

export function clearAuthDestination() {
  sessionStorage.removeItem(OAUTH_RETURN_KEY)
}

export function oauthRedirectTo() {
  const current = safeAppPath(`${window.location.pathname}${window.location.search}`) ?? '/'
  const stored = peekAuthDestination()
  const path = isAuthPath(current) && stored ? stored : current
  return `${window.location.origin}${path}`
}

const OAUTH_RETURN_KEY = 'forge.oauth.return'

export function markOAuthReturn() {
  sessionStorage.setItem(OAUTH_RETURN_KEY, '1')
}

export function clearOAuthReturn() {
  sessionStorage.removeItem(OAUTH_RETURN_KEY)
}

export function takeOAuthReturn() {
  if (sessionStorage.getItem(OAUTH_RETURN_KEY) !== '1') return false
  sessionStorage.removeItem(OAUTH_RETURN_KEY)
  return true
}

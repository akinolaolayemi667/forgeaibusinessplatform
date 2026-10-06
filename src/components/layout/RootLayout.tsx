import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useRouteTitle } from '@/hooks/useRouteTitle'
import { clearOAuthReturn, takeOAuthReturn } from '@/lib/oauthReturn'

export function RootLayout() {
  useRouteTitle()
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (user) {
      if (!takeOAuthReturn() || location.pathname.startsWith('/app')) return
      navigate('/app', { replace: true })
      return
    }
    const timeout = window.setTimeout(clearOAuthReturn, 0)
    return () => window.clearTimeout(timeout)
  }, [loading, location.pathname, navigate, user])

  return <Outlet />
}

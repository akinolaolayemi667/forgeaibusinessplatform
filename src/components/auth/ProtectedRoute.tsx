import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { useAuth } from '@/hooks/useAuth'
import { rememberAuthDestination } from '@/lib/oauthReturn'

export function ProtectedRoute() {
  const location = useLocation()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || user) return
    rememberAuthDestination(`${location.pathname}${location.search}`)
  }, [loading, location.pathname, location.search, user])

  if (loading) return <AuthStatus />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

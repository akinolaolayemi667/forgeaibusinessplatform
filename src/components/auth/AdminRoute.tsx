import { Navigate, Outlet } from 'react-router-dom'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { useAuth } from '@/hooks/useAuth'

export function AdminRoute() {
  const { user, loading, accessStatus, isAdmin } = useAuth()

  if (loading || (user && accessStatus === 'loading')) return <AuthStatus />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/app" replace />
  return <Outlet />
}

import { Navigate, Outlet } from 'react-router-dom'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { useAuth } from '@/hooks/useAuth'

export function SuperAdminRoute() {
  const { user, loading, accessStatus, isAdmin, isSuperAdmin } = useAuth()

  if (loading || (user && accessStatus === 'loading')) return <AuthStatus />
  if (!user) return <Navigate to="/login" replace />
  if (isSuperAdmin) return <Outlet />
  if (isAdmin) return <Navigate to="/admin" replace />
  return <Navigate to="/app" replace />
}

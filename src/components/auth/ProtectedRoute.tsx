import { Navigate, Outlet } from 'react-router-dom'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <AuthStatus />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

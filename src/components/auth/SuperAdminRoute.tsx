import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { rememberAuthDestination } from '@/lib/oauthReturn'

export function SuperAdminRoute() {
  const location = useLocation()
  const { user, loading, accessStatus, isSuperAdmin, refreshAccess } = useAuth()
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    if (loading || user) return
    rememberAuthDestination(`${location.pathname}${location.search}`)
  }, [loading, location.pathname, location.search, user])

  if (loading || (user && accessStatus === 'loading') || retrying) return <AuthStatus />
  if (!user) return <Navigate to="/login" replace />
  if (accessStatus === 'unavailable') {
    return (
      <div className="forge-canvas flex min-h-dvh flex-col text-copy">
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          <section className="border border-stroke bg-surface-raised px-5 py-6" aria-live="polite">
            <p className="type-kicker text-ember">Platform role</p>
            <h1 className="mt-3 font-display text-2xl text-copy">Platform role could not be verified.</h1>
            <p className="mt-3 text-sm text-ash">Super Admin stays closed until the platform role can be read.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setRetrying(true)
                  void refreshAccess().finally(() => setRetrying(false))
                }}
              >
                Retry
              </Button>
              <Link to="/app" className="inline-flex h-10 items-center px-4 text-sm text-ash no-underline hover:text-paper">
                Back to Workspace
              </Link>
            </div>
          </section>
        </main>
      </div>
    )
  }
  if (isSuperAdmin) return <Outlet />
  return <Navigate to="/app" replace />
}

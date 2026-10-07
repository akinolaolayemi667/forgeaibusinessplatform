import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useRouteTitle } from '@/hooks/useRouteTitle'
import { clearAuthDestination, peekAuthDestination } from '@/lib/oauthReturn'

export function RootLayout() {
  useRouteTitle()
  const location = useLocation()

  useEffect(() => {
    const destination = peekAuthDestination()
    if (!destination) return
    const here = `${location.pathname}${location.search}`
    if (here === destination || location.pathname === destination.split('?')[0]) {
      clearAuthDestination()
    }
  }, [location.pathname, location.search])

  return <Outlet />
}

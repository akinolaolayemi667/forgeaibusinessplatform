import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { loadAuthorization } from '@/lib/authorization'
import { oauthRedirectTo } from '@/lib/oauthReturn'
import { isAdmin as accessIsAdmin, isSuperAdmin as accessIsSuperAdmin } from '@/lib/permissions'
import { supabase } from '@/lib/supabase'
import type { Authorization, OrganizationRole, OrganizationSummary, PlatformRole } from '@/types/roles'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  accessStatus: Authorization['status']
  role: PlatformRole | null
  organization: OrganizationSummary | null
  organizationRole: OrganizationRole | null
  isAdmin: boolean
  isSuperAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithDiscord: () => Promise<void>
  signOut: () => Promise<void>
  refreshAccess: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState<Authorization>({ status: 'loading' })

  useEffect(() => {
    let active = true

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active || !isSessionEvent(event)) return
      setSession(next)
      setLoading(false)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id

  const refreshAccess = useCallback(async () => {
    if (!userId) return
    const next = await loadAuthorization(userId)
    setAccess(next)
  }, [userId])

  useEffect(() => {
    if (loading) return
    if (!userId) {
      setAccess({ status: 'anonymous' })
      return
    }

    let active = true
    setAccess({ status: 'loading' })
    void loadAuthorization(userId).then((next) => {
      if (active) setAccess(next)
    })

    return () => {
      active = false
    }
  }, [loading, userId])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      accessStatus: access.status,
      role: access.status === 'ready' ? access.platformRole : null,
      organization: access.status === 'ready' ? access.organization : null,
      organizationRole: access.status === 'ready' ? access.organizationRole : null,
      isAdmin: accessIsAdmin(access),
      isSuperAdmin: accessIsSuperAdmin(access),
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: oauthRedirectTo() },
        })
        if (error) throw error
      },
      signInWithDiscord: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: { redirectTo: oauthRedirectTo() },
        })
        if (error) throw error
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        if (error) throw error
      },
      refreshAccess,
    }),
    [access, loading, refreshAccess, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function isSessionEvent(event: AuthChangeEvent) {
  return (
    event === 'INITIAL_SESSION' ||
    event === 'SIGNED_IN' ||
    event === 'SIGNED_OUT' ||
    event === 'TOKEN_REFRESHED' ||
    event === 'USER_UPDATED'
  )
}

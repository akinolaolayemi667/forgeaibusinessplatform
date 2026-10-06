import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { clearOAuthReturn, markOAuthReturn } from '@/lib/oauthReturn'
import { supabase } from '@/lib/supabase'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithDiscord: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInWithGoogle: async () => {
        markOAuthReturn()
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        })
        if (error) {
          clearOAuthReturn()
          throw error
        }
      },
      signInWithDiscord: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: { redirectTo: window.location.origin },
        })
        if (error) throw error
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        if (error) throw error
      },
    }),
    [loading, session],
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

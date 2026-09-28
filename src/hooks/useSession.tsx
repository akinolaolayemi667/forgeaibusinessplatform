import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearStorage, readStorage, writeStorage } from '@/lib/storage'
import type { SessionUser } from '@/types'

const SESSION_KEY = 'forge.session'
const roles: readonly string[] = ['Owner', 'Admin', 'Member']

type SessionContextValue = {
  user: SessionUser | null
  signIn: (user: SessionUser) => void
  signOut: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.email === 'string' &&
    typeof record.role === 'string' &&
    roles.includes(record.role)
  )
}

function readUser() {
  const stored = readStorage(SESSION_KEY)
  return isSessionUser(stored) ? stored : null
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(readUser)

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      signIn: (next) => {
        writeStorage(SESSION_KEY, next)
        setUser(next)
      },
      signOut: () => {
        clearStorage(SESSION_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used within SessionProvider')
  return value
}

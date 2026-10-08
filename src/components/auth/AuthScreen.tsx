import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { peekAuthDestination } from '@/lib/oauthReturn'
import { defaultSignedInPath } from '@/lib/permissions'
import { motion, useReducedMotion } from 'framer-motion'
import { AuthStatus } from '@/components/auth/AuthStatus'
import { Logo } from '@/components/layout/Logo'
import { SkipLink } from '@/components/layout/SkipLink'
import { buttonStyles } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}

function DiscordMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      />
    </svg>
  )
}

function authErrorMessage(error: unknown, provider: 'Google' | 'Discord') {
  const message = error instanceof Error ? error.message.trim() : ''
  if (!message || /token|secret|client_secret|authorization/i.test(message)) {
    return `${provider} sign-in could not start. Try again in a moment.`
  }
  return message
}

export function AuthScreen({
  title,
  description,
  alternate,
}: {
  title: string
  description: string
  alternate: { href: '/login' | '/signup'; prompt: string; label: string }
}) {
  const reduce = useReducedMotion()
  const { user, loading, accessStatus, isAdmin, isSuperAdmin, signInWithGoogle, signInWithDiscord } = useAuth()
  const [pending, setPending] = useState<'google' | 'discord' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function start(provider: 'google' | 'discord') {
    if (pending || loading) return
    setError(null)
    setPending(provider)
    try {
      if (provider === 'google') await signInWithGoogle()
      else await signInWithDiscord()
    } catch (caught) {
      setError(authErrorMessage(caught, provider === 'google' ? 'Google' : 'Discord'))
      setPending(null)
    }
  }

  if (loading || (user && accessStatus === 'loading')) return <AuthStatus />
  if (user) {
    const destination = peekAuthDestination()
    const returningToAuth = !destination || destination === '/login' || destination.startsWith('/login?') || destination === '/signup' || destination.startsWith('/signup?')
    return <Navigate to={returningToAuth ? defaultSignedInPath({ isAdmin, isSuperAdmin }) : destination} replace />
  }

  return (
    <div className="forge-canvas flex min-h-dvh flex-col text-copy">
      <SkipLink />
      <header className="border-b border-stroke bg-surface-raised">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <p className="type-kicker text-muted">Auth / 01</p>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 outline-none sm:px-6">
        <motion.section
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
          className="border border-steel bg-ink text-paper"
          data-theme="iron"
        >
          <div className="border-b border-steel px-5 py-4 sm:px-6">
            <p className="type-kicker text-ash">Workspace access</p>
          </div>
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-paper sm:text-4xl">{title}</h1>
              <p className="max-w-md text-sm leading-6 text-stone">{description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className={buttonStyles('outline', 'lg', 'w-full')}
                onClick={() => void start('google')}
                disabled={pending !== null}
                aria-busy={pending === 'google' || undefined}
                aria-label={pending === 'google' ? 'CONNECTING TO GOOGLE...' : 'CONTINUE WITH GOOGLE'}
              >
                <GoogleMark />
                {pending === 'google' ? 'CONNECTING TO GOOGLE...' : 'CONTINUE WITH GOOGLE'}
              </button>
              <button
                type="button"
                className={buttonStyles('primary', 'lg', 'w-full')}
                onClick={() => void start('discord')}
                disabled={pending !== null}
                aria-busy={pending === 'discord' || undefined}
                aria-label={pending === 'discord' ? 'CONNECTING TO DISCORD...' : 'CONTINUE WITH DISCORD'}
              >
                <DiscordMark />
                {pending === 'discord' ? 'CONNECTING TO DISCORD...' : 'CONTINUE WITH DISCORD'}
              </button>
            </div>
            {error ? (
              <p role="alert" className="border border-danger bg-badge-danger-bg px-3 py-2 text-sm text-badge-danger-fg">
                {error}
              </p>
            ) : null}
            <p className="text-sm text-ash">
              {alternate.prompt}{' '}
              <Link to={alternate.href} className="text-paper underline">
                {alternate.label}
              </Link>
            </p>
          </div>
        </motion.section>
        <footer className="mt-6 flex flex-col gap-1">
          <p className="type-kicker text-muted">Secure authentication</p>
          <p className="type-kicker text-ash">Powered by Supabase</p>
        </footer>
      </main>
    </div>
  )
}

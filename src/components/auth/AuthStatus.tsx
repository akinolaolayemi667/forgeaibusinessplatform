import { motion, useReducedMotion } from 'framer-motion'

export function AuthStatus() {
  const reduce = useReducedMotion()

  return (
    <div className="forge-canvas flex min-h-dvh flex-col text-copy">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <section className="border border-stroke bg-surface-raised px-5 py-6 sm:px-6" aria-live="polite">
          <p className="type-kicker text-ember">Authenticating</p>
          <p className="mt-3 font-display text-2xl text-copy">Verifying workspace access...</p>
          <div className="mt-6 h-px overflow-hidden bg-stroke" aria-hidden>
            <motion.div
              className="h-px w-1/3 bg-ember"
              initial={reduce ? false : { x: '-100%' }}
              animate={reduce ? undefined : { x: '220%' }}
              transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

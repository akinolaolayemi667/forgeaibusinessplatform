import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function SectionIntro({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="type-kicker text-ember">{eyebrow}</p>
      <h2 id={id} className="font-display text-3xl text-copy sm:text-4xl">
        {title}
      </h2>
      {children ? <p className="max-w-xl text-base text-muted">{children}</p> : null}
    </div>
  )
}

export function Section({
  id,
  labelledBy,
  children,
  className,
  theme,
}: {
  id?: string
  labelledBy: string
  children: ReactNode
  className?: string
  theme?: 'iron'
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-theme={theme}
      className={cn('scroll-mt-20', className)}
    >
      {children}
    </section>
  )
}

export const frame = 'mx-auto w-full max-w-6xl px-4 sm:px-6'

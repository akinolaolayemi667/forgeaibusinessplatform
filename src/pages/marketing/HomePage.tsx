import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { forgeData } from '@/data'
import { HomePoints } from '@/components/marketing/HomePoints'
import { QueryState } from '@/components/ui/QueryState'
import { buttonStyles } from '@/components/ui/Button'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function HomePage() {
  const reduce = useReducedMotion()
  const { workspace } = useWorkspace()
  const points = useAsyncData('home-points', () => forgeData.listHomePoints())
  const metrics = useAsyncData(`home-metrics:${workspace.id}`, () => forgeData.listMetrics(workspace.id))

  return (
    <motion.div
      className="flex flex-col gap-14"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: 'easeOut' }}
    >
      <section aria-labelledby="home-title" className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-end">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">AI business automation</p>
          <h1 id="home-title" className="max-w-xl font-display text-5xl text-copy sm:text-6xl">
            The workbench for revenue teams.
          </h1>
          <p className="max-w-xl text-base text-muted">
            FORGE keeps leads, conversations, and the next action on one record, so the team spends time on judgment
            instead of chasing status.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/app" className={buttonStyles('primary', 'lg')}>
              Enter the workspace
            </Link>
            <Link to="/architecture" className={buttonStyles('outline', 'lg')}>
              Read the architecture
            </Link>
          </div>
        </div>
        <aside className="border-t border-stroke pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Sample workspace</p>
          <p className="mt-2 font-display text-3xl text-copy">{workspace.name}</p>
          <QueryState loading={metrics.loading} error={metrics.error}>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {(metrics.data ?? []).map((metric) => (
                <div key={metric.id}>
                  <dt className="text-sm text-muted">{metric.label}</dt>
                  <dd className="font-display text-2xl text-copy tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </QueryState>
        </aside>
      </section>
      <section aria-labelledby="practice-title" className="flex flex-col gap-4">
        <h2 id="practice-title" className="font-display text-2xl text-copy">
          How work moves
        </h2>
        <QueryState loading={points.loading} error={points.error}>
          <HomePoints points={points.data ?? []} />
        </QueryState>
      </section>
    </motion.div>
  )
}

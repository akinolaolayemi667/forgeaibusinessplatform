import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { QueryState } from '@/components/ui/QueryState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { activityLines, pipelineValue, workflowStatus, type HomeBundle } from '@/components/marketing/homeModel'
import { formatCurrency } from '@/utils/format'

export function ProductPreview({
  workspaceName,
  bundle,
  loading,
  error,
}: {
  workspaceName: string
  bundle: HomeBundle | null
  loading: boolean
  error: string | null
}) {
  const reduce = useReducedMotion()
  const lines = useMemo(() => (bundle ? activityLines(bundle) : []), [bundle])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || lines.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % lines.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [lines.length, reduce])

  const line = lines[index] ?? lines[0]

  return (
    <aside data-theme="iron" className="border border-stroke bg-surface text-copy" aria-label="Live product preview">
      <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
        <p className="type-kicker text-muted">
          <span className="mr-2 inline-block size-1.5 bg-ember align-middle" aria-hidden />
          Live sample
        </p>
        <p className="truncate text-sm text-copy">{workspaceName}</p>
      </div>
      <QueryState loading={loading} error={error}>
        {bundle ? <PreviewBody bundle={bundle} line={line} reduce={Boolean(reduce)} /> : null}
      </QueryState>
      <div className="border-t border-stroke px-4 py-3">
        <Link to="/app" className="text-sm text-stone no-underline hover:text-paper">
          Open this workspace
        </Link>
      </div>
    </aside>
  )
}

function PreviewBody({ bundle, line, reduce }: { bundle: HomeBundle; line: string | undefined; reduce: boolean }) {
  const revenue = formatCurrency(pipelineValue(bundle.deals))
  const leadMetric = bundle.metrics.find((metric) => metric.label === 'Open leads')
  const topDeals = [...bundle.deals].sort((a, b) => b.value - a.value).slice(0, 2)
  const liveAutos = bundle.automations.filter((item) => item.status === 'Live')
  const briefing = bundle.briefings[0]

  return (
    <div className="flex flex-col">
      <dl className="grid sm:grid-cols-2">
        <Cell label="Leads" value={leadMetric?.value ?? String(bundle.leads.length)}>
          <ul className="flex flex-col gap-1.5">
            {bundle.leads.slice(0, 2).map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-2 text-xs text-stone">
                <span className="truncate">{lead.company}</span>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        </Cell>
        <Cell label="Pipeline" value={String(bundle.deals.length)}>
          <ul className="flex flex-col gap-1.5">
            {topDeals.map((deal) => (
              <li key={deal.id} className="flex items-center justify-between gap-2 text-xs text-stone">
                <span className="truncate">{deal.stage}</span>
                <span className="type-data shrink-0">{formatCurrency(deal.value)}</span>
              </li>
            ))}
          </ul>
        </Cell>
        <Cell label="Automation" value={String(liveAutos.length)}>
          <p className="text-xs text-stone">{liveAutos[0]?.name ?? 'No live rule'} · live</p>
        </Cell>
        <Cell label="AI activity" value={briefing ? 'Ready' : '—'}>
          <p className="line-clamp-2 text-xs text-stone">{briefing?.nextStep ?? 'No briefing in this workspace.'}</p>
        </Cell>
        <Cell label="Revenue" value={revenue}>
          <p className="text-xs text-stone">Open deal value</p>
        </Cell>
        <Cell label="Workflow" value={workflowStatus(bundle.automations).split(' · ')[0] ?? '—'}>
          <p className="text-xs text-stone">{workflowStatus(bundle.automations)}</p>
        </Cell>
      </dl>
      <p className="border-t border-stroke px-4 py-3 text-xs text-stone" aria-live="polite">
        <span className="type-kicker mr-2 text-ember">Activity</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={line}
            className="inline"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
          >
            {line}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  )
}

function Cell({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-stroke p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
      <dt className="type-kicker text-muted">{label}</dt>
      <dd className="type-data text-2xl text-copy">{value}</dd>
      {children}
    </div>
  )
}

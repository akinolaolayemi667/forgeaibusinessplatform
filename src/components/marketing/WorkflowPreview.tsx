import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { HomeBundle } from '@/components/marketing/homeModel'
import { formatCurrency } from '@/utils/format'

const steps = [
  { id: 'capture', label: 'Capture', kicker: '01' },
  { id: 'qualify', label: 'Qualify', kicker: '02' },
  { id: 'brief', label: 'Brief', kicker: '03' },
  { id: 'move', label: 'Move', kicker: '04' },
  { id: 'close', label: 'Close', kicker: '05' },
] as const

type StepId = (typeof steps)[number]['id']

export function WorkflowPreview({ bundle }: { bundle: HomeBundle }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState<StepId>('capture')
  const active = steps.find((item) => item.id === step) ?? steps[0]

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : event.key === 'Home'
            ? -index
            : event.key === 'End'
              ? steps.length - 1 - index
              : 0
    if (direction === 0) return
    event.preventDefault()
    const next = steps[(index + direction + steps.length) % steps.length]
    setStep(next.id)
    document.getElementById(`workflow-tab-${next.id}`)?.focus()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <div role="tablist" aria-label="Workflow stages" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {steps.map((item, index) => {
          const selected = item.id === step
          return (
            <button
              key={item.id}
              id={`workflow-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="workflow-panel"
              tabIndex={selected ? 0 : -1}
              className={
                selected
                  ? 'cursor-pointer border border-ember bg-surface-raised px-3 py-2 text-left text-sm font-medium text-copy'
                  : 'cursor-pointer border border-stroke bg-transparent px-3 py-2 text-left text-sm text-muted hover:border-stone hover:text-copy'
              }
              onClick={() => setStep(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="type-kicker mr-2 text-ember">{item.kicker}</span>
              {item.label}
            </button>
          )
        })}
      </div>
      <div
        id="workflow-panel"
        role="tabpanel"
        aria-labelledby={`workflow-tab-${active.id}`}
        className="min-h-48 border border-stroke bg-surface-raised p-5"
      >
        {reduce ? (
          <StepBody step={active.id} bundle={bundle} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepBody step={active.id} bundle={bundle} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function StepBody({ step, bundle }: { step: StepId; bundle: HomeBundle }) {
  const lead = bundle.leads.find((item) => item.status === 'New') ?? bundle.leads[0]
  const qualified = bundle.leads.find((item) => item.status === 'Qualified') ?? bundle.leads[0]
  const briefing = bundle.briefings[0]
  const automation = bundle.automations.find((item) => item.status === 'Live') ?? bundle.automations[0]
  const deal = [...bundle.deals].sort((a, b) => b.value - a.value)[0]

  if (step === 'capture' && lead) {
    return (
      <StepCopy
        title={`${lead.name} enters from ${lead.source}`}
        body={`${lead.company} is on the record with an owner and a status. Nothing waits in a side spreadsheet.`}
      >
        <Meta label="Owner" value={lead.owner} />
        <StatusBadge status={lead.status} />
      </StepCopy>
    )
  }

  if (step === 'qualify' && qualified) {
    return (
      <StepCopy
        title={`Score ${qualified.score} before anyone writes back`}
        body={`${qualified.name} at ${qualified.company} is marked ${qualified.status.toLowerCase()}. The owner is ${qualified.owner}.`}
      >
        <Meta label="Score" value={String(qualified.score)} />
        <StatusBadge status={qualified.status} />
      </StepCopy>
    )
  }

  if (step === 'brief' && briefing) {
    return (
      <StepCopy title={briefing.account} body={briefing.summary}>
        <p className="text-sm text-copy">{briefing.nextStep}</p>
      </StepCopy>
    )
  }

  if (step === 'move' && automation) {
    return (
      <StepCopy
        title={automation.name}
        body={`${automation.trigger}. The run count stays visible, and the rule can be paused.`}
      >
        <StatusBadge status={automation.status} />
        <Meta label="Runs" value={String(automation.runs)} />
      </StepCopy>
    )
  }

  if (step === 'close' && deal) {
    return (
      <StepCopy
        title={deal.name}
        body={`${deal.company} is in ${deal.stage}. Open value on this record is ${formatCurrency(deal.value)}.`}
      >
        <Meta label="Owner" value={deal.owner} />
        <StatusBadge status={deal.stage} />
      </StepCopy>
    )
  }

  return <p className="text-sm text-muted">This workspace has no sample for this stage.</p>
}

function StepCopy({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-2xl text-copy">{title}</h3>
      <p className="max-w-xl text-sm text-muted">{body}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-muted">
      <span className="type-kicker mr-2">{label}</span>
      <span className="text-copy">{value}</span>
    </p>
  )
}

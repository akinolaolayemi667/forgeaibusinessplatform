import { Link } from 'react-router-dom'
import { QueryState } from '@/components/ui/QueryState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { WorkflowPreview } from '@/components/marketing/WorkflowPreview'
import {
  featureAnchor,
  problems,
  solutions,
  systems,
  workflowStatus,
  type HomeBundle,
} from '@/components/marketing/homeModel'
import { Reveal, Section, SectionIntro, frame } from '@/components/marketing/primitives'
import { buttonStyles } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import type { AsyncData } from '@/hooks/useAsyncData'

type Query = Pick<AsyncData<HomeBundle>, 'data' | 'loading' | 'error'>

export function TechnologyStrip() {
  return (
    <Section labelledBy="stack-title" className="border-y border-stroke">
      <div className={`${frame} flex flex-col gap-4 py-8`}>
        <h2 id="stack-title" className="type-kicker text-muted">
          Systems on the same floor
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {systems.map((name) => (
            <li key={name} className="font-display text-lg tracking-[-0.04em] text-copy sm:text-xl">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export function ProblemSection() {
  return (
    <Section id="problem" labelledBy="problem-title" theme="iron" className="bg-surface text-copy">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="problem-title" eyebrow="The problem" title="The work is real. The system around it is not.">
          Revenue teams still rebuild a deal from an inbox, a spreadsheet, and a CRM that lags the conversation.
        </SectionIntro>
        <ol className="grid gap-4 md:grid-cols-3">
          {problems.map((item) => (
            <li key={item.index} className="border border-stroke bg-surface-raised p-5">
              <p className="type-data text-ember">{item.index}</p>
              <h3 className="mt-3 font-display text-xl text-copy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}

export function SolutionSection() {
  return (
    <Section id="solution" labelledBy="solution-title">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="solution-title" eyebrow="The solution" title="One record. Rules that move it. A person who decides.">
          FORGE connects CRM, AI, communication, and workflow automation so the lead, the thread, the stage, and the next step stay together.
        </SectionIntro>
        <ol className="grid gap-4 md:grid-cols-3">
          {solutions.map((item) => (
            <li key={item.index} className="border border-stroke bg-surface-raised p-5">
              <p className="type-data text-ember">{item.index}</p>
              <h3 className="mt-3 font-display text-xl text-copy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}

export function PlatformSection({ query }: { query: Query }) {
  return (
    <Section id="platform" labelledBy="platform-title" className="border-t border-stroke">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="platform-title" eyebrow="Platform" title="Six surfaces. One operating record.">
          Explore the floor plan, then open any surface in the sample workspace.
        </SectionIntro>
        <QueryState loading={query.loading} error={query.error}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(query.data?.features ?? []).map((feature) => (
              <li key={feature.id}>
                <a href={featureAnchor(feature.id)} className="flex h-full flex-col gap-2 border border-stroke bg-surface-raised p-5 no-underline hover:border-stone">
                  <h3 className="font-display text-xl text-copy">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        </QueryState>
      </Reveal>
    </Section>
  )
}

export function CrmSection({ query }: { query: Query }) {
  const leads = query.data?.leads ?? []
  const deals = query.data?.deals ?? []
  const note = query.data?.conversations[0]
  return (
    <Section id="crm" labelledBy="crm-title">
      <Reveal className={`${frame} grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
        <SectionIntro id="crm-title" eyebrow="CRM" title="Leads, notes, and pipeline on one floor.">
          A lead arrives with a source, an owner, and a score. The latest conversation stays attached. The deal does not live on a second board.
        </SectionIntro>
        <div className="border border-stroke bg-surface-raised">
          <QueryState loading={query.loading} error={query.error}>
            <div className="grid md:grid-cols-2">
              <div className="border-b border-stroke p-4 md:border-r md:border-b-0">
                <p className="type-kicker text-muted">Leads</p>
                <ul className="mt-3 flex flex-col">
                  {leads.slice(0, 3).map((lead) => (
                    <li key={lead.id} className="flex items-center justify-between gap-3 border-t border-stroke py-2 first:border-t-0">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-copy">{lead.name}</span>
                        <span className="block truncate text-xs text-muted">{lead.company}</span>
                      </span>
                      <StatusBadge status={lead.status} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4">
                <p className="type-kicker text-muted">Pipeline</p>
                <ul className="mt-3 flex flex-col">
                  {deals.slice(0, 3).map((deal) => (
                    <li key={deal.id} className="flex items-center justify-between gap-3 border-t border-stroke py-2 first:border-t-0">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-copy">{deal.company}</span>
                        <span className="block truncate text-xs text-muted">{deal.stage}</span>
                      </span>
                      <span className="type-data text-sm text-copy">{formatCurrency(deal.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {note ? (
              <p className="border-t border-stroke px-4 py-3 text-sm text-muted">
                <span className="text-copy">{note.contact}</span> · {note.channel} · {note.preview}
              </p>
            ) : null}
          </QueryState>
        </div>
        <More href="/app/leads" label="Open leads" />
      </Reveal>
    </Section>
  )
}

export function AiSection({ query }: { query: Query }) {
  const briefing = query.data?.briefings[0]
  return (
    <Section id="ai" labelledBy="ai-title" className="border-t border-stroke">
      <Reveal className={`${frame} grid gap-8 py-16 sm:py-20 lg:grid-cols-2 lg:items-start`}>
        <SectionIntro id="ai-title" eyebrow="AI" title="A briefing before the reply.">
          The assistant reads the account and names the next step. It does not send the message. The operator does.
        </SectionIntro>
        <div className="border border-stroke bg-surface-raised p-5">
          <QueryState loading={query.loading} error={query.error}>
            {briefing ? (
              <div className="flex flex-col gap-3">
                <p className="type-kicker text-ember">{briefing.account}</p>
                <p className="text-sm text-muted">{briefing.summary}</p>
                <p className="border-t border-stroke pt-3 text-sm text-copy">{briefing.nextStep}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">No briefing in this workspace.</p>
            )}
          </QueryState>
        </div>
        <More href="/app/ai" label="Open the assistant" />
      </Reveal>
    </Section>
  )
}

export function AutomationSection({ query }: { query: Query }) {
  const automations = query.data?.automations ?? []
  return (
    <Section id="automation" labelledBy="automation-title">
      <Reveal className={`${frame} grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
        <div className="flex flex-col gap-4">
          <SectionIntro id="automation-title" eyebrow="Automation" title="Rules you can see, pause, and trust.">
            Each rule names its trigger, its status, and how many times it has run.
          </SectionIntro>
          <More href="/app/automations" label="Open automations" />
        </div>
        <div className="border border-stroke bg-surface-raised">
          <QueryState loading={query.loading} error={query.error}>
            <p className="type-kicker border-b border-stroke px-4 py-3 text-muted">{workflowStatus(automations)}</p>
            <ul>
              {automations.map((automation) => (
                <li key={automation.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-stroke px-4 py-3 last:border-b-0">
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-copy">{automation.name}</span>
                    <span className="block truncate text-xs text-muted">{automation.trigger}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="type-data text-xs text-muted">{automation.runs}</span>
                    <StatusBadge status={automation.status} />
                  </span>
                </li>
              ))}
            </ul>
          </QueryState>
        </div>
      </Reveal>
    </Section>
  )
}

export function AnalyticsSection({ query }: { query: Query }) {
  const metrics = query.data?.metrics ?? []
  const chart = query.data?.chart ?? []
  const peak = Math.max(1, ...chart.map((point) => Math.max(point.qualified, point.won)))
  return (
    <Section id="analytics" labelledBy="analytics-title" className="border-t border-stroke">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="analytics-title" eyebrow="Analytics" title="Qualified work, measured against revenue.">
          The sample workspace reports open leads, qualification, pipeline value, and reply time on one read.
        </SectionIntro>
        <QueryState loading={query.loading} error={query.error}>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="border border-stroke bg-surface-raised p-4">
                <dt className="text-sm text-muted">{metric.label}</dt>
                <dd className="type-data mt-2 text-3xl text-copy">{metric.value}</dd>
                <dd className="mt-1 text-xs text-muted">{metric.delta}</dd>
              </div>
            ))}
          </dl>
          <div className="border border-stroke bg-surface-raised p-4">
            <p className="type-kicker text-muted">Qualified and won</p>
            <ul className="mt-4 flex items-end gap-3" aria-hidden>
              {chart.map((point) => (
                <li key={point.label} className="flex flex-1 items-end gap-1">
                  <span className="block w-full bg-ember" style={{ height: `${Math.max(4, (point.qualified / peak) * 96)}px` }} />
                  <span className="block w-full bg-stone" style={{ height: `${Math.max(4, (point.won / peak) * 96)}px` }} />
                </li>
              ))}
            </ul>
            <ul className="sr-only">
              {chart.map((point) => (
                <li key={point.label}>
                  {point.label}: {point.qualified} qualified, {point.won} won
                </li>
              ))}
            </ul>
          </div>
        </QueryState>
        <More href="/app/analytics" label="Open analytics" />
      </Reveal>
    </Section>
  )
}

export function IntegrationsSection({ query }: { query: Query }) {
  const integrations = query.data?.integrations ?? []
  return (
    <Section id="integrations" labelledBy="integrations-title">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="integrations-title" eyebrow="Integrations" title="Connected where the work already happens.">
          Inbox, calendar, and team chat sit on the same record. Available systems stay listed until someone connects them.
        </SectionIntro>
        <QueryState loading={query.loading} error={query.error}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {integrations.map((integration) => (
              <li key={integration.id} className="flex items-center justify-between gap-3 border border-stroke bg-surface-raised px-4 py-3">
                <span>
                  <span className="block text-sm text-copy">{integration.name}</span>
                  <span className="block text-xs text-muted">{integration.category}</span>
                </span>
                <StatusBadge status={integration.status} />
              </li>
            ))}
          </ul>
        </QueryState>
        <More href="/app/integrations" label="Open integrations" />
      </Reveal>
    </Section>
  )
}

export function WorkflowSection({ query }: { query: Query }) {
  return (
    <Section id="workflow" labelledBy="workflow-title" className="border-t border-stroke">
      <Reveal className={`${frame} flex flex-col gap-8 py-16 sm:py-20`}>
        <SectionIntro id="workflow-title" eyebrow="How it works" title="Watch one record move.">
          Step through capture, qualification, the briefing, the rule, and the open deal. Arrow keys move between stages.
        </SectionIntro>
        <QueryState loading={query.loading} error={query.error}>
          {query.data ? <WorkflowPreview bundle={query.data} /> : null}
        </QueryState>
      </Reveal>
    </Section>
  )
}

export function ClosingCta() {
  return (
    <Section id="start" labelledBy="cta-title" theme="iron" className="bg-surface text-copy">
      <Reveal className={`${frame} flex flex-col gap-6 py-16 sm:py-20`}>
        <SectionIntro id="cta-title" eyebrow="Start" title="Run the business from one record.">
          Open a preview workspace. Sample records stay in this browser until the real stack is connected.
        </SectionIntro>
        <div className="flex flex-wrap gap-2">
          <Link to="/signup" className={buttonStyles('primary', 'lg')}>
            Start a preview
          </Link>
          <Link to="/pricing" className={buttonStyles('outline', 'lg')}>
            Review pricing
          </Link>
        </div>
      </Reveal>
    </Section>
  )
}

function More({ href, label }: { href: string; label: string }) {
  return (
    <Link to={href} className="text-sm font-medium text-copy no-underline hover:text-ember">
      {label}
    </Link>
  )
}

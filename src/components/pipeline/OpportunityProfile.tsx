import { PipelineStageBadge } from '@/components/pipeline/PipelineStageBadge'
import { formatActivityWhen } from '@/data/crm/time'
import { formatCurrency, formatDate } from '@/utils/format'
import type { Opportunity } from '@/data/pipeline'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-stroke px-4 py-3">
      <dt className="type-kicker text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-copy">{value}</dd>
    </div>
  )
}

export function OpportunityProfile({ opportunity }: { opportunity: Opportunity }) {
  return (
    <section className="border border-stroke bg-surface-raised">
      <header className="border-b border-stroke px-4 py-3">
        <h2 className="font-display text-lg text-copy">Profile</h2>
      </header>
      <dl className="grid sm:grid-cols-2">
        <Row label="Opportunity name" value={opportunity.name} />
        <Row label="Company" value={opportunity.company} />
        <Row label="Primary contact" value={opportunity.contact || '—'} />
        <Row label="Deal value" value={formatCurrency(opportunity.value)} />
        <Row label="Probability" value={`${opportunity.probability}%`} />
        <Row label="Expected close" value={formatDate(opportunity.expectedCloseDate)} />
        <div className="border-b border-stroke px-4 py-3">
          <dt className="type-kicker text-muted">Stage</dt>
          <dd className="mt-1">
            <PipelineStageBadge stageId={opportunity.stageId} />
          </dd>
        </div>
        <Row label="Owner" value={opportunity.owner} />
        <Row label="Source" value={opportunity.source} />
        <Row label="Created" value={formatDate(opportunity.createdAt)} />
        <Row label="Last activity" value={formatActivityWhen(opportunity.lastActivityAt)} />
        {opportunity.lossReason ? <Row label="Loss reason" value={opportunity.lossReason} /> : null}
      </dl>
      {opportunity.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2 px-4 py-3" aria-label="Tags">
          {opportunity.tags.map((tag) => (
            <li key={tag} className="border border-stroke px-2 py-1 text-xs text-copy">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

import { LeadScore } from '@/components/leads/LeadScore'
import { LeadStatusBadge } from '@/components/leads/LeadStatus'
import { formatActivityWhen } from '@/data/crm/time'
import { formatDate } from '@/utils/format'
import { leadName, type SalesLead } from '@/data/leads'

export function LeadProfile({ lead, onEdit }: { lead: SalesLead; onEdit: () => void }) {
  const rows = [
    ['Full name', leadName(lead)],
    ['Job title', lead.title || '—'],
    ['Company', lead.company],
    ['Email', lead.email],
    ['Phone', lead.phone || '—'],
    ['Location', lead.location || '—'],
    ['Lead source', lead.source],
    ['Owner', lead.owner],
    ['Created', formatDate(lead.createdAt)],
    ['Last activity', formatActivityWhen(lead.lastActivityAt)],
  ] as const

  return (
    <section className="border border-stroke bg-surface-raised">
      <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
        <h2 className="font-display text-lg text-copy">Lead profile</h2>
        <button type="button" className="cursor-pointer text-sm text-copy hover:text-ember" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl className="grid sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b border-stroke px-4 py-3">
            <dt className="type-kicker text-muted">{label}</dt>
            <dd className="mt-1 text-sm text-copy">{value}</dd>
          </div>
        ))}
        <div className="border-b border-stroke px-4 py-3">
          <dt className="type-kicker text-muted">Status</dt>
          <dd className="mt-1">
            <LeadStatusBadge status={lead.status} />
          </dd>
        </div>
        <div className="border-b border-stroke px-4 py-3">
          <dt className="type-kicker text-muted">Score</dt>
          <dd className="mt-1">
            <LeadScore score={lead.score} />
          </dd>
        </div>
        <div className="border-b border-stroke px-4 py-3 sm:col-span-2">
          <dt className="type-kicker text-muted">Tags</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {lead.tags.length === 0 ? <span className="text-sm text-muted">No tags</span> : null}
            {lead.tags.map((tag) => (
              <span key={tag} className="border border-stroke px-1.5 py-0.5 font-mono text-[11px] text-stone">
                {tag}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  )
}

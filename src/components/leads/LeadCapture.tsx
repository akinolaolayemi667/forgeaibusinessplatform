import { formatDate } from '@/utils/format'
import type { SalesLead } from '@/data/leads'

export function LeadCapture({ lead }: { lead: SalesLead }) {
  const rows = [
    ['Source', lead.source],
    ['Campaign', lead.campaign || '—'],
    ['Landing page', lead.landingPage || '—'],
    ['Captured', formatDate(lead.createdAt)],
  ] as const
  return (
    <section className="border border-stroke bg-surface-raised p-4">
      <h2 className="font-display text-lg text-copy">Source</h2>
      <dl className="mt-3 flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="type-kicker text-muted">{label}</dt>
            <dd className="mt-1 text-sm text-copy">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

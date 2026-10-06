import { formatActivityWhen } from '@/data/crm/time'
import type { LeadEngagement as Engagement } from '@/data/leads'

const labels = [
  ['emailOpens', 'Email opens'],
  ['emailReplies', 'Email replies'],
  ['websiteVisits', 'Website visits'],
  ['messages', 'Messages'],
  ['calls', 'Calls'],
] as const

export function LeadEngagement({ engagement }: { engagement: Engagement }) {
  return (
    <section className="border border-stroke bg-surface-raised p-4">
      <h2 className="font-display text-lg text-copy">Engagement</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3">
        {labels.map(([key, label]) => (
          <div key={key}>
            <dt className="type-kicker text-muted">{label}</dt>
            <dd className="type-data mt-1 text-xl text-copy">{engagement[key]}</dd>
          </div>
        ))}
        <div className="col-span-2">
          <dt className="type-kicker text-muted">Last engagement</dt>
          <dd className="mt-1 text-sm text-copy">{formatActivityWhen(engagement.lastEngagementAt)}</dd>
        </div>
      </dl>
    </section>
  )
}

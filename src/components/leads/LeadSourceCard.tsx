import type { LeadSourceMix } from '@/data/leads'

export function LeadSourceCard({ sources }: { sources: LeadSourceMix[] }) {
  return (
    <section className="border border-stroke bg-surface-raised">
      <div className="border-b border-stroke px-4 py-3">
        <h2 className="font-display text-lg text-copy">Lead sources</h2>
      </div>
      <ul className="flex flex-col">
        {sources.map((source) => (
          <li key={source.label} className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3 border-b border-stroke px-4 py-3 last:border-b-0">
            <span className="text-sm text-copy">{source.label}</span>
            <span className="h-1 bg-steel" aria-hidden>
              <span className="block h-1 bg-ember" style={{ width: `${source.share}%` }} />
            </span>
            <span className="type-data text-right text-sm text-copy">{source.share}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

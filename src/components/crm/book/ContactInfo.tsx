import { ContactStatus } from '@/components/crm/book/ContactStatus'
import { formatDate } from '@/utils/format'
import type { CrmContact } from '@/data/crm'

export function ContactInfo({
  contact,
  company,
  onEdit,
}: {
  contact: CrmContact
  company: string
  onEdit: () => void
}) {
  const rows = [
    ['Full name', `${contact.firstName} ${contact.lastName}`],
    ['Job title', contact.title || '—'],
    ['Company', company],
    ['Email', contact.email],
    ['Phone', contact.phone || '—'],
    ['Location', contact.location || '—'],
    ['Owner', contact.owner],
  ] as const

  return (
    <section className="border border-stroke bg-surface-raised">
      <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
        <h2 className="font-display text-lg text-copy">Contact information</h2>
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
            <ContactStatus status={contact.status} />
          </dd>
        </div>
        <div className="border-b border-stroke px-4 py-3 sm:col-span-2">
          <dt className="type-kicker text-muted">Tags</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {contact.tags.length === 0 ? <span className="text-sm text-muted">No tags</span> : null}
            {contact.tags.map((tag) => (
              <span key={tag} className="border border-stroke px-1.5 py-0.5 font-mono text-[11px] text-stone">
                {tag}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="sr-only">Created {formatDate(contact.createdAt)}</p>
    </section>
  )
}

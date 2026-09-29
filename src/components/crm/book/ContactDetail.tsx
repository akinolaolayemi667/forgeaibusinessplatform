import { Link } from 'react-router-dom'
import { ContactActivityTimeline } from '@/components/crm/book/ContactActivityTimeline'
import { ContactInfo } from '@/components/crm/book/ContactInfo'
import { ContactNotes } from '@/components/crm/book/ContactNotes'
import { ContactQuickActions } from '@/components/crm/book/ContactQuickActions'
import { ContactStatus } from '@/components/crm/book/ContactStatus'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { Button } from '@/components/ui/Button'
import { contactName, crmOwners, crmStatuses, formatActivityWhen, type CrmActivity, type CrmContact, type CrmNote, type CrmStatus } from '@/data/crm'
import { formatDate } from '@/utils/format'

export function ContactDetail({
  contact,
  company,
  activities,
  notes,
  noteOpen,
  onBack,
  onEdit,
  onTask,
  onNote,
  onSaveNote,
  onStatus,
  onAssign,
}: {
  contact: CrmContact
  company: string
  activities: CrmActivity[]
  notes: CrmNote[]
  noteOpen: boolean
  onBack: () => void
  onEdit: () => void
  onTask: () => void
  onNote: () => void
  onSaveNote: (body: string) => void
  onStatus: (status: CrmStatus) => void
  onAssign: (owner: string) => void
}) {
  const name = contactName(contact)
  const more = [
    ...crmStatuses.map((status) => ({ id: `status-${status}`, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...crmOwners.map((owner) => ({ id: `owner-${owner}`, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button type="button" className="cursor-pointer text-sm text-muted hover:text-copy" onClick={onBack}>
          Back to Contacts
        </button>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl text-copy sm:text-4xl">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {contact.companyId ? (
                <Link to={`/app/crm/companies/${contact.companyId}`} className="text-copy no-underline hover:text-ember">
                  {company}
                </Link>
              ) : (
                <span>{company}</span>
              )}
              <ContactStatus status={contact.status} />
              <span>{contact.owner}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" onClick={onTask}>
              Create task
            </Button>
            <Button onClick={onNote}>Add note</Button>
            <RowMenu label="More actions" items={more} />
          </div>
        </div>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-6">
          <ContactInfo contact={contact} company={company} onEdit={onEdit} />
          <section className="border border-stroke bg-surface-raised">
            <div className="border-b border-stroke px-4 py-3">
              <h2 className="font-display text-lg text-copy">Activity</h2>
            </div>
            <div className="px-4">
              <ContactActivityTimeline items={activities} />
            </div>
          </section>
          <ContactNotes notes={notes} open={noteOpen} onOpen={onNote} onSave={onSaveNote} />
        </div>
        <aside className="flex flex-col gap-4">
          <ContactQuickActions email={contact.email} phone={contact.phone} onTask={onTask} onNote={onNote} />
          <section className="border border-stroke bg-surface-raised p-4">
            <h2 className="font-display text-lg text-copy">Contact details</h2>
            <dl className="mt-3 flex flex-col gap-3">
              <div>
                <dt className="type-kicker text-muted">Last activity</dt>
                <dd className="mt-1 text-sm text-copy">{formatActivityWhen(contact.lastActivityAt)}</dd>
              </div>
              <div>
                <dt className="type-kicker text-muted">Created</dt>
                <dd className="mt-1 text-sm text-copy">{formatDate(contact.createdAt)}</dd>
              </div>
              <div>
                <dt className="type-kicker text-muted">Lead source</dt>
                <dd className="mt-1 text-sm text-copy">{contact.source}</dd>
              </div>
              <div>
                <dt className="type-kicker text-muted">Owner</dt>
                <dd className="mt-1 text-sm text-copy">{contact.owner}</dd>
              </div>
            </dl>
          </section>
          <section className="border border-stroke bg-surface-raised p-4">
            <h2 className="font-display text-lg text-copy">Tags</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {contact.tags.length === 0 ? <li className="text-sm text-muted">No tags</li> : null}
              {contact.tags.map((tag) => (
                <li key={tag} className="border border-stroke px-1.5 py-0.5 font-mono text-[11px] text-stone">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

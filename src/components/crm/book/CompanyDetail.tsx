import { Link } from 'react-router-dom'
import { ContactActivityTimeline } from '@/components/crm/book/ContactActivityTimeline'
import { CompanyStatusBadge } from '@/components/crm/book/ContactStatus'
import { ContactNotes } from '@/components/crm/book/ContactNotes'
import { CRMStatCard } from '@/components/crm/book/CRMStatCard'
import { contactName, formatActivityWhen, type CrmActivity, type CrmCompany, type CrmContact, type CrmNote, type CrmTask } from '@/data/crm'

export function CompanyDetail({
  company,
  contacts,
  activities,
  notes,
  tasks,
  noteOpen,
  onNote,
  onSaveNote,
}: {
  company: CrmCompany
  contacts: CrmContact[]
  activities: CrmActivity[]
  notes: CrmNote[]
  tasks: CrmTask[]
  noteOpen: boolean
  onNote: () => void
  onSaveNote: (body: string) => void
}) {
  const openTasks = tasks.filter((task) => !task.done)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-copy sm:text-4xl">{company.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{company.industry}</span>
          <CompanyStatusBadge status={company.status} />
          <span>{company.owner}</span>
        </div>
      </div>
      <dl className="grid border border-stroke bg-surface-raised sm:grid-cols-2 lg:grid-cols-3">
        {(
          [
            ['Website', company.website],
            ['Phone', company.phone || '—'],
            ['Location', company.location || '—'],
            ['Owner', company.owner],
            ['Status', company.status],
            ['Last activity', formatActivityWhen(company.lastActivityAt)],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="border-b border-stroke px-4 py-3">
            <dt className="type-kicker text-muted">{label}</dt>
            <dd className="mt-1 text-sm text-copy">
              {label === 'Website' && company.website ? (
                <a href={company.website} className="text-copy no-underline hover:text-ember">
                  {value.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CRMStatCard label="Contacts" value={String(company.contactCount)} hint="People recorded against this company." />
        <CRMStatCard label="Open opportunities" value={String(company.openOpportunities)} hint="Deals still open on this account." />
        <CRMStatCard label="Activities" value={String(activities.length)} hint="Events logged for this company." />
        <CRMStatCard label="Tasks" value={String(openTasks.length)} hint="Open follow-ups on this company." />
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <section className="border border-stroke bg-surface-raised">
          <div className="border-b border-stroke px-4 py-3">
            <h2 className="font-display text-lg text-copy">Associated contacts</h2>
          </div>
          {contacts.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No contacts in the working set.</p> : null}
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                <Link to={`/app/crm/contacts/${contact.id}`} className="font-medium text-copy no-underline hover:text-ember">
                  {contactName(contact)}
                </Link>
                <p className="text-sm text-muted">{contact.title || 'No title'}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-stroke bg-surface-raised">
          <div className="border-b border-stroke px-4 py-3">
            <h2 className="font-display text-lg text-copy">Recent activity</h2>
          </div>
          <div className="px-4">
            <ContactActivityTimeline items={activities.slice(0, 8)} />
          </div>
        </section>
      </div>
      <section className="border border-stroke bg-surface-raised">
        <div className="border-b border-stroke px-4 py-3">
          <h2 className="font-display text-lg text-copy">Open tasks</h2>
        </div>
        {openTasks.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No tasks on this company.</p> : null}
        <ul>
          {openTasks.map((task) => (
            <li key={task.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stroke px-4 py-3 last:border-b-0">
              <div>
                <p className="text-sm text-copy">{task.title}</p>
                <p className="text-sm text-muted">{task.assignee}</p>
              </div>
              <p className="text-xs text-muted">{task.priority}</p>
            </li>
          ))}
        </ul>
      </section>
      <ContactNotes notes={notes} open={noteOpen} onOpen={onNote} onSave={onSaveNote} />
    </div>
  )
}

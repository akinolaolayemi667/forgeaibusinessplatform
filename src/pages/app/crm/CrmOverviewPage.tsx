import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContactForm } from '@/components/crm/book/ContactForm'
import { ContactImport } from '@/components/crm/book/ContactImport'
import { ContactStatus } from '@/components/crm/book/ContactStatus'
import { CRMHeader } from '@/components/crm/book/CRMHeader'
import { CRMStatCard } from '@/components/crm/book/CRMStatCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { contactName, formatActivityWhen, formatDue } from '@/data/crm'
import { useCrm } from '@/hooks/useCrm'

export function CrmOverviewPage() {
  const { book, contacts, companies, activities, tasks, companyName, addContact } = useCrm()
  const [adding, setAdding] = useState(false)

  const recent = useMemo(
    () => [...contacts].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt)).slice(0, 8),
    [contacts],
  )
  const feed = useMemo(() => [...activities].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6), [activities])
  const due = useMemo(
    () => tasks.filter((task) => !task.done).sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 5),
    [tasks],
  )

  return (
    <div className="flex flex-col gap-8">
      <CRMHeader
        eyebrow="CRM"
        title="Customer relationships, organized."
        description="Manage contacts, companies, activity, and follow-ups from one operational workspace."
        actions={
          <>
            <ContactImport label="Import Contacts" />
            <Button onClick={() => setAdding(true)}>+ Add Contact</Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CRMStatCard label="Total contacts" value={book.contacts.toLocaleString('en-US')} hint="Working book plus records added in this session." />
        <CRMStatCard label="Active leads" value={book.activeLeads.toLocaleString('en-US')} hint="New, contacted, qualified, and active relationships." />
        <CRMStatCard label="Companies" value={book.companies.toLocaleString('en-US')} hint="Organizations in the customer book." />
        <CRMStatCard label="Follow-ups due" value={book.followUps.toLocaleString('en-US')} hint="Open tasks across the book." />
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="border border-stroke bg-surface-raised">
          <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
            <h2 className="font-display text-lg text-copy">Recent contacts</h2>
            <Link to="/app/crm/contacts" className="text-sm text-copy no-underline hover:text-ember">
              View all contacts
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stroke">
                  {['Name', 'Company', 'Role', 'Status', 'Owner', 'Last activity'].map((label) => (
                    <th key={label} className="px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((contact) => (
                  <tr key={contact.id} className="border-b border-stroke last:border-b-0">
                    <td className="px-3 py-3">
                      <Link to={`/app/crm/contacts/${contact.id}`} className="font-medium text-copy no-underline hover:text-ember">
                        {contactName(contact)}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted">{companyName(contact.companyId)}</td>
                    <td className="hidden px-3 py-3 text-sm text-muted md:table-cell">{contact.title || '—'}</td>
                    <td className="px-3 py-3">
                      <ContactStatus status={contact.status} />
                    </td>
                    <td className="hidden px-3 py-3 text-sm text-muted sm:table-cell">{contact.owner}</td>
                    <td className="px-3 py-3 text-sm text-muted">{formatActivityWhen(contact.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="border border-stroke bg-surface-raised">
          <div className="border-b border-stroke px-4 py-3">
            <h2 className="font-display text-lg text-copy">Activity</h2>
          </div>
          <ul>
            {feed.map((item) => (
              <li key={item.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                <p className="text-sm text-copy">{item.title}</p>
                <p className="mt-1 text-xs text-muted">{formatActivityWhen(item.at)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="border border-stroke bg-surface-raised">
        <div className="border-b border-stroke px-4 py-3">
          <h2 className="font-display text-lg text-copy">Follow-ups due</h2>
        </div>
        {due.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No tasks waiting.</p> : null}
        <ul>
          {due.map((task) => {
            const contact = contacts.find((item) => item.id === task.contactId)
            const company = companies.find((item) => item.id === (task.companyId || contact?.companyId))
            return (
              <li key={task.id} className="grid gap-2 border-b border-stroke px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <p className="text-sm text-copy">{contact ? contactName(contact) : company?.name ?? 'Workspace'}</p>
                  <p className="text-sm text-muted">{company?.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-copy">{task.title}</p>
                  <p className="text-xs text-muted">
                    {formatDue(task.dueAt)} · {task.assignee}
                  </p>
                </div>
                {contact ? (
                  <Link to={`/app/crm/contacts/${contact.id}`} className="text-sm text-copy no-underline hover:text-ember">
                    Open
                  </Link>
                ) : company ? (
                  <Link to={`/app/crm/companies/${company.id}`} className="text-sm text-copy no-underline hover:text-ember">
                    Open
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>
      <Modal open={adding} title="Add contact" description="Create a contact in this workspace." onClose={() => setAdding(false)}>
        <ContactForm
          companies={companies}
          submitLabel="Create contact"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            addContact(draft)
            setAdding(false)
          }}
        />
      </Modal>
    </div>
  )
}

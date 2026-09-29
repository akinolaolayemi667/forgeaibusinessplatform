import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { ContactStatus } from '@/components/crm/book/ContactStatus'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { contactName, crmOwners, crmStatuses, formatActivityWhen, type CrmContact, type CrmStatus } from '@/data/crm'

export function ContactRow({
  contact,
  company,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onStatus,
  onAssign,
}: {
  contact: CrmContact
  company: string
  selected: boolean
  onToggle: () => void
  onOpen: () => void
  onEdit: () => void
  onStatus: (status: CrmStatus) => void
  onAssign: (owner: string) => void
}) {
  const name = contactName(contact)
  const menu = [
    { id: 'open', label: 'Open record', onSelect: onOpen },
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    ...crmStatuses.map((status) => ({ id: `status-${status}`, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...crmOwners.map((owner) => ({ id: `owner-${owner}`, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
  ]

  return (
    <tr
      className={cn('cursor-pointer border-b border-stroke last:border-b-0 hover:bg-wash', selected && 'bg-wash')}
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('a, button, input, label')) return
        onOpen()
      }}
    >
      <td className="px-3 py-3">
        <input
          type="checkbox"
          checked={selected}
          aria-label={`Select ${name}`}
          className="size-4 accent-ember"
          onChange={onToggle}
          onClick={(event) => event.stopPropagation()}
        />
      </td>
      <td className="px-3 py-3">
        <Link to={`/app/crm/contacts/${contact.id}`} className="font-medium text-copy no-underline hover:text-ember" onClick={(event) => event.stopPropagation()}>
          {name}
        </Link>
      </td>
      <td className="px-3 py-3 text-sm text-copy">{company}</td>
      <td className="hidden px-3 py-3 text-sm text-muted md:table-cell">{contact.title || '—'}</td>
      <td className="hidden px-3 py-3 text-sm text-muted lg:table-cell">{contact.email}</td>
      <td className="hidden px-3 py-3 text-sm text-muted xl:table-cell">{contact.phone || '—'}</td>
      <td className="px-3 py-3">
        <ContactStatus status={contact.status} />
      </td>
      <td className="hidden px-3 py-3 text-sm text-muted sm:table-cell">{contact.owner}</td>
      <td className="px-3 py-3 text-sm text-muted">{formatActivityWhen(contact.lastActivityAt)}</td>
      <td className="px-3 py-3 text-right">
        <RowMenu label={`Actions for ${name}`} items={menu} />
      </td>
    </tr>
  )
}

export function ContactCard({
  contact,
  company,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onStatus,
  onAssign,
}: {
  contact: CrmContact
  company: string
  selected: boolean
  onToggle: () => void
  onOpen: () => void
  onEdit: () => void
  onStatus: (status: CrmStatus) => void
  onAssign: (owner: string) => void
}) {
  const name = contactName(contact)
  const menu = [
    { id: 'open', label: 'Open record', onSelect: onOpen },
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    ...crmStatuses.map((status) => ({ id: `status-${status}`, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...crmOwners.map((owner) => ({ id: `owner-${owner}`, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
  ]
  return (
    <article className={cn('border border-stroke bg-surface-raised p-4', selected && 'border-ember')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button type="button" className="cursor-pointer text-left font-medium text-copy" onClick={onOpen}>
            {name}
          </button>
          <p className="text-sm text-muted">
            {contact.title ? `${contact.title} · ` : ''}
            {company}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <input type="checkbox" checked={selected} aria-label={`Select ${name}`} className="size-4 accent-ember" onChange={onToggle} />
          <RowMenu label={`Actions for ${name}`} items={menu} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ContactStatus status={contact.status} />
        <span className="text-xs text-muted">{contact.owner}</span>
        <span className="text-xs text-muted">{formatActivityWhen(contact.lastActivityAt)}</span>
      </div>
    </article>
  )
}

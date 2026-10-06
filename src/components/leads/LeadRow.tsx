import { Link } from 'react-router-dom'
import { LeadScore } from '@/components/leads/LeadScore'
import { LeadStatusBadge } from '@/components/leads/LeadStatus'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { formatActivityWhen, formatDue } from '@/data/crm/time'
import { leadName, leadOwners, leadStatuses, type LeadStatus, type SalesLead } from '@/data/leads'
import { cn } from '@/lib/cn'

export function LeadRow({
  lead,
  followUp,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onQualify,
  onConvert,
  onStatus,
  onAssign,
}: {
  lead: SalesLead
  followUp: string | null
  selected: boolean
  onToggle: () => void
  onOpen: () => void
  onEdit: () => void
  onQualify: () => void
  onConvert: () => void
  onStatus: (status: LeadStatus) => void
  onAssign: (owner: string) => void
}) {
  const name = leadName(lead)
  const menu = [
    { id: 'open', label: 'Open record', onSelect: onOpen },
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    { id: 'qualify', label: 'Qualify', onSelect: onQualify },
    { id: 'convert', label: 'Convert', onSelect: onConvert },
    ...leadStatuses.map((status) => ({ id: `status-${status}`, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...leadOwners.map((owner) => ({ id: `owner-${owner}`, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
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
        <input type="checkbox" checked={selected} aria-label={`Select ${name}`} className="size-4 accent-ember" onChange={onToggle} onClick={(event) => event.stopPropagation()} />
      </td>
      <td className="px-3 py-3">
        <Link to={`/app/leads/${lead.id}`} className="font-medium text-copy no-underline hover:text-ember" onClick={(event) => event.stopPropagation()}>
          {name}
        </Link>
      </td>
      <td className="px-3 py-3 text-sm text-copy">{lead.company}</td>
      <td className="px-3 py-3">
        <LeadScore score={lead.score} />
      </td>
      <td className="px-3 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>
      <td className="hidden px-3 py-3 text-sm text-muted md:table-cell">{lead.source}</td>
      <td className="hidden px-3 py-3 text-sm text-muted sm:table-cell">{lead.owner}</td>
      <td className="px-3 py-3 text-sm text-muted">{formatActivityWhen(lead.lastActivityAt)}</td>
      <td className="hidden px-3 py-3 text-sm text-muted lg:table-cell">{followUp ? formatDue(followUp) : '—'}</td>
      <td className="px-3 py-3 text-right">
        <RowMenu label={`Actions for ${name}`} items={menu} />
      </td>
    </tr>
  )
}

export function LeadCard({
  lead,
  followUp,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onQualify,
  onConvert,
  onStatus,
  onAssign,
}: {
  lead: SalesLead
  followUp: string | null
  selected: boolean
  onToggle: () => void
  onOpen: () => void
  onEdit: () => void
  onQualify: () => void
  onConvert: () => void
  onStatus: (status: LeadStatus) => void
  onAssign: (owner: string) => void
}) {
  const name = leadName(lead)
  const menu = [
    { id: 'open', label: 'Open record', onSelect: onOpen },
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    { id: 'qualify', label: 'Qualify', onSelect: onQualify },
    { id: 'convert', label: 'Convert', onSelect: onConvert },
    ...leadStatuses.map((status) => ({ id: `status-${status}`, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...leadOwners.map((owner) => ({ id: `owner-${owner}`, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
  ]
  return (
    <article className={cn('border border-stroke bg-surface-raised p-4', selected && 'border-ember')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" className="cursor-pointer text-left font-medium text-copy" onClick={onOpen}>
            {name}
          </button>
          <p className="text-sm text-muted">{lead.company}</p>
        </div>
        <div className="flex items-center gap-1">
          <input type="checkbox" checked={selected} aria-label={`Select ${name}`} className="size-4 accent-ember" onChange={onToggle} />
          <RowMenu label={`Actions for ${name}`} items={menu} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LeadScore score={lead.score} />
        <LeadStatusBadge status={lead.status} />
        <span className="text-xs text-muted">{lead.source}</span>
        <span className="text-xs text-muted">{formatActivityWhen(lead.lastActivityAt)}</span>
        <span className="text-xs text-muted">{followUp ? formatDue(followUp) : 'No follow-up'}</span>
      </div>
    </article>
  )
}

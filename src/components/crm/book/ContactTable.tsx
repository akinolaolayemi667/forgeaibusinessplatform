import { useEffect, useRef } from 'react'
import { ContactCard, ContactRow } from '@/components/crm/book/ContactRow'
import { CRMEmptyState } from '@/components/crm/book/CRMEmptyState'
import { Button } from '@/components/ui/Button'
import { FieldSelect } from '@/components/crm/book/fields'
import { crmOwners, crmStatuses, type CrmContact, type CrmStatus } from '@/data/crm'

export function ContactTable({
  rows,
  page,
  pageCount,
  total,
  companyName,
  selected,
  onToggle,
  onTogglePage,
  onClearSelection,
  onPage,
  onOpen,
  onEdit,
  onStatus,
  onAssign,
  onClearFilters,
  filteredEmpty,
}: {
  rows: CrmContact[]
  page: number
  pageCount: number
  total: number
  companyName: (id: string) => string
  selected: string[]
  onToggle: (id: string) => void
  onTogglePage: (checked: boolean) => void
  onClearSelection: () => void
  onPage: (page: number) => void
  onOpen: (id: string) => void
  onEdit: (contact: CrmContact) => void
  onStatus: (ids: string[], status: CrmStatus) => void
  onAssign: (ids: string[], owner: string) => void
  onClearFilters?: () => void
  filteredEmpty: boolean
}) {
  const allRef = useRef<HTMLInputElement>(null)
  const pageIds = rows.map((row) => row.id)
  const selectedOnPage = pageIds.filter((id) => selected.includes(id))
  const allChecked = pageIds.length > 0 && selectedOnPage.length === pageIds.length
  const partial = selectedOnPage.length > 0 && !allChecked

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = partial
  }, [partial])

  if (total === 0) {
    return (
      <CRMEmptyState
        title={filteredEmpty ? 'No contacts found' : 'No contacts yet'}
        description={filteredEmpty ? 'Try adjusting your search or filters.' : 'Add the first contact to this workspace.'}
        action={
          filteredEmpty && onClearFilters ? (
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    )
  }

  const from = (page - 1) * 8 + 1
  const to = (page - 1) * 8 + rows.length

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 ? (
        <div className="flex flex-col gap-3 border border-stroke bg-surface-raised px-3 py-3 sm:flex-row sm:items-center">
          <p className="text-sm text-copy">{selected.length} selected</p>
          <div className="flex flex-1 flex-wrap gap-2">
            <FieldSelect id="bulk-status" label="Change status" hideLabel value="" onChange={(value) => value && onStatus(selected, value as CrmStatus)}>
              <option value="">Change status</option>
              {crmStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect id="bulk-owner" label="Assign owner" hideLabel value="" onChange={(value) => value && onAssign(selected, value)}>
              <option value="">Assign owner</option>
              {crmOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </FieldSelect>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear selection
          </Button>
        </div>
      ) : null}
      <div className="hidden overflow-x-auto border border-stroke bg-surface-raised md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stroke">
              <th className="w-10 px-3 py-2">
                <input
                  ref={allRef}
                  type="checkbox"
                  checked={allChecked}
                  aria-label="Select all contacts on this page"
                  className="size-4 accent-ember"
                  onChange={(event) => onTogglePage(event.target.checked)}
                />
              </th>
              {['Name', 'Company', 'Role', 'Email', 'Phone', 'Status', 'Owner', 'Last activity', ''].map((label) => (
                <th
                  key={label || 'actions'}
                  className={
                    label === 'Role'
                      ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase md:table-cell'
                      : label === 'Email'
                        ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase lg:table-cell'
                        : label === 'Phone'
                          ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase xl:table-cell'
                          : label === 'Owner'
                            ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase sm:table-cell'
                            : 'px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase'
                  }
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                company={companyName(contact.companyId)}
                selected={selected.includes(contact.id)}
                onToggle={() => onToggle(contact.id)}
                onOpen={() => onOpen(contact.id)}
                onEdit={() => onEdit(contact)}
                onStatus={(status) => onStatus([contact.id], status)}
                onAssign={(owner) => onAssign([contact.id], owner)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((contact) => (
          <li key={contact.id}>
            <ContactCard
              contact={contact}
              company={companyName(contact.companyId)}
              selected={selected.includes(contact.id)}
              onToggle={() => onToggle(contact.id)}
              onOpen={() => onOpen(contact.id)}
              onEdit={() => onEdit(contact)}
              onStatus={(status) => onStatus([contact.id], status)}
              onAssign={(owner) => onAssign([contact.id], owner)}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <p>
          {from}–{to} of {total}
        </p>
        {pageCount > 1 ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { LeadBulkActions } from '@/components/leads/LeadBulkActions'
import { LeadCard, LeadRow } from '@/components/leads/LeadRow'
import { LeadEmptyState } from '@/components/leads/LeadEmptyState'
import { Button } from '@/components/ui/Button'
import type { LeadStatus, SalesLead } from '@/data/leads'

export function LeadTable({
  rows,
  page,
  pageCount,
  total,
  selected,
  followUp,
  filteredEmpty,
  onToggle,
  onTogglePage,
  onClearSelection,
  onPage,
  onOpen,
  onEdit,
  onQualify,
  onConvert,
  onStatus,
  onAssign,
  onTag,
  onQualifySelected,
  onClearFilters,
}: {
  rows: SalesLead[]
  page: number
  pageCount: number
  total: number
  selected: string[]
  followUp: (id: string) => string | null
  filteredEmpty: boolean
  onToggle: (id: string) => void
  onTogglePage: (checked: boolean) => void
  onClearSelection: () => void
  onPage: (page: number) => void
  onOpen: (id: string) => void
  onEdit: (lead: SalesLead) => void
  onQualify: (id: string) => void
  onConvert: (id: string) => void
  onStatus: (ids: string[], status: LeadStatus) => void
  onAssign: (ids: string[], owner: string) => void
  onTag: () => void
  onQualifySelected: () => void
  onClearFilters?: () => void
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
      <LeadEmptyState
        title={filteredEmpty ? 'No leads found' : 'No leads yet'}
        description={filteredEmpty ? 'Try adjusting your search or filters.' : 'Add the first lead to this workspace.'}
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
      <LeadBulkActions
        count={selected.length}
        onStatus={(status) => onStatus(selected, status)}
        onAssign={(owner) => onAssign(selected, owner)}
        onTag={onTag}
        onQualify={onQualifySelected}
        onClear={onClearSelection}
      />
      <div className="hidden overflow-x-auto border border-stroke bg-surface-raised md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stroke">
              <th className="w-10 px-3 py-2">
                <input
                  ref={allRef}
                  type="checkbox"
                  checked={allChecked}
                  aria-label="Select all leads on this page"
                  className="size-4 accent-ember"
                  onChange={(event) => onTogglePage(event.target.checked)}
                />
              </th>
              {['Lead', 'Company', 'Score', 'Status', 'Source', 'Owner', 'Last activity', 'Next follow-up', ''].map((label) => (
                <th
                  key={label || 'actions'}
                  className={
                    label === 'Source'
                      ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase md:table-cell'
                      : label === 'Owner'
                        ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase sm:table-cell'
                        : label === 'Next follow-up'
                          ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase lg:table-cell'
                          : 'px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase'
                  }
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                followUp={followUp(lead.id)}
                selected={selected.includes(lead.id)}
                onToggle={() => onToggle(lead.id)}
                onOpen={() => onOpen(lead.id)}
                onEdit={() => onEdit(lead)}
                onQualify={() => onQualify(lead.id)}
                onConvert={() => onConvert(lead.id)}
                onStatus={(status) => onStatus([lead.id], status)}
                onAssign={(owner) => onAssign([lead.id], owner)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((lead) => (
          <li key={lead.id}>
            <LeadCard
              lead={lead}
              followUp={followUp(lead.id)}
              selected={selected.includes(lead.id)}
              onToggle={() => onToggle(lead.id)}
              onOpen={() => onOpen(lead.id)}
              onEdit={() => onEdit(lead)}
              onQualify={() => onQualify(lead.id)}
              onConvert={() => onConvert(lead.id)}
              onStatus={(status) => onStatus([lead.id], status)}
              onAssign={(owner) => onAssign([lead.id], owner)}
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

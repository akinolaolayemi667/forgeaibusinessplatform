import { useEffect, useRef } from 'react'
import { OpportunityBulkActions } from '@/components/pipeline/OpportunityBulkActions'
import { OpportunityListCard, OpportunityRow } from '@/components/pipeline/OpportunityRow'
import { PipelineEmptyState } from '@/components/pipeline/PipelineEmptyState'
import { Button } from '@/components/ui/Button'
import type { Opportunity, OpportunityPriority, PipelineStageId } from '@/data/pipeline'

const pageSize = 8

export function OpportunityList({
  rows,
  page,
  total,
  selected,
  filteredEmpty,
  onToggle,
  onTogglePage,
  onClearSelection,
  onPage,
  onOpen,
  onEdit,
  onStage,
  onWon,
  onLost,
  onRestore,
  onAssign,
  onPriority,
  onClearFilters,
}: {
  rows: Opportunity[]
  page: number
  total: number
  selected: string[]
  filteredEmpty: boolean
  onToggle: (id: string) => void
  onTogglePage: (checked: boolean, ids: string[]) => void
  onClearSelection: () => void
  onPage: (page: number) => void
  onOpen: (id: string) => void
  onEdit: (opportunity: Opportunity) => void
  onStage: (ids: string[], stageId: PipelineStageId) => void
  onWon: (opportunity: Opportunity) => void
  onLost: (opportunity: Opportunity) => void
  onRestore: (id: string) => void
  onAssign: (ids: string[], ownerId: string) => void
  onPriority: (priority: OpportunityPriority) => void
  onClearFilters?: () => void
}) {
  const allRef = useRef<HTMLInputElement>(null)
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const visible = rows.slice(start, start + pageSize)
  const pageIds = visible.map((row) => row.id)
  const selectedOnPage = pageIds.filter((id) => selected.includes(id))
  const allChecked = pageIds.length > 0 && selectedOnPage.length === pageIds.length
  const partial = selectedOnPage.length > 0 && !allChecked

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = partial
  }, [partial])

  if (total === 0) {
    return (
      <PipelineEmptyState
        title={filteredEmpty ? 'No opportunities found' : 'No opportunities'}
        description={filteredEmpty ? 'Try adjusting your search or filters.' : 'Create the first opportunity to start the pipeline.'}
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

  const from = start + 1
  const to = start + visible.length

  return (
    <div className="flex flex-col gap-3">
      <OpportunityBulkActions
        count={selected.length}
        onStage={(stageId) => onStage(selected, stageId)}
        onAssign={(ownerId) => onAssign(selected, ownerId)}
        onPriority={onPriority}
        onClear={onClearSelection}
      />
      <div className="hidden overflow-x-auto border border-stroke md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Opportunities</caption>
          <thead className="border-b border-stroke bg-surface-raised text-xs text-muted">
            <tr>
              <th className="px-3 py-2">
                <input
                  ref={allRef}
                  type="checkbox"
                  checked={allChecked}
                  aria-label="Select all opportunities on this page"
                  className="size-4 accent-ember"
                  onChange={(event) => onTogglePage(event.target.checked, pageIds)}
                />
              </th>
              <th className="px-3 py-2 font-medium">Opportunity</th>
              <th className="hidden px-3 py-2 font-medium md:table-cell">Company</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Probability</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Owner</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Close date</th>
              <th className="hidden px-3 py-2 font-medium lg:table-cell">Priority</th>
              <th className="hidden px-3 py-2 font-medium xl:table-cell">Last activity</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((opportunity) => (
              <OpportunityRow
                key={opportunity.id}
                opportunity={opportunity}
                selected={selected.includes(opportunity.id)}
                onToggle={() => onToggle(opportunity.id)}
                onOpen={() => onOpen(opportunity.id)}
                onEdit={() => onEdit(opportunity)}
                onStage={(stageId) => onStage([opportunity.id], stageId)}
                onWon={() => onWon(opportunity)}
                onLost={() => onLost(opportunity)}
                onRestore={() => onRestore(opportunity.id)}
                onAssign={(ownerId) => onAssign([opportunity.id], ownerId)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-2 md:hidden">
        {visible.map((opportunity) => (
          <li key={opportunity.id}>
            <OpportunityListCard
              opportunity={opportunity}
              selected={selected.includes(opportunity.id)}
              onToggle={() => onToggle(opportunity.id)}
              onOpen={() => onOpen(opportunity.id)}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <p>
          {from}–{to} of {total}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

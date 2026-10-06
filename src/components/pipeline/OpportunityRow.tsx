import { Link } from 'react-router-dom'
import { OpportunityProbability } from '@/components/pipeline/OpportunityProbability'
import { PipelineStageBadge } from '@/components/pipeline/PipelineStageBadge'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { formatActivityWhen } from '@/data/crm/time'
import { formatCurrency, formatDate } from '@/utils/format'
import { cn } from '@/lib/cn'
import { pipelineOwners, pipelineStageOrder, stageCatalog, type Opportunity, type PipelineStageId } from '@/data/pipeline'

export function OpportunityRow({
  opportunity,
  selected,
  onToggle,
  onOpen,
  onEdit,
  onStage,
  onWon,
  onLost,
  onRestore,
  onAssign,
}: {
  opportunity: Opportunity
  selected: boolean
  onToggle: () => void
  onOpen: () => void
  onEdit: () => void
  onStage: (stageId: PipelineStageId) => void
  onWon: () => void
  onLost: () => void
  onRestore: () => void
  onAssign: (ownerId: string) => void
}) {
  const menu = [
    { id: 'open', label: 'Open record', onSelect: onOpen },
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    { id: 'won', label: 'Mark won', onSelect: onWon },
    { id: 'lost', label: 'Mark lost', onSelect: onLost },
    ...(opportunity.stageId === 'lost' ? [{ id: 'restore', label: 'Restore opportunity', onSelect: onRestore }] : []),
    ...pipelineStageOrder.filter((stage) => stage !== 'won' && stage !== 'lost').map((stage) => ({
      id: `stage-${stage}`,
      label: `Move to ${stageCatalog[stage].name}`,
      onSelect: () => onStage(stage),
    })),
    ...pipelineOwners.map((owner) => ({ id: `owner-${owner.id}`, label: `Assign ${owner.name}`, onSelect: () => onAssign(owner.id) })),
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
          aria-label={`Select ${opportunity.name}`}
          className="size-4 accent-ember"
          onChange={onToggle}
          onClick={(event) => event.stopPropagation()}
        />
      </td>
      <td className="px-3 py-3">
        <Link to={`/app/pipeline/${opportunity.id}`} className="font-medium text-copy no-underline hover:text-ember" onClick={(event) => event.stopPropagation()}>
          {opportunity.name}
        </Link>
        <p className="mt-1 text-xs text-muted md:hidden">{opportunity.company}</p>
      </td>
      <td className="hidden px-3 py-3 text-sm text-copy md:table-cell">{opportunity.company}</td>
      <td className="px-3 py-3">
        <PipelineStageBadge stageId={opportunity.stageId} />
      </td>
      <td className="px-3 py-3 text-sm text-copy">{formatCurrency(opportunity.value)}</td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <OpportunityProbability probability={opportunity.probability} />
      </td>
      <td className="hidden px-3 py-3 text-sm text-muted lg:table-cell">{opportunity.owner}</td>
      <td className="hidden px-3 py-3 text-sm text-muted xl:table-cell">{formatDate(opportunity.expectedCloseDate)}</td>
      <td className="hidden px-3 py-3 text-sm text-muted lg:table-cell">{opportunity.priority}</td>
      <td className="hidden px-3 py-3 text-sm text-muted xl:table-cell">{formatActivityWhen(opportunity.lastActivityAt)}</td>
      <td className="px-3 py-3 text-right">
        <RowMenu label={`Actions for ${opportunity.name}`} items={menu} />
      </td>
    </tr>
  )
}

export function OpportunityListCard({
  opportunity,
  selected,
  onToggle,
  onOpen,
}: {
  opportunity: Opportunity
  selected: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  return (
    <article className={cn('border border-stroke bg-surface-raised p-3', selected && 'border-ember')}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} aria-label={`Select ${opportunity.name}`} className="mt-1 size-4 accent-ember" onChange={onToggle} />
        <button type="button" className="min-w-0 flex-1 cursor-pointer text-left" onClick={onOpen}>
          <p className="font-medium text-copy">{opportunity.name}</p>
          <p className="mt-1 text-sm text-muted">{opportunity.company}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PipelineStageBadge stageId={opportunity.stageId} />
            <span className="type-data text-sm text-copy">{formatCurrency(opportunity.value)}</span>
            <span className="type-data text-sm text-muted">{opportunity.probability}%</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {opportunity.owner} · {formatDate(opportunity.expectedCloseDate)} · {opportunity.priority}
          </p>
        </button>
      </div>
    </article>
  )
}

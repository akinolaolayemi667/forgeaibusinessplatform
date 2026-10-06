import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { OpportunityProbability } from '@/components/pipeline/OpportunityProbability'
import { OpportunityStageControl } from '@/components/pipeline/OpportunityStageControl'
import { OpportunityValue } from '@/components/pipeline/OpportunityValue'
import { formatDate } from '@/utils/format'
import { cn } from '@/lib/cn'
import type { Opportunity, PipelineStageId } from '@/data/pipeline'

export function OpportunityCard({
  opportunity,
  dragging,
  updated,
  onOpen,
  onStage,
  onDragStart,
  onDragEnd,
}: {
  opportunity: Opportunity
  dragging: boolean
  updated: boolean
  onOpen: () => void
  onStage: (stageId: PipelineStageId) => void
  onDragStart: (event: DragEvent<HTMLElement>) => void
  onDragEnd: () => void
}) {
  const priorityClass =
    opportunity.priority === 'High' ? 'text-ember' : opportunity.priority === 'Medium' ? 'text-stone' : 'text-muted'

  return (
    <article
      draggable
      aria-grabbed={dragging}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('a, button, input, select, label')) return
        onOpen()
      }}
      className={cn(
        'cursor-grab border border-stroke bg-surface px-3 py-3 motion-reduce:transition-none active:cursor-grabbing',
        dragging && 'opacity-50',
        updated && 'border-ember',
        !dragging && 'hover:border-stone',
      )}
    >
      <p className="type-kicker text-muted">{opportunity.company}</p>
      <Link to={`/app/pipeline/${opportunity.id}`} className="mt-1 block font-medium text-copy no-underline hover:text-ember" onClick={(event) => event.stopPropagation()}>
        {opportunity.name}
      </Link>
      <p className="mt-1 text-sm text-muted">{opportunity.contact || 'No primary contact'}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <OpportunityValue value={opportunity.value} />
        <OpportunityProbability probability={opportunity.probability} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
        <div>
          <dt className="type-kicker">Owner</dt>
          <dd className="mt-1 text-copy">{opportunity.owner}</dd>
        </div>
        <div>
          <dt className="type-kicker">Close</dt>
          <dd className="mt-1 text-copy">{formatDate(opportunity.expectedCloseDate)}</dd>
        </div>
      </dl>
      <p className={cn('type-kicker mt-3', priorityClass)}>{opportunity.priority} priority</p>
      <div className="mt-3" onClick={(event) => event.stopPropagation()}>
        <OpportunityStageControl id={`card-stage-${opportunity.id}`} stageId={opportunity.stageId} hideLabel onChange={onStage} />
      </div>
    </article>
  )
}

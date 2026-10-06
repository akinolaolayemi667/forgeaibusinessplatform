import { useState, type DragEvent } from 'react'
import { OpportunityCard } from '@/components/pipeline/OpportunityCard'
import { PipelineColumn } from '@/components/pipeline/PipelineColumn'
import { cn } from '@/lib/cn'
import { openStageOrder, stageCatalog, type Opportunity, type PipelineStageId } from '@/data/pipeline'

export function PipelineBoard({
  opportunities,
  showClosed,
  updatedId,
  onOpen,
  onMove,
  onRequestWon,
  onRequestLost,
}: {
  opportunities: Opportunity[]
  showClosed: boolean
  updatedId: string | null
  onOpen: (id: string) => void
  onMove: (id: string, stageId: PipelineStageId) => void
  onRequestWon: (opportunity: Opportunity) => void
  onRequestLost: (opportunity: Opportunity) => void
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<PipelineStageId | null>(null)
  const [mobileStage, setMobileStage] = useState<PipelineStageId>('discovery')

  const stages = [...openStageOrder, ...(showClosed ? (['won', 'lost'] as const) : [])]
  const activeMobile = stages.includes(mobileStage) ? mobileStage : stages[0]

  function itemsFor(stageId: PipelineStageId) {
    return opportunities.filter((item) => item.stageId === stageId)
  }

  function beginDrag(event: DragEvent<HTMLElement>, id: string) {
    const target = event.target as HTMLElement
    if (target.closest('a, button, input, select, label')) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }

  function finishDrag() {
    setDraggingId(null)
    setOverStage(null)
  }

  function dropOn(event: DragEvent<HTMLElement>, stageId: PipelineStageId) {
    event.preventDefault()
    const id = draggingId || event.dataTransfer.getData('text/plain')
    finishDrag()
    if (!id) return
    const opportunity = opportunities.find((item) => item.id === id)
    if (!opportunity || opportunity.stageId === stageId) return
    if (stageId === 'won') {
      onRequestWon(opportunity)
      return
    }
    if (stageId === 'lost') {
      onRequestLost(opportunity)
      return
    }
    onMove(id, stageId)
  }

  function changeStage(opportunity: Opportunity, stageId: PipelineStageId) {
    if (opportunity.stageId === stageId) return
    if (stageId === 'won') {
      onRequestWon(opportunity)
      return
    }
    if (stageId === 'lost') {
      onRequestLost(opportunity)
      return
    }
    onMove(opportunity.id, stageId)
  }

  function column(stageId: PipelineStageId) {
    const items = itemsFor(stageId)
    const value = items.reduce((sum, item) => sum + item.value, 0)
    return (
      <PipelineColumn
        key={stageId}
        stageId={stageId}
        name={stageCatalog[stageId].name}
        count={items.length}
        value={value}
        active={overStage === stageId}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
          setOverStage(stageId)
        }}
        onDrop={(event) => dropOn(event, stageId)}
      >
        {items.length === 0 ? <p className="px-2 py-6 text-sm text-muted">No opportunities in this stage</p> : null}
        {items.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            dragging={draggingId === opportunity.id}
            updated={updatedId === opportunity.id}
            onOpen={() => onOpen(opportunity.id)}
            onStage={(stageIdNext) => changeStage(opportunity, stageIdNext)}
            onDragStart={(event) => beginDrag(event, opportunity.id)}
            onDragEnd={finishDrag}
          />
        ))}
      </PipelineColumn>
    )
  }

  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto md:hidden" role="tablist" aria-label="Pipeline stage">
        {stages.map((stageId) => (
          <button
            key={stageId}
            type="button"
            role="tab"
            aria-selected={activeMobile === stageId}
            className={cn(
              'h-9 shrink-0 cursor-pointer border px-3 text-sm',
              activeMobile === stageId ? 'border-ember bg-ember text-on-accent' : 'border-stroke bg-surface text-copy',
            )}
            onClick={() => setMobileStage(stageId)}
          >
            {stageCatalog[stageId].name}
          </button>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {stages.map((stageId) => (
          <div key={stageId} className={cn('w-full shrink-0 md:w-72', stageId !== activeMobile && 'hidden md:block')}>
            {column(stageId)}
          </div>
        ))}
      </div>
      <p className="sr-only">Use the stage menu on a card to move an opportunity without dragging.</p>
    </div>
  )
}

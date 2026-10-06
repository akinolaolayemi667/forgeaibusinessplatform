import type { DragEvent, ReactNode } from 'react'
import { formatCompactMoney } from '@/utils/format'
import { cn } from '@/lib/cn'
import type { PipelineStageId } from '@/data/pipeline'

export function PipelineColumn({
  stageId,
  name,
  count,
  value,
  active,
  children,
  onDragOver,
  onDrop,
}: {
  stageId: PipelineStageId
  name: string
  count: number
  value: number
  active: boolean
  children: ReactNode
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDrop: (event: DragEvent<HTMLElement>) => void
}) {
  return (
    <section
      id={`stage-${stageId}`}
      aria-label={`${name}, ${count} ${count === 1 ? 'opportunity' : 'opportunities'}`}
      className={cn('flex min-h-64 flex-col border bg-surface-raised', active ? 'border-ember' : 'border-stroke')}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <header className="border-b border-stroke px-3 py-3">
        <h2 className="type-kicker text-copy">{name}</h2>
        <p className="mt-1 text-xs text-muted">
          {count} {count === 1 ? 'opportunity' : 'opportunities'}
        </p>
        <p className="type-data mt-1 text-sm text-copy">{formatCompactMoney(value)}</p>
      </header>
      <div className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto p-2">{children}</div>
    </section>
  )
}

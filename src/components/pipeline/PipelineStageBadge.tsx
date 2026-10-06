import { cn } from '@/lib/cn'
import { stageCatalog, type PipelineStageId } from '@/data/pipeline'

export function PipelineStageBadge({ stageId }: { stageId: PipelineStageId }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-1.5 py-0.5 font-mono text-[11px] tracking-[-0.02em]',
        stageId === 'won' && 'border-ember text-ember',
        stageId === 'lost' && 'border-stroke text-muted',
        stageId !== 'won' && stageId !== 'lost' && 'border-stroke text-copy',
      )}
    >
      {stageCatalog[stageId].name}
    </span>
  )
}

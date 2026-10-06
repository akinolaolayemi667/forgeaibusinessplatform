import { cn } from '@/lib/cn'
import { progressStageOrder, stageCatalog, type PipelineStageId } from '@/data/pipeline'

export function OpportunityProgress({ stageId }: { stageId: PipelineStageId }) {
  const currentIndex = progressStageOrder.indexOf(stageId as (typeof progressStageOrder)[number])
  const lost = stageId === 'lost'
  return (
    <section className="border border-stroke bg-surface-raised p-4">
      <h2 className="type-kicker text-muted">Sales progress</h2>
      {lost ? <p className="mt-2 text-sm text-muted">This opportunity is lost. Restore it to return to the open pipeline.</p> : null}
      <ol className="mt-4">
        {progressStageOrder.map((stage, index) => {
          const current = !lost && stage === stageId
          const done = !lost && currentIndex > index
          return (
            <li key={stage} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3">
              <div className="flex flex-col items-center">
                <span className={cn('size-2.5', current ? 'bg-ember' : done ? 'bg-stone' : 'bg-steel')} aria-hidden />
                {index < progressStageOrder.length - 1 ? <span className="w-px flex-1 bg-stroke" aria-hidden /> : null}
              </div>
              <p className={cn('pb-4 text-sm', current ? 'text-ember' : 'text-copy')}>
                {stageCatalog[stage].name}
                {current ? <span className="sr-only">, current stage</span> : null}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

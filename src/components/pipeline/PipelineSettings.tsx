import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { pipelineStageOrder, stageCatalog } from '@/data/pipeline'

export function PipelineSettings({
  open,
  showClosed,
  onShowClosed,
  onClose,
}: {
  open: boolean
  showClosed: boolean
  onShowClosed: (value: boolean) => void
  onClose: () => void
}) {
  return (
    <Modal open={open} title="Pipeline settings" description="Stages used by this workspace." onClose={onClose}>
      <ol className="mb-4 border border-stroke">
        {pipelineStageOrder.map((stage, index) => (
          <li key={stage} className="flex items-center justify-between gap-3 border-b border-stroke px-3 py-2 last:border-b-0">
            <span className="text-sm text-copy">
              <span className="type-data mr-2 text-muted">{String(index + 1).padStart(2, '0')}</span>
              {stageCatalog[stage].name}
            </span>
            <span className="type-kicker text-muted">{stageCatalog[stage].kind}</span>
          </li>
        ))}
      </ol>
      <label className="flex items-center gap-2 text-sm text-copy">
        <input type="checkbox" className="size-4 accent-ember" checked={showClosed} onChange={(event) => onShowClosed(event.target.checked)} />
        Show Won and Lost on the board
      </label>
      <p className="mt-3 text-sm text-muted">Drag a card between open stages, or use the stage menu on each card.</p>
      <div className="mt-4 flex justify-end">
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  )
}

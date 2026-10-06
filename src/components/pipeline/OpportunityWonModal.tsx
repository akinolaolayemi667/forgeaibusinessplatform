import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/utils/format'
import type { Opportunity } from '@/data/pipeline'

export function OpportunityWonModal({
  opportunity,
  open,
  onClose,
  onConfirm,
}: {
  opportunity: Opportunity | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal open={open} title="Mark as won" description="Mark this opportunity as won?" onClose={onClose}>
      {opportunity ? (
        <dl className="mb-4 grid grid-cols-2 gap-3 border border-stroke">
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Opportunity</dt>
            <dd className="mt-1 text-sm text-copy">{opportunity.name}</dd>
          </div>
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Company</dt>
            <dd className="mt-1 text-sm text-copy">{opportunity.company}</dd>
          </div>
          <div className="col-span-2 px-3 py-2">
            <dt className="type-kicker text-muted">Deal value</dt>
            <dd className="type-data mt-1 text-lg text-copy">{formatCurrency(opportunity.value)}</dd>
          </div>
        </dl>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={!opportunity}>
          Mark won
        </Button>
      </div>
    </Modal>
  )
}

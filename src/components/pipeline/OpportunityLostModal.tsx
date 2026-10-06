import { useEffect, useState } from 'react'
import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { lossReasons, type LossReason, type Opportunity } from '@/data/pipeline'

export function OpportunityLostModal({
  opportunity,
  open,
  onClose,
  onConfirm,
}: {
  opportunity: Opportunity | null
  open: boolean
  onClose: () => void
  onConfirm: (reason: LossReason) => void
}) {
  const [reason, setReason] = useState<LossReason>('Budget')

  useEffect(() => {
    if (open) setReason('Budget')
  }, [open])

  return (
    <Modal open={open} title="Mark as lost" description="Record why this opportunity is leaving the open pipeline." onClose={onClose}>
      {opportunity ? (
        <p className="mb-4 text-sm text-copy">
          {opportunity.name}
          <span className="text-muted"> · {opportunity.company}</span>
        </p>
      ) : null}
      <FieldSelect id="loss-reason" label="Loss reason" value={reason} onChange={(value) => setReason(value as LossReason)}>
        {lossReasons.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </FieldSelect>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(reason)} disabled={!opportunity}>
          Mark lost
        </Button>
      </div>
    </Modal>
  )
}

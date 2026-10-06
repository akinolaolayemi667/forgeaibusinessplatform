import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { leadName, type SalesLead } from '@/data/leads'

export function LeadQualificationModal({
  lead,
  count,
  open,
  onClose,
  onConfirm,
}: {
  lead: SalesLead | null
  count: number
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const label = lead ? leadName(lead) : `${count} leads`
  return (
    <Modal open={open} title="Qualify lead" description={`Mark ${label} as Qualified and record the change on the timeline.`} onClose={onClose}>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Qualify</Button>
      </div>
    </Modal>
  )
}

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LeadScore } from '@/components/leads/LeadScore'
import { leadName, type SalesLead } from '@/data/leads'

export function LeadConversionModal({
  lead,
  open,
  onClose,
  onConfirm,
}: {
  lead: SalesLead | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal open={open} title="Convert lead" description="Convert this lead into an active customer relationship?" onClose={onClose}>
      {lead ? (
        <dl className="mb-4 grid grid-cols-2 gap-3 border border-stroke">
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Lead</dt>
            <dd className="mt-1 text-sm text-copy">{leadName(lead)}</dd>
          </div>
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Company</dt>
            <dd className="mt-1 text-sm text-copy">{lead.company}</dd>
          </div>
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Owner</dt>
            <dd className="mt-1 text-sm text-copy">{lead.owner}</dd>
          </div>
          <div className="px-3 py-2">
            <dt className="type-kicker text-muted">Current score</dt>
            <dd className="mt-1">
              <LeadScore score={lead.score} />
            </dd>
          </div>
        </dl>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!lead}
        >
          Convert lead
        </Button>
      </div>
    </Modal>
  )
}

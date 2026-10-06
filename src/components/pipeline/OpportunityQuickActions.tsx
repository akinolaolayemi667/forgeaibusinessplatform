import { ArrowRight, Mail, MessageSquare, Plus, StickyNote, Trophy, XCircle } from 'lucide-react'
import { buttonStyles } from '@/components/ui/Button'
import { OpportunityStageControl } from '@/components/pipeline/OpportunityStageControl'
import { FieldSelect } from '@/components/crm/book/fields'
import { pipelineOwners, type Opportunity, type PipelineStageId } from '@/data/pipeline'

export function OpportunityQuickActions({
  opportunity,
  onTask,
  onNote,
  onStage,
  onAssign,
  onWon,
  onLost,
  onRestore,
  onUnavailable,
}: {
  opportunity: Opportunity
  onTask: () => void
  onNote: () => void
  onStage: (stageId: PipelineStageId) => void
  onAssign: (ownerId: string) => void
  onWon: () => void
  onLost: () => void
  onRestore: () => void
  onUnavailable: (message: string) => void
}) {
  const mail = opportunity.contactEmail
  const sms = opportunity.contactPhone.replace(/[^\d+]/g, '')
  return (
    <section className="border border-stroke bg-surface-raised p-4">
      <h2 className="font-display text-lg text-copy">Quick actions</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {mail ? (
          <a href={`mailto:${mail}`} className={buttonStyles('outline', 'sm', 'justify-start')}>
            <Mail aria-hidden size={16} />
            Send email
          </a>
        ) : (
          <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={() => onUnavailable('No email on this opportunity.')}>
            <Mail aria-hidden size={16} />
            Send email
          </button>
        )}
        {sms ? (
          <a href={`sms:${sms}`} className={buttonStyles('outline', 'sm', 'justify-start')}>
            <MessageSquare aria-hidden size={16} />
            Send message
          </a>
        ) : (
          <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={() => onUnavailable('No phone number on this opportunity.')}>
            <MessageSquare aria-hidden size={16} />
            Send message
          </button>
        )}
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onTask}>
          <Plus aria-hidden size={16} />
          Create task
        </button>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onNote}>
          <StickyNote aria-hidden size={16} />
          Add note
        </button>
        <OpportunityStageControl id="opp-quick-stage" stageId={opportunity.stageId} onChange={onStage} />
        <FieldSelect id="opp-quick-owner" label="Assign owner" value={opportunity.ownerId} onChange={onAssign}>
          {pipelineOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </FieldSelect>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onWon}>
          <Trophy aria-hidden size={16} />
          Mark won
        </button>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onLost}>
          <XCircle aria-hidden size={16} />
          Mark lost
        </button>
        {opportunity.stageId === 'lost' ? (
          <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onRestore}>
            <ArrowRight aria-hidden size={16} />
            Restore opportunity
          </button>
        ) : null}
      </div>
    </section>
  )
}

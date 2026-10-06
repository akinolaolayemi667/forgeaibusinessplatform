import { Mail, MessageSquare, Plus, StickyNote, BadgeCheck, ArrowRight } from 'lucide-react'
import { buttonStyles } from '@/components/ui/Button'
import { FieldSelect } from '@/components/crm/book/fields'
import { leadOwners, leadStatuses, type LeadStatus } from '@/data/leads'

export function LeadQuickActions({
  email,
  phone,
  status,
  owner,
  onTask,
  onNote,
  onQualify,
  onConvert,
  onStatus,
  onAssign,
}: {
  email: string
  phone: string
  status: LeadStatus
  owner: string
  onTask: () => void
  onNote: () => void
  onQualify: () => void
  onConvert: () => void
  onStatus: (status: LeadStatus) => void
  onAssign: (owner: string) => void
}) {
  return (
    <section className="border border-stroke bg-surface-raised p-4">
      <h2 className="font-display text-lg text-copy">Quick actions</h2>
      <div className="mt-3 grid gap-2">
        <a href={`mailto:${email}`} className={buttonStyles('outline', 'sm', 'justify-start')}>
          <Mail aria-hidden size={16} />
          Send email
        </a>
        {phone ? (
          <a href={`sms:${phone.replace(/[^\d+]/g, '')}`} className={buttonStyles('outline', 'sm', 'justify-start')}>
            <MessageSquare aria-hidden size={16} />
            Send message
          </a>
        ) : null}
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onTask}>
          <Plus aria-hidden size={16} />
          Create task
        </button>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onNote}>
          <StickyNote aria-hidden size={16} />
          Add note
        </button>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onQualify}>
          <BadgeCheck aria-hidden size={16} />
          Qualify lead
        </button>
        <button type="button" className={buttonStyles('outline', 'sm', 'justify-start')} onClick={onConvert} disabled={status === 'Converted'}>
          <ArrowRight aria-hidden size={16} />
          Convert lead
        </button>
        <FieldSelect id="lead-action-status" label="Change status" value={status} onChange={(value) => onStatus(value as LeadStatus)}>
          {leadStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-action-owner" label="Assign owner" value={owner} onChange={onAssign}>
          {leadOwners.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
      </div>
    </section>
  )
}

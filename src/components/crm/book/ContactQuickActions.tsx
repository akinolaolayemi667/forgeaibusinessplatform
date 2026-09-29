import { Mail, MessageSquare, Plus, StickyNote } from 'lucide-react'
import { buttonStyles } from '@/components/ui/Button'

export function ContactQuickActions({
  email,
  phone,
  onTask,
  onNote,
}: {
  email: string
  phone: string
  onTask: () => void
  onNote: () => void
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
      </div>
    </section>
  )
}

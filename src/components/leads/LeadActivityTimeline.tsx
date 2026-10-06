import {
  ArrowRightLeft,
  BadgeCheck,
  FileInput,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  UserCheck,
  UserPlus,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { LeadEmptyState } from '@/components/leads/LeadEmptyState'
import { formatActivityWhen } from '@/data/crm/time'
import type { LeadActivity, LeadActivityType } from '@/data/leads'

const icons: Record<LeadActivityType, typeof Mail> = {
  created: UserPlus,
  form: FileInput,
  email: Mail,
  assigned: UserCheck,
  call: Phone,
  status: ArrowRightLeft,
  task: CheckCircle2,
  conversation: MessageSquare,
  proposal: FileText,
  note: StickyNote,
  qualified: BadgeCheck,
  converted: ArrowRight,
}

export function LeadActivityTimeline({ items }: { items: LeadActivity[] }) {
  if (items.length === 0) {
    return <LeadEmptyState title="No activity" description="Notes, status changes, and follow-ups will collect here." />
  }
  return (
    <ol className="flex flex-col">
      {items.map((item) => {
        const Icon = icons[item.type]
        return (
          <li key={item.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 border-b border-stroke py-3 last:border-b-0">
            <Icon aria-hidden size={16} className="mt-0.5 text-ember" />
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm text-copy">{item.title}</p>
                <time className="type-data text-[11px] text-muted" dateTime={item.at}>
                  {formatActivityWhen(item.at)}
                </time>
              </div>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
              <p className="mt-1 text-xs text-muted">{item.actor}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

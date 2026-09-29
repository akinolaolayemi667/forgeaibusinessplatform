import {
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  StickyNote,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { CRMEmptyState } from '@/components/crm/book/CRMEmptyState'
import { formatActivityWhen, type ActivityType, type CrmActivity } from '@/data/crm'

const icons: Record<ActivityType, typeof Mail> = {
  created: UserPlus,
  email: Mail,
  status: ArrowRightLeft,
  note: StickyNote,
  task: CheckCircle2,
  conversation: MessageSquare,
  assigned: UserCheck,
  company: Building2,
}

export function ContactActivityTimeline({ items }: { items: CrmActivity[] }) {
  if (items.length === 0) {
    return <CRMEmptyState title="No activity" description="Notes, status changes, and tasks will collect here." />
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

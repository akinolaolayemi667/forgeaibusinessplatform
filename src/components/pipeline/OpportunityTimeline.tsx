import {
  ArrowRightLeft,
  BadgeCheck,
  CalendarClock,
  FileText,
  Mail,
  Phone,
  RotateCcw,
  StickyNote,
  UserCheck,
  UserPlus,
  XCircle,
} from 'lucide-react'
import { PipelineEmptyState } from '@/components/pipeline/PipelineEmptyState'
import { formatActivityWhen } from '@/data/crm/time'
import type { OpportunityActivity, OpportunityActivityType } from '@/data/pipeline'

const icons: Record<OpportunityActivityType, typeof Mail> = {
  created: UserPlus,
  converted: BadgeCheck,
  call: Phone,
  contact: UserCheck,
  proposal: FileText,
  email: Mail,
  task: CalendarClock,
  stage: ArrowRightLeft,
  note: StickyNote,
  won: BadgeCheck,
  lost: XCircle,
  restored: RotateCcw,
  owner: UserCheck,
  value: FileText,
}

export function OpportunityTimeline({ items }: { items: OpportunityActivity[] }) {
  if (items.length === 0) {
    return <PipelineEmptyState title="No activity" description="Notes, stage changes, and follow-ups will collect here." />
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

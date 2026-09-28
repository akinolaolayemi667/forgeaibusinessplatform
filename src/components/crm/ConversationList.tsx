import { MessageSquare } from 'lucide-react'
import { useState } from 'react'
import type { Conversation } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/cn'
import { formatDate } from '@/utils/format'

export function ConversationList({ rows }: { rows: Conversation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = rows.find((row) => row.id === selectedId) ?? null

  if (rows.length === 0) {
    return <EmptyState title="No conversations" description="This workspace has no sample threads." />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const isSelected = row.id === selectedId
          return (
            <li key={row.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedId(row.id)}
                className={cn(
                  'flex w-full cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 text-left',
                  isSelected ? 'border-ember bg-wash' : 'border-stroke hover:bg-wash',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium text-copy">{row.contact}</span>
                  <span className="text-xs text-muted">{formatDate(row.updatedAt)}</span>
                </span>
                <span className="line-clamp-2 text-sm text-muted">{row.preview}</span>
                <span className="flex gap-2">
                  <StatusBadge status={row.channel} />
                  {row.unread ? <Badge variant="accent">Unread</Badge> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {selected ? (
        <Card as="article">
          <CardTitle>{selected.contact}</CardTitle>
          <CardDescription>Latest note · {formatDate(selected.updatedAt)}</CardDescription>
          <p className="text-sm text-copy">{selected.preview}</p>
          <StatusBadge status={selected.channel} />
        </Card>
      ) : (
        <EmptyState
          icon={<MessageSquare size={20} />}
          title="No thread open"
          description="Choose a conversation to read the latest note."
        />
      )}
    </div>
  )
}

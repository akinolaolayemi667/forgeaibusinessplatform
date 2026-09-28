import { Info } from 'lucide-react'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Tooltip } from '@/components/ui/Tooltip'

type StatCardProps = {
  label: string
  value: string
  delta?: string
  deltaTone?: BadgeVariant
  hint?: string
}

export function StatCard({ label, value, delta, deltaTone = 'neutral', hint }: StatCardProps) {
  return (
    <Card as="article">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {hint ? (
          <Tooltip content={hint}>
            <button type="button" className="cursor-pointer text-muted" aria-label={`About ${label}`}>
              <Info aria-hidden size={16} />
            </button>
          </Tooltip>
        ) : null}
      </div>
      <p className="font-display text-3xl text-copy tabular-nums">{value}</p>
      {delta ? (
        <Badge className="self-start" variant={deltaTone}>
          {delta}
        </Badge>
      ) : null}
    </Card>
  )
}

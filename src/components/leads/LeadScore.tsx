import { cn } from '@/lib/cn'
import { scoreBand, type LeadScoreBand } from '@/data/leads'

const bandClass: Record<LeadScoreBand, string> = {
  HOT: 'text-ember',
  WARM: 'text-stone',
  COLD: 'text-muted',
}

export function LeadScore({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const band = scoreBand(score)
  const width = `${Math.min(100, Math.max(0, score))}%`

  if (size === 'lg') {
    return (
      <div className="min-w-36">
        <div className="flex items-baseline justify-between gap-3">
          <p className="type-data text-3xl text-copy">
            {score}
            <span className="text-base text-muted"> / 100</span>
          </p>
          <p className={cn('font-mono text-xs tracking-[0.12em]', bandClass[band])}>{band}</p>
        </div>
        <div className="mt-2 h-1 bg-steel" aria-hidden>
          <div className="h-1 bg-ember" style={{ width }} />
        </div>
      </div>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="type-data text-sm text-copy">{score}</span>
      <span className={cn('font-mono text-[10px] tracking-[0.12em]', bandClass[band])}>{band}</span>
    </span>
  )
}

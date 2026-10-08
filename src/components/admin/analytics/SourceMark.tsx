import { cn } from '@/lib/cn'
import type { AnalyticsSource } from '@/types/adminAnalytics'

export function SourceMark({ source }: { source: AnalyticsSource }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.14em]', source === 'live' ? 'text-ember' : 'text-ash')}>
      {source === 'live' ? 'Live' : 'Demo data'}
    </span>
  )
}

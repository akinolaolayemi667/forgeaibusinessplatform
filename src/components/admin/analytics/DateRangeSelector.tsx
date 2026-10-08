import { analyticsRangeOptions } from '@/lib/adminAnalytics'
import { cn } from '@/lib/cn'
import type { AnalyticsRange } from '@/types/adminAnalytics'

export function DateRangeSelector({
  range,
  onChange,
}: {
  range: AnalyticsRange
  onChange: (range: AnalyticsRange) => void
}) {
  return (
    <div role="tablist" aria-label="Date range" className="flex max-w-full flex-wrap border border-stroke">
      {analyticsRangeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={range === option.id}
          className={cn(
            'h-10 px-3 font-mono text-[11px] tracking-[0.04em]',
            range === option.id ? 'bg-ember text-on-accent' : 'text-ash hover:bg-wash hover:text-paper',
          )}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

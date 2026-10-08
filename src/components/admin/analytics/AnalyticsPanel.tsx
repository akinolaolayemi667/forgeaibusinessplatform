import type { ReactNode } from 'react'
import { SourceMark } from '@/components/admin/analytics/SourceMark'
import type { AnalyticsSource } from '@/types/adminAnalytics'

export function AnalyticsPanel({
  title,
  source,
  note,
  children,
}: {
  title: string
  source?: AnalyticsSource
  note?: string
  children: ReactNode
}) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised p-4 sm:p-5" aria-label={title}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-paper sm:text-2xl">{title}</h2>
          {note ? <p className="mt-1 max-w-2xl text-xs leading-5 text-ash">{note}</p> : null}
        </div>
        {source ? <SourceMark source={source} /> : null}
      </header>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}

export function AnalyticsEmpty({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border border-stroke px-4 py-8">
      <h3 className="font-display text-2xl text-paper">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ash">{detail}</p>
    </div>
  )
}

export function AnalyticsSkeleton({ label, rows = 4 }: { label: string; rows?: number }) {
  return (
    <div>
      <div className="border border-stroke" aria-hidden>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-stroke px-4 py-3 last:border-b-0">
            <span className="size-7 bg-steel" />
            <span className="h-3 flex-1 bg-steel" />
          </div>
        ))}
      </div>
      <p className="sr-only" role="status">{label}</p>
    </div>
  )
}

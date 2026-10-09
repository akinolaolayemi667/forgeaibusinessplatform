import { useReducedMotion } from 'framer-motion'
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTick, chartTooltipStyle } from '@/components/admin/analytics/chartTheme'
import type { GrowthPoint } from '@/types/platformOverview'

export function PlatformGrowthChart({
  title,
  note,
  points,
  loading,
  error,
  emptyTitle,
  emptyDetail,
  hasRecords,
}: {
  title: string
  note: string
  points: GrowthPoint[]
  loading: boolean
  error: string | null
  emptyTitle: string
  emptyDetail: string
  hasRecords: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby={`${title}-heading`}>
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id={`${title}-heading`} className="font-display text-xl text-paper">{title}</h2>
        <p className="mt-1 text-sm text-ash">{note}</p>
      </div>
      <div className="px-4 py-4 sm:px-5">
        {loading ? <p className="text-sm text-ash">Loading growth data...</p> : null}
        {!loading && error ? <p role="alert" className="text-sm text-badge-danger-fg">{error}</p> : null}
        {!loading && !error && !hasRecords ? (
          <div>
            <p className="type-kicker text-ash">{emptyTitle}</p>
            <p className="mt-2 text-sm text-paper">{emptyDetail}</p>
          </div>
        ) : null}
        {!loading && !error && hasRecords ? (
          <>
            <ul className="sr-only">
              {points.map((point) => (
                <li key={point.label}>
                  {point.label}: {point.created} new, {point.cumulative} cumulative
                </li>
              ))}
            </ul>
            <div aria-hidden className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#24292D" vertical={false} />
                  <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} interval={points.length > 40 ? 13 : points.length > 14 ? 4 : 0} />
                  <YAxis width={32} allowDecimals={false} tick={chartTick} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 11, color: '#8D918E' }} />
                  <Area dataKey="cumulative" name="Cumulative" stroke="#8D918E" fill="#8D918E" fillOpacity={0.16} isAnimationActive={!reduce} />
                  <Line dataKey="created" name="New" stroke="#FF6A00" strokeWidth={2} dot={false} isAnimationActive={!reduce} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

import { useReducedMotion } from 'framer-motion'
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticsEmpty, AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { chartTick, chartTooltipStyle } from '@/components/admin/analytics/chartTheme'
import type { RevenuePoint } from '@/types/adminAnalytics'
import { formatCurrency } from '@/utils/format'

export function RevenuePipelineChart({ points, hasRecords }: { points: RevenuePoint[]; hasRecords: boolean }) {
  const reduce = useReducedMotion()

  return (
    <AnalyticsPanel
      title="REVENUE PERFORMANCE"
      source="demo"
      note="Revenue is won sample value. Pipeline is open sample value. Both are grouped by the date the record was created."
    >
      {hasRecords ? (
        <>
          <ul className="sr-only">
            {points.map((point) => (
              <li key={point.label}>
                {point.label}: revenue {formatCurrency(point.revenue)}, pipeline {formatCurrency(point.pipeline)}
              </li>
            ))}
          </ul>
          <div aria-hidden className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#24292D" vertical={false} />
                <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} />
                <YAxis width={48} tick={chartTick} axisLine={false} tickLine={false} tickFormatter={(value: number) => compact(value)} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value, name) => [formatCurrency(Number(value ?? 0)), name]}
                />
                <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 11, color: '#8D918E' }} />
                <Area dataKey="pipeline" name="Pipeline" stroke="#8D918E" fill="#8D918E" fillOpacity={0.16} isAnimationActive={!reduce} />
                <Line dataKey="revenue" name="Revenue" stroke="#FF6A00" strokeWidth={2} dot={false} isAnimationActive={!reduce} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <AnalyticsEmpty title="NO ANALYTICS DATA" detail="No sample revenue or pipeline records were created in this range." />
      )}
    </AnalyticsPanel>
  )
}

function compact(value: number) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

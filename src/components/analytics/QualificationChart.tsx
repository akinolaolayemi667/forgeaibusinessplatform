import { useReducedMotion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartPoint } from '@/types'
import { EmptyState } from '@/components/ui/EmptyState'

export function QualificationChart({ points }: { points: ChartPoint[] }) {
  const reduce = useReducedMotion()

  if (points.length === 0) {
    return <EmptyState title="No weekly counts" description="This workspace has no sample chart yet." />
  }

  return (
    <section aria-label="Qualified and won conversations" className="rounded-sm border border-stroke bg-surface-raised p-4">
      <ul className="sr-only">
        {points.map((point) => (
          <li key={point.label}>
            {point.label}: {point.qualified} qualified, {point.won} won
          </li>
        ))}
      </ul>
      <div aria-hidden className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#24292D" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <YAxis width={32} tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#171B1F', border: '1px solid #24292D', borderRadius: 2, color: '#F5F3EE' }}
            />
            <Legend wrapperStyle={{ color: '#C8C4BB', fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="qualified"
              name="Qualified"
              stroke="#FF6A00"
              fill="#FF6A00"
              fillOpacity={0.16}
              isAnimationActive={!reduce}
            />
            <Area
              type="monotone"
              dataKey="won"
              name="Won"
              stroke="#C8C4BB"
              fill="#C8C4BB"
              fillOpacity={0.12}
              isAnimationActive={!reduce}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

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
    <section aria-label="Qualified and won conversations" className="rounded-lg border border-stroke bg-surface-raised p-4">
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
            <CartesianGrid stroke="#314038" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#c3ccc0', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis width={32} tick={{ fill: '#c3ccc0', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1b221d', border: '1px solid #314038', borderRadius: 6, color: '#f3efe6' }}
            />
            <Legend wrapperStyle={{ color: '#f3efe6', fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="qualified"
              name="Qualified"
              stroke="#e07a45"
              fill="#e07a45"
              fillOpacity={0.2}
              isAnimationActive={!reduce}
            />
            <Area
              type="monotone"
              dataKey="won"
              name="Won"
              stroke="#8fbfa2"
              fill="#8fbfa2"
              fillOpacity={0.15}
              isAnimationActive={!reduce}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

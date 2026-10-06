import { useReducedMotion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AdminPoint } from '@/data/adminData'

export function AdminChart({
  title,
  points,
  unit = '',
}: {
  title: string
  points: AdminPoint[]
  unit?: string
}) {
  const reduce = useReducedMotion()

  return (
    <section className="border border-stroke bg-surface-raised p-4" aria-label={title}>
      <h3 className="font-display text-lg text-paper">{title}</h3>
      <ul className="sr-only">
        {points.map((point) => (
          <li key={point.label}>
            {point.label}: {point.value}
            {unit}
          </li>
        ))}
      </ul>
      <div aria-hidden className="mt-4 h-48 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#24292D" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <YAxis width={36} tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgb(245 243 238 / 0.04)' }}
              contentStyle={{ background: '#171B1F', border: '1px solid #24292D', borderRadius: 2, color: '#F5F3EE' }}
            />
            <Bar dataKey="value" name={title} fill="#FF6A00" isAnimationActive={!reduce} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

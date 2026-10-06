import { useReducedMotion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { LeadFlowStage } from '@/data/leads'

export function LeadFlowChart({ stages }: { stages: LeadFlowStage[] }) {
  const reduce = useReducedMotion()
  const base = stages[0]?.count || 1
  return (
    <div>
      <ul className="sr-only">
        {stages.map((stage) => (
          <li key={stage.stage}>
            {stage.stage} {stage.count.toLocaleString('en-US')} ({Math.round((stage.count / base) * 1000) / 10}% of new)
          </li>
        ))}
      </ul>
      <div aria-hidden className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stages} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#24292D" vertical={false} />
            <XAxis dataKey="stage" tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={{ fill: '#8D918E', fontSize: 11, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#171B1F', border: '1px solid #24292D', borderRadius: 2, color: '#F5F3EE' }} />
            <Bar dataKey="count" name="Leads" fill="#FF6A00" maxBarSize={28} isAnimationActive={!reduce} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

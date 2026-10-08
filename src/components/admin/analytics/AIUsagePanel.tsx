import { useReducedMotion } from 'framer-motion'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { chartTick, chartTooltipStyle } from '@/components/admin/analytics/chartTheme'
import type { AdminAnalyticsModel } from '@/types/adminAnalytics'

export function AIUsagePanel({ ai }: { ai: AdminAnalyticsModel['ai'] }) {
  const reduce = useReducedMotion()
  const facts = [
    { id: 'runs', label: 'AI runs', value: String(ai.runs) },
    { id: 'leads', label: 'AI-assisted leads', value: ai.assistedLeads },
    { id: 'tasks', label: 'AI-generated tasks', value: ai.generatedTasks },
    { id: 'outreach', label: 'AI-generated outreach', value: String(ai.generatedOutreach) },
    { id: 'level', label: 'Estimated usage level', value: ai.estimatedUsage },
  ]

  return (
    <AnalyticsPanel
      title="AI USAGE"
      source="demo"
      note="Runs count undated sample activity events. Outreach counts sample briefings. Assisted leads and generated tasks are not recorded. The trend below is a fixed sample index and does not follow the date range."
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.id} className="border border-stroke px-3 py-3">
            <dt className="type-kicker text-ash">{fact.label}</dt>
            <dd className="mt-2 text-sm text-paper">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="type-kicker mt-5 text-ash">AI usage trend · not filtered by date range</h3>
      <div aria-hidden className="mt-3 h-44 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ai.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#24292D" vertical={false} />
            <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} />
            <YAxis width={32} tick={chartTick} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${Number(value ?? 0)}%`, 'Usage']} />
            <Line dataKey="value" name="Usage" stroke="#FF6A00" strokeWidth={2} dot={false} isAnimationActive={!reduce} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsPanel>
  )
}

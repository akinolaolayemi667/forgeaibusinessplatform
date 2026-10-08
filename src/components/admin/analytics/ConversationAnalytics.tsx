import { useReducedMotion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticsEmpty, AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import { chartTick, chartTooltipStyle } from '@/components/admin/analytics/chartTheme'
import type { AdminAnalyticsModel } from '@/types/adminAnalytics'

export function ConversationAnalytics({ conversations }: { conversations: AdminAnalyticsModel['conversations'] }) {
  const reduce = useReducedMotion()
  const facts = [
    { id: 'total', label: 'Total conversations', value: String(conversations.total) },
    { id: 'open', label: 'Open conversations', value: String(conversations.open) },
    { id: 'resolved', label: 'Resolved', value: conversations.resolved },
    { id: 'response', label: 'Average response time', value: conversations.averageResponse },
    { id: 'ai', label: 'AI-assisted conversations', value: conversations.aiAssisted },
  ]

  return (
    <AnalyticsPanel
      title="CONVERSATION ANALYTICS"
      source="demo"
      note="Open means the sample conversation is still unread. Resolved, response time, and AI assistance are not stored."
    >
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {facts.map((fact) => (
          <div key={fact.id} className="border border-stroke px-3 py-3">
            <dt className="type-kicker text-ash">{fact.label}</dt>
            <dd className="mt-2 text-sm text-paper">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="type-kicker mt-5 text-ash">Conversation trend</h3>
      {conversations.hasRecords ? (
        <div aria-hidden className="mt-3 h-44 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversations.series} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#24292D" vertical={false} />
              <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} />
              <YAxis width={28} allowDecimals={false} tick={chartTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="value" name="Conversations" fill="#FF6A00" isAnimationActive={!reduce} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-3">
          <AnalyticsEmpty title="NO ANALYTICS DATA" detail="No sample conversations were updated in this range." />
        </div>
      )}
    </AnalyticsPanel>
  )
}

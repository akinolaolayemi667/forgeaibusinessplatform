import { analyticsByRange, type AdminActivityItem } from '@/data/adminData'
import type { SalesLead } from '@/data/leads/leadTypes'
import { pipelineStageOrder, stageCatalog, type PipelineStageId } from '@/data/pipeline/pipelineStages'
import { weightedValue, type Opportunity } from '@/data/pipeline/pipelineTypes'
import { displayRole, formatJoined } from '@/lib/memberDisplay'
import type { Automation, Briefing, Conversation } from '@/types'
import type {
  ActivityEvent,
  AdminAnalyticsModel,
  AnalyticsCategory,
  AnalyticsInsight,
  AnalyticsKpi,
  AnalyticsRange,
  AutomationStatusSlice,
  CountPoint,
  DeltaTone,
  FunnelStage,
  PipelineStageRow,
  RevenuePoint,
  TeamPerformanceRow,
} from '@/types/adminAnalytics'
import type { OrganizationMember } from '@/types/organizationMember'
import { formatCurrency } from '@/utils/format'

const day = 24 * 60 * 60 * 1000

export const analyticsRangeOptions: { id: AnalyticsRange; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
]

type Bounds = { start: number; end: number; previousStart: number }

type Bucket = { label: string; start: number; end: number }

export type AnalyticsInput = {
  range: AnalyticsRange
  now: Date
  members: OrganizationMember[]
  opportunities: Opportunity[]
  leads: SalesLead[]
  automations: Automation[]
  conversations: Conversation[]
  briefings: Briefing[]
  activity: AdminActivityItem[]
}

export function buildAdminAnalytics(input: AnalyticsInput): AdminAnalyticsModel {
  const bounds = rangeBounds(input.range, input.now)
  const previous = { start: bounds.previousStart, end: bounds.start, previousStart: bounds.previousStart }
  const currentLeads = input.leads.filter((lead) => inBounds(lead.createdAt, bounds))
  const previousLeads = input.leads.filter((lead) => inBounds(lead.createdAt, previous))
  const currentDeals = input.opportunities.filter((deal) => inBounds(deal.createdAt, bounds))
  const previousDeals = input.opportunities.filter((deal) => inBounds(deal.createdAt, previous))
  const revenuePoints = revenueSeries(input.range, input.now, input.opportunities)
  const funnel = leadFunnel(currentLeads)
  const closed = splitClosed(currentDeals)
  const previousClosed = splitClosed(previousDeals)
  const open = currentDeals.filter((deal) => stageCatalog[deal.stageId].kind === 'open')
  const previousOpen = previousDeals.filter((deal) => stageCatalog[deal.stageId].kind === 'open')
  const newLeads = currentLeads.filter((lead) => lead.status === 'New').length
  const previousNewLeads = previousLeads.filter((lead) => lead.status === 'New').length
  const recordedRuns = sum(input.automations.map((item) => item.runs))
  const pausedAutomations = input.automations.filter((item) => item.status === 'Paused').length
  const liveAutomations = input.automations.filter((item) => item.status === 'Live').length
  const mostActive = [...input.automations].sort((a, b) => b.runs - a.runs)[0]
  const conversationSeries = conversationSeriesFor(input.range, input.now, input.conversations)
  const conversationsInRange = input.conversations.filter((item) => inBounds(item.updatedAt, bounds))
  const stages = stageRows(currentDeals)
  const overall = rate(closed.won.length, closed.won.length + closed.lost.length)
  const previousOverall = rate(previousClosed.won.length, previousClosed.won.length + previousClosed.lost.length)
  const aiSeries = analyticsByRange['30D'].aiUsage

  return {
    range: input.range,
    kpis: [
      kpi('revenue', 'Revenue', formatCurrency(closed.wonValue), closed.wonValue, previousClosed.wonValue, 'vs previous period', 'Won sample opportunities created in this range.'),
      kpi('pipeline', 'Pipeline value', formatCurrency(sum(open.map((deal) => deal.value))), sum(open.map((deal) => deal.value)), sum(previousOpen.map((deal) => deal.value)), 'vs previous period', 'Open sample opportunities created in this range.'),
      kpi('leads', 'New leads', formatCount(newLeads), newLeads, previousNewLeads, 'vs previous period', 'Sample leads marked New and created in this range.'),
      conversionKpi(overall, previousOverall),
      kpi('won', 'Won opportunities', formatCount(closed.won.length), closed.won.length, previousClosed.won.length, 'vs previous period', 'Sample opportunities marked won and created in this range.'),
      {
        id: 'runs',
        label: 'Automation runs',
        value: formatCount(recordedRuns),
        delta: '—',
        comparison: 'not dated',
        tone: 'neutral',
        description: 'Sample automation book. Run timestamps are not stored, so this total does not follow the date range.',
        source: 'demo',
      },
    ],
    revenue: revenuePoints,
    revenueHasRecords: revenuePoints.some((point) => point.revenue > 0 || point.pipeline > 0),
    funnel,
    pipelineMetrics: pipelineHealth(currentDeals, open, closed),
    pipelineStages: stages,
    pipelineHasRecords: currentDeals.length > 0,
    team: teamRows(input.members),
    automation: {
      totalRuns: recordedRuns,
      successfulRuns: recordedRuns,
      failedRuns: 0,
      successRate: recordedRuns === 0 ? null : 1,
      averageExecution: 'Not recorded',
      mostActive: mostActive ? `${mostActive.name} · ${formatCount(mostActive.runs)} runs` : 'None recorded',
      dated: false,
      status: automationStatus(liveAutomations, pausedAutomations),
    },
    ai: {
      runs: input.activity.filter((item) => item.category === 'AI').length,
      assistedLeads: 'Not recorded',
      generatedTasks: 'Not recorded',
      generatedOutreach: input.briefings.length,
      estimatedUsage: `${aiSeries[aiSeries.length - 1]?.value ?? 0}%`,
      dated: false,
      series: aiSeries,
    },
    conversations: {
      total: conversationsInRange.length,
      open: conversationsInRange.filter((item) => item.unread).length,
      resolved: 'Not recorded',
      averageResponse: 'Not recorded',
      aiAssisted: 'Not recorded',
      series: conversationSeries,
      hasRecords: conversationSeries.some((point) => point.value > 0),
    },
    activity: input.activity.map(activityEvent),
    insights: insights({
      newLeads,
      previousNewLeads,
      stages,
      recordedRuns,
      pausedAutomations,
      openConversations: conversationsInRange.filter((item) => item.unread).length,
      conversations: conversationsInRange.length,
    }),
  }
}

function kpi(id: string, label: string, value: string, current: number, previous: number, comparison: string, description: string): AnalyticsKpi {
  const change = percentChange(current, previous)
  return { id, label, value, delta: change.label, comparison, tone: change.tone, description, source: 'demo' }
}

function conversionKpi(current: number | null, previous: number | null): AnalyticsKpi {
  const currentPct = current === null ? 0 : current * 100
  const previousPct = previous === null ? 0 : previous * 100
  const change = percentChange(currentPct, previousPct)
  return {
    id: 'conversion',
    label: 'Conversion rate',
    value: current === null ? '—' : formatPercent(current),
    delta: current === null && previous === null ? '0%' : change.label,
    comparison: 'vs previous period',
    tone: current === null && previous === null ? 'neutral' : change.tone,
    description: 'Won sample opportunities divided by won and lost created in this range.',
    source: 'demo',
  }
}

export function percentChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return { label: '0%', tone: 'neutral' as DeltaTone }
  if (previous === 0) return { label: 'New', tone: 'positive' as DeltaTone }
  const pct = ((current - previous) / Math.abs(previous)) * 100
  const tone: DeltaTone = pct > 0.05 ? 'positive' : pct < -0.05 ? 'negative' : 'neutral'
  const sign = pct > 0 ? '+' : ''
  return { label: `${sign}${pct.toFixed(1)}%`, tone }
}

export function rangeBounds(range: AnalyticsRange, now: Date): Bounds {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
  const end = now.getTime() + 1
  const start = end - days * day
  return { start, end, previousStart: start - days * day }
}

function inBounds(iso: string, bounds: Pick<Bounds, 'start' | 'end'>) {
  const time = new Date(iso).getTime()
  return !Number.isNaN(time) && time >= bounds.start && time < bounds.end
}

function revenueSeries(range: AnalyticsRange, now: Date, opportunities: Opportunity[]): RevenuePoint[] {
  return buckets(range, now).map((bucket) => {
    const rows = opportunities.filter((deal) => inBounds(deal.createdAt, bucket))
    const won = rows.filter((deal) => deal.stageId === 'won')
    const open = rows.filter((deal) => stageCatalog[deal.stageId].kind === 'open')
    return {
      label: bucket.label,
      revenue: sum(won.map((deal) => deal.value)),
      pipeline: sum(open.map((deal) => deal.value)),
    }
  })
}

function buckets(range: AnalyticsRange, now: Date): Bucket[] {
  if (range === '7d') {
    return Array.from({ length: 7 }, (_, index) => {
      const start = startOfDay(new Date(now.getTime() - (6 - index) * day))
      return { label: weekday(start), start: start.getTime(), end: start.getTime() + day }
    })
  }
  if (range === '30d') {
    const origin = startOfDay(new Date(now.getTime() - 27 * day))
    return Array.from({ length: 4 }, (_, index) => {
      const start = origin.getTime() + index * 7 * day
      return { label: `W${index + 1}`, start, end: start + 7 * day }
    })
  }
  const months = range === '90d' ? 3 : 12
  return Array.from({ length: months }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1)
    const end = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index) + 1, 1)
    return { label: monthLabel(start), start: start.getTime(), end: end.getTime() }
  })
}

function conversationSeriesFor(range: AnalyticsRange, now: Date, conversations: Conversation[]): CountPoint[] {
  return buckets(range, now).map((bucket) => ({
    label: bucket.label,
    value: conversations.filter((item) => inBounds(item.updatedAt, bucket)).length,
  }))
}

function leadFunnel(leads: SalesLead[]): FunnelStage[] {
  const counts = [
    { id: 'new', label: 'New', count: leads.filter((lead) => lead.status === 'New').length },
    { id: 'working', label: 'Working', count: leads.filter((lead) => lead.status === 'Contacted' || lead.status === 'Nurturing').length },
    { id: 'qualified', label: 'Qualified', count: leads.filter((lead) => lead.status === 'Qualified').length },
  ]
  const total = sum(counts.map((stage) => stage.count))
  return counts.map((stage) => ({
    ...stage,
    share: total === 0 ? 0 : stage.count / total,
    conversionToNext: null,
  }))
}

function stageRows(deals: Opportunity[]): PipelineStageRow[] {
  return pipelineStageOrder.map((id) => {
    const rows = deals.filter((deal) => deal.stageId === id)
    return {
      id,
      stage: stageName(id),
      opportunities: rows.length,
      value: sum(rows.map((deal) => deal.value)),
      weighted: sum(rows.map((deal) => weightedValue(deal.value, deal.probability))),
    }
  })
}

function pipelineHealth(
  deals: Opportunity[],
  open: Opportunity[],
  closed: { won: Opportunity[]; lost: Opportunity[]; wonValue: number; lostValue: number },
) {
  const openValue = sum(open.map((deal) => deal.value))
  const weighted = sum(open.map((deal) => weightedValue(deal.value, deal.probability)))
  const cycle = averageCycle(closed.won.concat(closed.lost))
  return [
    { id: 'total', label: 'Total opportunities', value: formatCount(deals.length) },
    { id: 'open', label: 'Open pipeline', value: formatCurrency(openValue) },
    { id: 'weighted', label: 'Weighted pipeline', value: formatCurrency(weighted) },
    { id: 'won', label: 'Won value', value: formatCurrency(closed.wonValue) },
    { id: 'lost', label: 'Lost value', value: formatCurrency(closed.lostValue) },
    { id: 'average', label: 'Average deal size', value: open.length === 0 ? '—' : formatCurrency(openValue / open.length) },
    { id: 'cycle', label: 'Average sales cycle', value: cycle },
  ]
}

function splitClosed(deals: Opportunity[]) {
  const won = deals.filter((deal) => deal.stageId === 'won')
  const lost = deals.filter((deal) => deal.stageId === 'lost')
  return {
    won,
    lost,
    wonValue: sum(won.map((deal) => deal.value)),
    lostValue: sum(lost.map((deal) => deal.value)),
  }
}

function averageCycle(deals: Opportunity[]) {
  const spans = deals.flatMap((deal) => {
    const created = new Date(deal.createdAt).getTime()
    const closed = new Date(deal.lastActivityAt).getTime()
    if (Number.isNaN(created) || Number.isNaN(closed) || closed < created) return []
    return [(closed - created) / day]
  })
  if (spans.length === 0) return '—'
  const average = sum(spans) / spans.length
  if (average < 1) return '< 1 day'
  return `${Math.round(average)} days`
}

function teamRows(members: OrganizationMember[]): TeamPerformanceRow[] {
  return members.map((member) => ({
    id: member.id,
    name: member.name || 'Name unavailable',
    email: member.email || 'Email unavailable',
    role: displayRole(member.role),
    status: 'Active',
    joined: formatJoined(member.joinedAt),
    avatarUrl: member.avatarUrl,
  }))
}

function automationStatus(success: number, paused: number): AutomationStatusSlice[] {
  return [
    { id: 'success', label: 'Success', value: success },
    { id: 'failed', label: 'Failed', value: 0 },
    { id: 'paused', label: 'Paused', value: paused },
  ]
}

function activityEvent(item: AdminActivityItem): ActivityEvent {
  return {
    id: item.id,
    time: `${item.day} · ${item.clock}`,
    actor: item.actor,
    event: item.title,
    category: mapCategory(item.category),
    status: item.status,
  }
}

function mapCategory(category: AdminActivityItem['category']): AnalyticsCategory {
  if (category === 'CRM') return 'CRM'
  if (category === 'Billing') return 'SALES'
  if (category === 'Automations') return 'AUTOMATION'
  if (category === 'AI') return 'AI'
  if (category === 'Users') return 'TEAM'
  return 'SYSTEM'
}

function insights(input: {
  newLeads: number
  previousNewLeads: number
  stages: PipelineStageRow[]
  recordedRuns: number
  pausedAutomations: number
  openConversations: number
  conversations: number
}): AnalyticsInsight[] {
  const leadText = input.previousNewLeads === 0 && input.newLeads === 0
    ? 'AWAITING CONNECTED DATA. No sample leads marked New were created in this range or the previous one.'
    : `New sample leads created in this range: ${formatCount(input.newLeads)}. Previous period: ${formatCount(input.previousNewLeads)}.`
  const openStages = input.stages.filter((stage) => stage.id !== 'won' && stage.id !== 'lost')
  const peak = openStages.reduce<PipelineStageRow | null>((best, stage) => (!best || stage.value > best.value ? stage : best), null)
  const pipelineText = !peak || peak.value === 0
    ? 'AWAITING CONNECTED DATA. No open sample opportunities were created in this range.'
    : `Open sample pipeline value is highest in ${peak.stage} at ${formatCurrency(peak.value)}.`
  const automationText = input.recordedRuns === 0
    ? 'AWAITING CONNECTED DATA. The sample automation book has no recorded runs.'
    : `The undated sample automation book records ${formatCount(input.recordedRuns)} runs. ${formatCount(input.pausedAutomations)} automations are paused. Failed runs are not stored.`
  const conversationText = input.conversations === 0
    ? 'AWAITING CONNECTED DATA. No sample conversations were updated in this range.'
    : `${formatCount(input.openConversations)} of ${formatCount(input.conversations)} sample conversations updated in this range are still unread.`
  return [
    { id: 'leads', text: leadText },
    { id: 'pipeline', text: pipelineText },
    { id: 'automation', text: automationText },
    { id: 'conversations', text: conversationText },
  ]
}

function stageName(id: PipelineStageId) {
  return stageCatalog[id].name.replace(' Opportunity', '')
}

function rate(part: number, whole: number) {
  if (whole <= 0) return null
  return part / whole
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function weekday(date: Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
}

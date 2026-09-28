import type {
  Automation,
  Briefing,
  ChartPoint,
  Conversation,
  Deal,
  FeatureArea,
  Integration,
  Lead,
  Metric,
} from '@/types'
import { formatCurrency } from '@/utils/format'

export type HomeBundle = {
  features: FeatureArea[]
  leads: Lead[]
  deals: Deal[]
  conversations: Conversation[]
  automations: Automation[]
  briefings: Briefing[]
  metrics: Metric[]
  chart: ChartPoint[]
  integrations: Integration[]
}

export function pipelineValue(deals: Deal[]) {
  return deals.reduce((sum, deal) => sum + deal.value, 0)
}

export function workflowStatus(automations: Automation[]) {
  const live = automations.filter((item) => item.status === 'Live').length
  const paused = automations.filter((item) => item.status === 'Paused').length
  const draft = automations.filter((item) => item.status === 'Draft').length
  return `${live} live · ${paused} paused · ${draft} draft`
}

export function activityLines(bundle: HomeBundle) {
  const lines: string[] = []
  for (const lead of bundle.leads.slice(0, 2)) {
    lines.push(`Lead · ${lead.name} · ${lead.status}`)
  }
  for (const automation of bundle.automations) {
    if (automation.status === 'Live') {
      lines.push(`Automation · ${automation.name} · ${automation.runs} runs`)
    }
  }
  const briefing = bundle.briefings[0]
  if (briefing) lines.push(`Assistant · ${briefing.account} · briefing ready`)
  const deal = [...bundle.deals].sort((a, b) => b.value - a.value)[0]
  if (deal) lines.push(`Revenue · ${deal.company} · ${formatCurrency(deal.value)}`)
  return lines.length > 0 ? lines : ['Workspace idle']
}

export const systems = ['Gmail', 'Calendar', 'Slack', 'Stripe', 'SMS', 'Web forms', 'Sheets'] as const

export const problems = [
  {
    index: '01',
    title: 'The record is split',
    summary: 'Inbox, spreadsheet, and CRM each hold a different version of the same account.',
  },
  {
    index: '02',
    title: 'Follow-up is a memory',
    summary: 'The next action lives in someone’s head. Quiet threads go cold without a trail.',
  },
  {
    index: '03',
    title: 'AI sits off to the side',
    summary: 'An assistant that cannot see the lead, the stage, and the last note cannot brief the reply.',
  },
] as const

export const solutions = [
  {
    index: '01',
    title: 'CRM on the record',
    summary: 'Leads, conversations, and pipeline share one object from the first touch.',
  },
  {
    index: '02',
    title: 'A briefing before the send',
    summary: 'The assistant reads the account and proposes the next step. A person still decides.',
  },
  {
    index: '03',
    title: 'Automation with a trail',
    summary: 'Rules advance stages and nudge quiet work. Every run can be paused.',
  },
] as const

const featureAnchors: Record<string, string> = {
  leads: '#crm',
  pipeline: '#crm',
  conversations: '#crm',
  automations: '#automation',
  assistant: '#ai',
  analytics: '#analytics',
}

export function featureAnchor(id: string) {
  return featureAnchors[id] ?? '#platform'
}

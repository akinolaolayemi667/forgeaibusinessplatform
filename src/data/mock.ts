import type { ForgeDataSource } from '@/data/source'
import type {
  ArchitectureLayer,
  Automation,
  BillingSnapshot,
  Briefing,
  CaseStudy,
  ChartPoint,
  Contact,
  Conversation,
  Deal,
  FeatureArea,
  HomePoint,
  Integration,
  Lead,
  Metric,
  Plan,
  TeamMember,
  Workspace,
} from '@/types'

export const workspaces: Workspace[] = [
  { id: 'ws_harbor', name: 'Harbor & Co.' },
  { id: 'ws_fieldnote', name: 'Fieldnote Studio' },
]

export const defaultWorkspaceId = 'ws_harbor'

const harbor = 'ws_harbor'
const fieldnote = 'ws_fieldnote'

const homePoints: HomePoint[] = [
  {
    id: 'intake',
    kicker: 'Intake',
    title: 'One record from the first touch',
    summary: 'A lead arrives with a source, an owner, and a score. Nothing waits in a side spreadsheet.',
  },
  {
    id: 'motion',
    kicker: 'Motion',
    title: 'Rules that move the quiet work',
    summary: 'Automations advance stages, nudge quiet threads, and leave a trail of runs you can pause.',
  },
  {
    id: 'judgment',
    kicker: 'Judgment',
    title: 'A briefing before the reply',
    summary: 'The assistant reads the account and proposes the next step. A person still decides.',
  },
]

const features: FeatureArea[] = [
  { id: 'leads', title: 'Leads', summary: 'Capture inbound interest with a source, an owner, and a status.' },
  { id: 'pipeline', title: 'Pipeline', summary: 'See open work by stage and value without a second board.' },
  { id: 'conversations', title: 'Conversations', summary: 'Keep the latest note attached to the account.' },
  { id: 'automations', title: 'Automations', summary: 'Run, pause, or draft the rules that move records.' },
  { id: 'assistant', title: 'Assistant', summary: 'Read a short briefing before writing back.' },
  { id: 'analytics', title: 'Analytics', summary: 'Watch qualified conversations against work that was won.' },
]

const plans: Plan[] = [
  {
    id: 'bench',
    name: 'Bench',
    price: '$40',
    period: 'per seat / month',
    description: 'For one operator closing inbound.',
    highlights: ['Shared lead inbox', 'Manual stage moves', 'Weekly email summary'],
    featured: false,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$70',
    period: 'per seat / month',
    description: 'For a team sharing one pipeline.',
    highlights: ['Routing rules', 'Shared pipeline', 'Assistant briefings'],
    featured: true,
  },
  {
    id: 'foundry',
    name: 'Foundry',
    price: '$120',
    period: 'per seat / month',
    description: 'For several brands under one roof.',
    highlights: ['Multiple brands', 'Approval steps', 'Audit history'],
    featured: false,
  },
]

const architecture: ArchitectureLayer[] = [
  {
    id: 'routes',
    name: 'Routes',
    detail: 'Public pages, auth, and the workspace live on their own URLs so later phases can deepen one surface at a time.',
  },
  {
    id: 'layouts',
    name: 'Layouts',
    detail: 'Marketing and the workspace share tokens and components, with separate chrome for reading and for operating.',
  },
  {
    id: 'ui',
    name: 'UI components',
    detail: 'Buttons, tables, dialogs, and the rest of the kit stay independent of any one page.',
  },
  {
    id: 'hooks',
    name: 'Hooks',
    detail: 'Session, workspace selection, and async reads are reusable instead of copied into each screen.',
  },
  {
    id: 'source',
    name: 'ForgeDataSource',
    detail: 'Pages ask a data source for records. This preview answers with local mock data. Supabase or an HTTP API can take the same contract.',
  },
]

const caseStudy: CaseStudy = {
  client: 'Harbor & Co.',
  sector: 'Commercial studio · 28 people',
  summary:
    'Harbor & Co. keeps inbound leads, proposal follow-up, and owner handoff in one FORGE workspace. The figures below are sample outcomes from the preview data, not a customer report.',
  outcomes: [
    { label: 'Median reply', value: '14m' },
    { label: 'Qualified leads', value: '7' },
    { label: 'Open pipeline', value: '$86k' },
  ],
}

const metrics: Metric[] = [
  { id: 'h-leads', workspaceId: harbor, label: 'Open leads', value: '18', delta: '+4 this week', direction: 'up', hint: 'Leads that are not disqualified in the sample set.' },
  { id: 'h-qualified', workspaceId: harbor, label: 'Qualified', value: '7', delta: '+2 this week', direction: 'up', hint: 'Leads marked qualified.' },
  { id: 'h-pipeline', workspaceId: harbor, label: 'Pipeline', value: '$86k', delta: '+12% this month', direction: 'up', hint: 'Open deal value in the sample pipeline.' },
  { id: 'h-reply', workspaceId: harbor, label: 'Median reply', value: '14m', delta: '3m faster', direction: 'up', hint: 'Median time to the first human reply.' },
  { id: 'f-leads', workspaceId: fieldnote, label: 'Open leads', value: '6', delta: '+1 this week', direction: 'up', hint: 'Leads that are not disqualified in the sample set.' },
  { id: 'f-qualified', workspaceId: fieldnote, label: 'Qualified', value: '2', delta: 'No change', direction: 'flat', hint: 'Leads marked qualified.' },
  { id: 'f-pipeline', workspaceId: fieldnote, label: 'Pipeline', value: '$24k', delta: '+$4k this month', direction: 'up', hint: 'Open deal value in the sample pipeline.' },
  { id: 'f-reply', workspaceId: fieldnote, label: 'Median reply', value: '42m', delta: '6m slower', direction: 'down', hint: 'Median time to the first human reply.' },
]

const chart: ChartPoint[] = [
  { workspaceId: harbor, label: 'Aug 17', qualified: 4, won: 1 },
  { workspaceId: harbor, label: 'Aug 24', qualified: 5, won: 1 },
  { workspaceId: harbor, label: 'Aug 31', qualified: 6, won: 2 },
  { workspaceId: harbor, label: 'Sep 7', qualified: 5, won: 2 },
  { workspaceId: harbor, label: 'Sep 14', qualified: 8, won: 3 },
  { workspaceId: harbor, label: 'Sep 21', qualified: 7, won: 2 },
  { workspaceId: fieldnote, label: 'Aug 17', qualified: 1, won: 0 },
  { workspaceId: fieldnote, label: 'Aug 24', qualified: 2, won: 1 },
  { workspaceId: fieldnote, label: 'Aug 31', qualified: 1, won: 0 },
  { workspaceId: fieldnote, label: 'Sep 7', qualified: 2, won: 1 },
  { workspaceId: fieldnote, label: 'Sep 14', qualified: 3, won: 1 },
  { workspaceId: fieldnote, label: 'Sep 21', qualified: 2, won: 0 },
]

const leads: Lead[] = [
  { id: 'lead_amira', workspaceId: harbor, name: 'Amira Solano', company: 'Solano Ceramics', email: 'amira@solano.example', source: 'Referral', status: 'New', score: 72, owner: 'Nia Okonkwo', createdAt: '2026-09-26' },
  { id: 'lead_jonah', workspaceId: harbor, name: 'Jonah Peck', company: 'Peck Freight', email: 'jonah@peckfreight.example', source: 'Website', status: 'Working', score: 81, owner: 'Nia Okonkwo', createdAt: '2026-09-24' },
  { id: 'lead_lena', workspaceId: harbor, name: 'Lena Voss', company: 'Voss Clinic', email: 'lena@vossclinic.example', source: 'Partner', status: 'Qualified', score: 90, owner: 'Ellis Rahman', createdAt: '2026-09-21' },
  { id: 'lead_chris', workspaceId: fieldnote, name: 'Chris Adeyemi', company: 'Adeyemi Prints', email: 'chris@adeyemi.example', source: 'Website', status: 'New', score: 64, owner: 'Mara Chen', createdAt: '2026-09-25' },
  { id: 'lead_priya', workspaceId: fieldnote, name: 'Priya Raman', company: 'North Glass', email: 'priya@northglass.example', source: 'Event', status: 'Working', score: 77, owner: 'Mara Chen', createdAt: '2026-09-18' },
]

const contacts: Contact[] = [
  { id: 'contact_amira', workspaceId: harbor, name: 'Amira Solano', company: 'Solano Ceramics', email: 'amira@solano.example', title: 'Founder', lastActivity: '2026-09-26' },
  { id: 'contact_jonah', workspaceId: harbor, name: 'Jonah Peck', company: 'Peck Freight', email: 'jonah@peckfreight.example', title: 'Operations lead', lastActivity: '2026-09-25' },
  { id: 'contact_lena', workspaceId: harbor, name: 'Lena Voss', company: 'Voss Clinic', email: 'lena@vossclinic.example', title: 'Director', lastActivity: '2026-09-22' },
  { id: 'contact_chris', workspaceId: fieldnote, name: 'Chris Adeyemi', company: 'Adeyemi Prints', email: 'chris@adeyemi.example', title: 'Owner', lastActivity: '2026-09-25' },
  { id: 'contact_priya', workspaceId: fieldnote, name: 'Priya Raman', company: 'North Glass', email: 'priya@northglass.example', title: 'Producer', lastActivity: '2026-09-19' },
]

const deals: Deal[] = [
  { id: 'deal_peck', workspaceId: harbor, name: 'Thursday delivery window', company: 'Peck Freight', stage: 'Negotiation', value: 28000, owner: 'Nia Okonkwo', closeDate: '2026-10-09' },
  { id: 'deal_voss', workspaceId: harbor, name: 'Clinic refresh', company: 'Voss Clinic', stage: 'Proposal', value: 41000, owner: 'Ellis Rahman', closeDate: '2026-10-16' },
  { id: 'deal_solano', workspaceId: harbor, name: 'Showroom install', company: 'Solano Ceramics', stage: 'Discovery', value: 17000, owner: 'June Adler', closeDate: '2026-10-28' },
  { id: 'deal_glass', workspaceId: fieldnote, name: 'Lobby glass set', company: 'North Glass', stage: 'Proposal', value: 16000, owner: 'Mara Chen', closeDate: '2026-10-12' },
  { id: 'deal_prints', workspaceId: fieldnote, name: 'Catalog reprint', company: 'Adeyemi Prints', stage: 'Discovery', value: 8000, owner: 'Owen Blake', closeDate: '2026-10-21' },
]

const conversations: Conversation[] = [
  { id: 'conv_peck', workspaceId: harbor, contact: 'Jonah Peck', channel: 'Email', preview: 'Asked whether Thursday still holds and if the rate card includes the dock fee.', updatedAt: '2026-09-26T15:10:00Z', unread: true },
  { id: 'conv_voss', workspaceId: harbor, contact: 'Lena Voss', channel: 'Email', preview: 'Wants the proposal split between reception and the two treatment rooms.', updatedAt: '2026-09-25T11:40:00Z', unread: false },
  { id: 'conv_solano', workspaceId: harbor, contact: 'Amira Solano', channel: 'SMS', preview: 'Confirmed the walkthrough and asked for a morning slot.', updatedAt: '2026-09-24T18:05:00Z', unread: false },
  { id: 'conv_glass', workspaceId: fieldnote, contact: 'Priya Raman', channel: 'Email', preview: 'Sent the lobby measurements and a note about the existing brass frame.', updatedAt: '2026-09-25T09:20:00Z', unread: true },
  { id: 'conv_prints', workspaceId: fieldnote, contact: 'Chris Adeyemi', channel: 'Web', preview: 'Left a form asking for a reprint of last spring’s catalog.', updatedAt: '2026-09-23T16:00:00Z', unread: false },
]

const automations: Automation[] = [
  { id: 'auto_web', workspaceId: harbor, name: 'New website lead', trigger: 'Lead created from Website', status: 'Live', runs: 42 },
  { id: 'auto_quiet', workspaceId: harbor, name: 'Quiet thread', trigger: 'No reply for 3 days', status: 'Paused', runs: 11 },
  { id: 'auto_proposal', workspaceId: harbor, name: 'Proposal sent', trigger: 'Stage becomes Proposal', status: 'Draft', runs: 0 },
  { id: 'auto_event', workspaceId: fieldnote, name: 'Event follow-up', trigger: 'Lead source is Event', status: 'Live', runs: 8 },
  { id: 'auto_digest', workspaceId: fieldnote, name: 'Weekly digest', trigger: 'Monday at 8:00', status: 'Paused', runs: 6 },
]

const briefings: Briefing[] = [
  {
    id: 'brief_peck',
    workspaceId: harbor,
    account: 'Peck Freight',
    summary: 'Jonah asked about the Thursday delivery window. The last human reply was six days ago, and the dock fee is still unconfirmed.',
    nextStep: 'Confirm Thursday and attach the rate card with the dock fee called out.',
  },
  {
    id: 'brief_glass',
    workspaceId: fieldnote,
    account: 'North Glass',
    summary: 'Priya sent lobby measurements. The brass frame stays. Pricing has not gone back yet.',
    nextStep: 'Reply with a range for the brass-frame option and ask which week the lobby can close.',
  },
]

const integrations: Integration[] = [
  { id: 'int_gmail_h', workspaceId: harbor, name: 'Gmail', category: 'Inbox', status: 'Connected', owner: 'Nia Okonkwo' },
  { id: 'int_cal_h', workspaceId: harbor, name: 'Calendar', category: 'Calendar', status: 'Connected', owner: 'June Adler' },
  { id: 'int_slack_h', workspaceId: harbor, name: 'Slack', category: 'Team chat', status: 'Connected', owner: 'Ellis Rahman' },
  { id: 'int_stripe_h', workspaceId: harbor, name: 'Stripe', category: 'Billing', status: 'Available', owner: 'Unassigned' },
  { id: 'int_gmail_f', workspaceId: fieldnote, name: 'Gmail', category: 'Inbox', status: 'Connected', owner: 'Mara Chen' },
  { id: 'int_forms_f', workspaceId: fieldnote, name: 'Forms', category: 'Intake', status: 'Available', owner: 'Unassigned' },
  { id: 'int_sheets_f', workspaceId: fieldnote, name: 'Sheets', category: 'Files', status: 'Connected', owner: 'Owen Blake' },
]

const team: TeamMember[] = [
  { id: 'team_nia', workspaceId: harbor, name: 'Nia Okonkwo', email: 'nia@harbor.example', role: 'Owner', focus: 'Pipeline' },
  { id: 'team_ellis', workspaceId: harbor, name: 'Ellis Rahman', email: 'ellis@harbor.example', role: 'Admin', focus: 'Automations' },
  { id: 'team_june', workspaceId: harbor, name: 'June Adler', email: 'june@harbor.example', role: 'Member', focus: 'Inbox' },
  { id: 'team_mara', workspaceId: fieldnote, name: 'Mara Chen', email: 'mara@fieldnote.example', role: 'Owner', focus: 'Accounts' },
  { id: 'team_owen', workspaceId: fieldnote, name: 'Owen Blake', email: 'owen@fieldnote.example', role: 'Member', focus: 'Scheduling' },
]

const billing: BillingSnapshot[] = [
  { workspaceId: harbor, planName: 'Studio', monthlyAmount: 560, seats: 8, renewsOn: '2026-11-02', note: 'Sample invoice for eight Studio seats. Checkout is not connected.' },
  { workspaceId: fieldnote, planName: 'Bench', monthlyAmount: 120, seats: 3, renewsOn: '2026-10-18', note: 'Sample invoice for three Bench seats. Checkout is not connected.' },
]

function inWorkspace<T extends { workspaceId: string }>(rows: T[], workspaceId: string) {
  return rows.filter((row) => row.workspaceId === workspaceId)
}

export function createMockDataSource(): ForgeDataSource {
  return {
    listWorkspaces: () => Promise.resolve(workspaces),
    listHomePoints: () => Promise.resolve(homePoints),
    listFeatures: () => Promise.resolve(features),
    listPlans: () => Promise.resolve(plans),
    getArchitecture: () => Promise.resolve(architecture),
    getCaseStudy: () => Promise.resolve(caseStudy),
    listMetrics: (workspaceId) => Promise.resolve(inWorkspace(metrics, workspaceId)),
    listChart: (workspaceId) => Promise.resolve(inWorkspace(chart, workspaceId)),
    listLeads: (workspaceId) => Promise.resolve(inWorkspace(leads, workspaceId)),
    listContacts: (workspaceId) => Promise.resolve(inWorkspace(contacts, workspaceId)),
    listDeals: (workspaceId) => Promise.resolve(inWorkspace(deals, workspaceId)),
    listConversations: (workspaceId) => Promise.resolve(inWorkspace(conversations, workspaceId)),
    listAutomations: (workspaceId) => Promise.resolve(inWorkspace(automations, workspaceId)),
    listBriefings: (workspaceId) => Promise.resolve(inWorkspace(briefings, workspaceId)),
    listIntegrations: (workspaceId) => Promise.resolve(inWorkspace(integrations, workspaceId)),
    listTeam: (workspaceId) => Promise.resolve(inWorkspace(team, workspaceId)),
    getBilling: (workspaceId) => {
      const snapshot = billing.find((item) => item.workspaceId === workspaceId)
      return snapshot
        ? Promise.resolve(snapshot)
        : Promise.reject(new Error('Billing is not available for this workspace.'))
    },
  }
}

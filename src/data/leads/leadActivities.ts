import { hoursAgo, hoursAhead } from '@/data/crm/time'
import type { LeadActivity, LeadNote, LeadTask } from '@/data/leads/leadTypes'
import { seedLeads } from '@/data/leads/leads'
import { leadName } from '@/data/leads/leadTypes'

const sarah: LeadActivity[] = [
  {
    id: 'lact_sarah_proposal',
    leadId: 'ld_sarah',
    type: 'proposal',
    title: 'Proposal requested',
    description: 'Sarah asked for a qualification workflow outline before the Thursday review.',
    at: hoursAgo(0.2),
    actor: 'Michael Reed',
  },
  {
    id: 'lact_sarah_whatsapp',
    leadId: 'ld_sarah',
    type: 'conversation',
    title: 'WhatsApp conversation started',
    description: 'Thread opened after the website form asked for a same-day reply.',
    at: hoursAgo(2),
    actor: 'Michael Reed',
  },
  {
    id: 'lact_sarah_task',
    leadId: 'ld_sarah',
    type: 'task',
    title: 'Follow-up task created',
    description: 'Send the qualified-account brief before the afternoon review.',
    at: hoursAgo(5),
    actor: 'Michael Reed',
  },
  {
    id: 'lact_sarah_status',
    leadId: 'ld_sarah',
    type: 'qualified',
    title: 'Status changed to Qualified',
    description: 'Score and source matched the qualification rule for website enterprise leads.',
    at: hoursAgo(8),
    actor: 'Michael Reed',
  },
  {
    id: 'lact_sarah_call',
    leadId: 'ld_sarah',
    type: 'call',
    title: 'Call completed',
    description: 'Confirmed Sarah is the decision maker for operations automation.',
    at: hoursAgo(26),
    actor: 'Michael Reed',
  },
  {
    id: 'lact_sarah_assign',
    leadId: 'ld_sarah',
    type: 'assigned',
    title: 'Sales representative assigned',
    description: 'Michael Reed took ownership after the form landed.',
    at: hoursAgo(24 * 17),
    actor: 'System',
  },
  {
    id: 'lact_sarah_email',
    leadId: 'ld_sarah',
    type: 'email',
    title: 'Email opened',
    description: 'Opened the commercial-property follow-up.',
    at: hoursAgo(24 * 16),
    actor: 'Sarah Mitchell',
  },
  {
    id: 'lact_sarah_form',
    leadId: 'ld_sarah',
    type: 'form',
    title: 'Website form submitted',
    description: 'Captured from /commercial-property on the Spring Property Campaign.',
    at: hoursAgo(24 * 18),
    actor: 'Website',
  },
  {
    id: 'lact_sarah_created',
    leadId: 'ld_sarah',
    type: 'created',
    title: 'Lead created',
    description: 'Northstar Properties entered the book from the website.',
    at: hoursAgo(24 * 18),
    actor: 'System',
  },
]

function basicTrail(leadId: string): LeadActivity[] {
  const lead = seedLeads.find((item) => item.id === leadId)
  if (!lead) return []
  const name = leadName(lead)
  return [
    {
      id: `${leadId}_created`,
      leadId,
      type: 'created',
      title: 'Lead created',
      description: `${name} entered from ${lead.source}.`,
      at: lead.createdAt,
      actor: 'System',
    },
    {
      id: `${leadId}_touch`,
      leadId,
      type: lead.source === 'Website' ? 'form' : lead.source === 'WhatsApp' ? 'conversation' : 'email',
      title: lead.source === 'Website' ? 'Website form submitted' : lead.source === 'WhatsApp' ? 'WhatsApp conversation started' : 'Email opened',
      description: `${lead.campaign} · ${lead.landingPage}`,
      at: lead.lastActivityAt,
      actor: lead.owner,
    },
  ]
}

export const seedLeadActivities: LeadActivity[] = [
  ...sarah,
  ...seedLeads.filter((lead) => lead.id !== 'ld_sarah').flatMap((lead) => basicTrail(lead.id)),
]

export const seedLeadTasks: LeadTask[] = [
  {
    id: 'ltask_sarah',
    leadId: 'ld_sarah',
    title: 'Send the qualified-account brief',
    description: 'Include the qualification workflow and the Thursday review slot.',
    dueAt: hoursAhead(3),
    priority: 'High',
    assignee: 'Michael Reed',
    done: false,
  },
  {
    id: 'ltask_daniel',
    leadId: 'ld_daniel',
    title: 'Reply on the LinkedIn thread',
    description: 'Confirm the demo window with Vertex Systems.',
    dueAt: hoursAhead(8),
    priority: 'Medium',
    assignee: 'Alicia Morgan',
    done: false,
  },
  {
    id: 'ltask_evan',
    leadId: 'ld_evan',
    title: 'Book the revenue-ops review',
    description: 'Apex Growth asked for a scored-lead walkthrough.',
    dueAt: hoursAhead(20),
    priority: 'High',
    assignee: 'Michael Reed',
    done: false,
  },
  {
    id: 'ltask_ruth',
    leadId: 'ld_ruth',
    title: 'Schedule the COO review',
    description: 'Harborline wants one owner across buildings.',
    dueAt: hoursAhead(28),
    priority: 'Medium',
    assignee: 'Michael Reed',
    done: false,
  },
]

export const seedLeadNotes: LeadNote[] = [
  {
    id: 'lnote_sarah',
    leadId: 'ld_sarah',
    body: 'Decision maker confirmed interest in automated lead qualification.',
    author: 'Michael Reed',
    at: hoursAgo(8),
  },
]

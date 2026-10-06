import { hoursAgo } from '@/data/crm/time'
import { seedOpportunities } from '@/data/pipeline/opportunities'
import { stageCatalog } from '@/data/pipeline/pipelineStages'
import type { OpportunityActivity, OpportunityNote, OpportunityTask } from '@/data/pipeline/pipelineTypes'

const richIds = new Set(['opp_northstar', 'opp_vertex', 'opp_harborline'])

function trail(opportunityId: string, actor: string, items: Omit<OpportunityActivity, 'id' | 'opportunityId' | 'actor'>[]): OpportunityActivity[] {
  return items.map((item, index) => ({
    id: `oact_${opportunityId}_${index}`,
    opportunityId,
    actor,
    ...item,
  }))
}

const northstar = trail('opp_northstar', 'Michael Reed', [
  {
    type: 'note',
    title: 'Note added',
    description: 'Procurement team requested revised implementation timeline.',
    at: hoursAgo(0.3),
  },
  {
    type: 'task',
    title: 'Follow-up scheduled',
    description: 'Review call set with Sarah Mitchell before the steering meeting.',
    at: hoursAgo(0.2),
  },
  {
    type: 'contact',
    title: 'Decision maker identified',
    description: 'Sarah Mitchell confirmed as the operations sponsor.',
    at: hoursAgo(5),
  },
  {
    type: 'call',
    title: 'Discovery call completed',
    description: 'Walked the handoff between leasing and finance.',
    at: hoursAgo(26),
  },
  {
    type: 'converted',
    title: 'Lead converted',
    description: 'Website lead moved into an active opportunity.',
    at: hoursAgo(24 * 6),
  },
  {
    type: 'created',
    title: 'Opportunity created',
    description: 'Enterprise Automation opened for Northstar Properties.',
    at: hoursAgo(24 * 18),
  },
])

const vertex = trail('opp_vertex', 'Michael Reed', [
  {
    type: 'task',
    title: 'Task completed',
    description: 'Proposal packet sent to Olivia Brown.',
    at: hoursAgo(3),
  },
  {
    type: 'email',
    title: 'Proposal opened',
    description: 'Olivia Brown opened the service desk proposal.',
    at: hoursAgo(4),
  },
  {
    type: 'proposal',
    title: 'Proposal sent',
    description: 'Service desk rollout proposal delivered.',
    at: hoursAgo(20),
  },
  {
    type: 'stage',
    title: 'Stage changed',
    description: 'Service Desk Rollout moved to Proposal.',
    at: hoursAgo(24),
  },
  {
    type: 'call',
    title: 'Discovery call completed',
    description: 'Scoped the current ticket queue and the handoff to operations.',
    at: hoursAgo(24 * 4),
  },
  {
    type: 'created',
    title: 'Opportunity created',
    description: 'Service Desk Rollout opened for Vertex Systems.',
    at: hoursAgo(24 * 24),
  },
])

const harborline = trail('opp_harborline', 'Alicia Morgan', [
  {
    type: 'stage',
    title: 'Stage changed',
    description: 'Route Automation moved to Negotiation.',
    at: hoursAgo(6),
  },
  {
    type: 'proposal',
    title: 'Proposal sent',
    description: 'Commercial terms sent to Marcus Ellison.',
    at: hoursAgo(24 * 3),
  },
  {
    type: 'created',
    title: 'Opportunity created',
    description: 'Route Automation opened for Harborline Logistics.',
    at: hoursAgo(24 * 30),
  },
])

function genericActivities(): OpportunityActivity[] {
  return seedOpportunities
    .filter((opportunity) => !richIds.has(opportunity.id))
    .flatMap((opportunity) => {
      const created: OpportunityActivity = {
        id: `oact_${opportunity.id}_created`,
        opportunityId: opportunity.id,
        type: 'created',
        title: 'Opportunity created',
        description: `${opportunity.name} opened for ${opportunity.company}.`,
        at: opportunity.createdAt,
        actor: opportunity.owner,
      }
      if (opportunity.stageId === 'new') return [created]
      const moved: OpportunityActivity = {
        id: `oact_${opportunity.id}_stage`,
        opportunityId: opportunity.id,
        type: opportunity.stageId === 'won' ? 'won' : opportunity.stageId === 'lost' ? 'lost' : 'stage',
        title: opportunity.stageId === 'won' ? 'Marked won' : opportunity.stageId === 'lost' ? 'Marked lost' : 'Stage changed',
        description:
          opportunity.stageId === 'lost' && opportunity.lossReason
            ? `${opportunity.name} marked lost. Reason: ${opportunity.lossReason}.`
            : `${opportunity.name} moved to ${stageCatalog[opportunity.stageId].name}.`,
        at: opportunity.lastActivityAt,
        actor: opportunity.owner,
      }
      return [moved, created]
    })
}

export const seedOpportunityActivities: OpportunityActivity[] = [...northstar, ...vertex, ...harborline, ...genericActivities()].sort((a, b) =>
  b.at.localeCompare(a.at),
)

export const seedOpportunityNotes: OpportunityNote[] = [
  {
    id: 'onote_northstar',
    opportunityId: 'opp_northstar',
    body: 'Procurement team requested revised implementation timeline.',
    author: 'Michael Reed',
    at: hoursAgo(0.3),
  },
]

export const seedOpportunityTasks: OpportunityTask[] = [
  {
    id: 'otask_northstar',
    opportunityId: 'opp_northstar',
    title: 'Confirm implementation timeline',
    description: 'Send the revised rollout dates before the steering review.',
    dueAt: '2026-10-14T12:00:00',
    priority: 'High',
    assignee: 'Michael Reed',
    done: false,
  },
  {
    id: 'otask_vertex',
    opportunityId: 'opp_vertex',
    title: 'Send the proposal',
    description: 'Deliver the service desk packet to Olivia Brown.',
    dueAt: '2026-10-04T12:00:00',
    priority: 'High',
    assignee: 'Michael Reed',
    done: true,
  },
  {
    id: 'otask_harborline',
    opportunityId: 'opp_harborline',
    title: 'Legal redlines',
    description: 'Collect the remaining commercial redlines.',
    dueAt: '2026-10-16T12:00:00',
    priority: 'Medium',
    assignee: 'Alicia Morgan',
    done: false,
  },
]

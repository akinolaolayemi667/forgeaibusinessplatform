import { hoursAgo } from '@/data/crm/time'
import { isOpenStage, type PipelineStageId } from '@/data/pipeline/pipelineStages'
import {
  ownerName,
  pipelineOwners,
  weightedValue,
  type LossReason,
  type Opportunity,
  type OpportunityPriority,
  type OpportunitySource,
} from '@/data/pipeline/pipelineTypes'

const companies: { id: string; name: string }[] = [
  { id: 'co_northwind', name: 'Northwind Atelier' },
  { id: 'co_copperline', name: 'Copperline Medical' },
  { id: 'co_fieldnote', name: 'Fieldnote Goods' },
  { id: 'co_sable', name: 'Sable Transit' },
  { id: 'co_redcedar', name: 'Redcedar Mills' },
  { id: 'co_orchard', name: 'Orchard Civic' },
  { id: 'co_mariner', name: 'Mariner Glass' },
  { id: 'co_helio', name: 'Helio Warehousing' },
  { id: 'co_pallet', name: 'Pallet Works' },
  { id: 'co_westline', name: 'Westline Credit' },
  { id: 'co_juniper', name: 'Juniper Schools' },
  { id: 'co_ironleaf', name: 'Ironleaf Energy' },
  { id: 'co_cinder', name: 'Cinder Hospitality' },
  { id: 'co_lowell', name: 'Lowell Instruments' },
  { id: 'co_bramble', name: 'Bramble Foods' },
  { id: 'co_quarry', name: 'Quarry Health' },
  { id: 'co_nimbus', name: 'Nimbus Parts' },
  { id: 'co_harborpine', name: 'Harbor Pine' },
  { id: 'co_static', name: 'Static Works' },
  { id: 'co_yellowline', name: 'Yellowline Media' },
  { id: 'co_kettle', name: 'Kettle River' },
  { id: 'co_moss', name: 'Moss & Grain' },
  { id: 'co_lantern', name: 'Lantern Clinics' },
  { id: 'co_drift', name: 'Drift Mail' },
  { id: 'co_oakline', name: 'Oakline Insurance' },
  { id: 'co_pivot', name: 'Pivot Labs' },
  { id: 'co_cedar', name: 'Cedar Freight' },
  { id: 'co_alto', name: 'Alto Municipal' },
  { id: 'co_brightcoil', name: 'Bright Coil' },
  { id: 'co_umber', name: 'Umber Studio' },
  { id: 'co_relay', name: 'Relay Pharmacy' },
  { id: 'co_northspan', name: 'Northspan Steel' },
  { id: 'co_kindling', name: 'Kindling HR' },
  { id: 'co_vesper', name: 'Vesper Hotels' },
  { id: 'co_plainfield', name: 'Plainfield Utilities' },
  { id: 'co_archer', name: 'Archer Fabrication' },
]

const people = [
  ['Jonah', 'Pell'],
  ['Adele', 'Okada'],
  ['Noor', 'Voss'],
  ['Felix', 'Rahman'],
  ['Maren', 'Ibarra'],
  ['Idris', 'Adler'],
  ['Paulina', 'Santos'],
  ['Seth', 'Berg'],
  ['Yara', 'Quill'],
  ['Hugo', 'Hoff'],
  ['Lila', 'Drake'],
  ['Owen', 'Sato'],
  ['Greta', 'Keene'],
  ['Nabil', 'Abbott'],
  ['Tess', 'Frost'],
  ['Ivan', 'Lang'],
  ['Cora', 'Mendez'],
  ['Malik', 'Shore'],
  ['June', 'Hart'],
  ['Ellis', 'Nguyen'],
]

const dealNames = [
  'Workflow rollout',
  'Seat expansion',
  'Inbox automation',
  'Service desk',
  'Renewal',
  'Pilot program',
  'Implementation',
  'Routing rules',
  'Shared inbox',
  'Quarterly review',
]

const sources: OpportunitySource[] = ['Website', 'Referral', 'LinkedIn', 'Google Ads', 'WhatsApp', 'Lead conversion', 'Other']

function allocate(total: number, count: number) {
  const units = total / 100
  const base = Math.floor(units / count)
  const extra = units - base * count
  return Array.from({ length: count }, (_, index) => (base + (index < extra ? 1 : 0)) * 100)
}

function stamp(index: number, hour: number) {
  const date = new Date(2026, 8, 2, hour, 0, 0)
  date.setDate(2 + (index % 26))
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}T${String(hour).padStart(2, '0')}:00:00`
}

function closeFor(index: number) {
  if (index % 17 === 0) return '2026-09-20T12:00:00'
  const date = new Date(2026, 9, 8, 12, 0, 0)
  date.setDate(8 + (index % 50))
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}T12:00:00`
}

function priorityFor(index: number): OpportunityPriority {
  if (index % 11 === 0) return 'High'
  if (index % 2 === 0) return 'Medium'
  return 'Low'
}

type Slot = {
  id: string
  stageId: PipelineStageId
  value: number
  probability: number
  name?: string
  companyId?: string
  company?: string
  contactId?: string
  contact?: string
  contactEmail?: string
  contactPhone?: string
  ownerId?: string
  source?: OpportunitySource
  priority?: OpportunityPriority
  close?: string
  createdAt?: string
  lastActivityAt?: string
  tags?: string[]
  lossReason?: LossReason | null
  previousStageId?: PipelineStageId | null
}

function materialize(slots: Slot[]): Opportunity[] {
  return slots.map((slot, index) => {
    const company = companies[index % companies.length]
    const person = people[index % people.length]
    const contact = slot.contact ?? `${person[0]} ${person[1]}`
    const companyName = slot.company ?? company.name
    const companyId = slot.companyId ?? company.id
    const ownerId = slot.ownerId ?? pipelineOwners[index % pipelineOwners.length].id
    const priority = slot.priority ?? priorityFor(index)
    const tags = slot.tags ?? [...(slot.value >= 40_000 ? ['High Value'] : []), ...(priority === 'High' ? ['Priority'] : [])]
    const createdAt = slot.createdAt ?? stamp(index, 9)
    const lastActivityAt = slot.lastActivityAt ?? hoursAgo((index % 70) + 3)
    const emailName = contact.toLowerCase().replace(/[^a-z]+/g, '.')
    return {
      id: slot.id,
      name: slot.name ?? `${dealNames[index % dealNames.length]}`,
      companyId,
      company: companyName,
      contactId: slot.contactId ?? `ct_pipe_${index}`,
      contact,
      contactEmail: slot.contactEmail ?? `${emailName}@${companyId.replace(/^co_/, '')}.example`,
      contactPhone: slot.contactPhone ?? `+1 555 ${String(1100 + index).padStart(4, '0')}`,
      value: slot.value,
      probability: slot.probability,
      stageId: slot.stageId,
      ownerId,
      owner: ownerName(ownerId),
      expectedCloseDate: slot.close ?? closeFor(index),
      source: slot.source ?? sources[index % sources.length],
      priority,
      createdAt,
      updatedAt: lastActivityAt,
      lastActivityAt,
      tags,
      lossReason: slot.lossReason ?? null,
      previousStageId: slot.previousStageId ?? null,
    }
  })
}

function slots(stageId: PipelineStageId, values: number[], probability: number, prefix: string): Slot[] {
  return values.map((value, index) => ({
    id: `opp_${prefix}_${index}`,
    stageId,
    value,
    probability,
  }))
}

function buildOpportunities() {
  const featured: Slot[] = [
    {
      id: 'opp_northstar',
      stageId: 'discovery',
      value: 48_000,
      probability: 72,
      name: 'Enterprise Automation',
      companyId: 'co_northstar',
      company: 'Northstar Properties',
      contactId: 'ct_sarah',
      contact: 'Sarah Mitchell',
      contactEmail: 'sarah@northstar.example',
      contactPhone: '+1 415 555 0192',
      ownerId: 'owner_michael',
      source: 'Website',
      priority: 'High',
      close: '2026-10-14T12:00:00',
      createdAt: hoursAgo(24 * 18),
      lastActivityAt: hoursAgo(0.2),
      tags: ['Enterprise', 'High Value', 'Expansion', 'Priority'],
    },
    {
      id: 'opp_vertex',
      stageId: 'proposal',
      value: 50_000,
      probability: 75,
      name: 'Service Desk Rollout',
      companyId: 'co_vertex',
      company: 'Vertex Systems',
      contactId: 'ct_olivia',
      contact: 'Olivia Brown',
      contactEmail: 'olivia@vertex.example',
      contactPhone: '+1 646 555 0138',
      ownerId: 'owner_michael',
      source: 'LinkedIn',
      priority: 'High',
      close: '2026-10-22T12:00:00',
      createdAt: hoursAgo(24 * 24),
      lastActivityAt: hoursAgo(2),
      tags: ['Enterprise', 'High Value', 'Priority'],
    },
    {
      id: 'opp_harborline',
      stageId: 'negotiation',
      value: 86_000,
      probability: 70,
      name: 'Route Automation',
      companyId: 'co_harborline',
      company: 'Harborline Logistics',
      contactId: 'ct_marcus',
      contact: 'Marcus Ellison',
      contactEmail: 'marcus@harborline.example',
      contactPhone: '+1 206 555 0122',
      ownerId: 'owner_alicia',
      source: 'Referral',
      priority: 'High',
      close: '2026-10-18T12:00:00',
      createdAt: hoursAgo(24 * 30),
      lastActivityAt: hoursAgo(6),
      tags: ['Enterprise', 'High Value', 'Expansion'],
    },
  ]

  const rows = materialize([
    ...slots('new', allocate(210_000, 18), 10, 'new'),
    ...slots('contacted', allocate(348_000, 31), 10, 'contacted'),
    ...featured.filter((slot) => slot.stageId === 'discovery'),
    ...slots('discovery', allocate(334_000, 23), 45, 'discovery'),
    ...featured.filter((slot) => slot.stageId === 'proposal'),
    ...slots('proposal', allocate(62_000, 4), 10, 'proposal_low'),
    ...slots('proposal', allocate(400_000, 23), 45, 'proposal'),
    ...featured.filter((slot) => slot.stageId === 'negotiation'),
    ...slots('negotiation', allocate(302_000, 26), 72, 'negotiation'),
    ...[72_000, 54_000, 48_000, 40_000, 32_000, 24_000, 16_000].map((value, index) => ({
      id: `opp_won_${index}`,
      stageId: 'won' as const,
      value,
      probability: 100,
      name: index === 0 ? 'Line Expansion' : undefined,
      companyId: index === 0 ? 'co_kiln' : undefined,
      company: index === 0 ? 'Kiln Works' : undefined,
      contactId: index === 0 ? 'ct_priya' : undefined,
      contact: index === 0 ? 'Priya Nandakumar' : undefined,
      contactEmail: index === 0 ? 'priya@kilnworks.example' : undefined,
      contactPhone: index === 0 ? '+1 312 555 0181' : undefined,
      ownerId: 'owner_sarah',
      source: 'Referral' as const,
      priority: 'Medium' as const,
      close: `2026-10-${String(2 + index).padStart(2, '0')}T12:00:00`,
      previousStageId: 'negotiation' as const,
    })),
    ...(['Budget', 'Timing', 'Competitor', 'No Response', 'Not a Fit', 'Other', 'Competitor', 'Budget'] as LossReason[]).map(
      (reason, index) => ({
        id: `opp_lost_${index}`,
        stageId: 'lost' as const,
        value: 18_000 + index * 1_000,
        probability: 0,
        name: index === 0 ? 'Lobby Refresh' : undefined,
        companyId: index === 0 ? 'co_paperroom' : undefined,
        company: index === 0 ? 'Paperroom Studio' : undefined,
        contactId: index === 0 ? 'ct_chris' : undefined,
        contact: index === 0 ? 'Chris Dalton' : undefined,
        contactEmail: index === 0 ? 'chris@paperroom.example' : undefined,
        contactPhone: index === 0 ? '+1 503 555 0133' : undefined,
        ownerId: 'owner_daniel',
        priority: 'Low' as const,
        lossReason: reason,
        previousStageId: (index % 2 === 0 ? 'proposal' : 'discovery') as PipelineStageId,
        close: '2026-09-28T12:00:00',
      }),
    ),
  ])

  assertBook(rows)
  return rows
}

function assertBook(rows: Opportunity[]) {
  const open = rows.filter((row) => isOpenStage(row.stageId))
  const sum = (list: Opportunity[]) => list.reduce((total, row) => total + row.value, 0)
  const weighted = open.reduce((total, row) => total + weightedValue(row.value, row.probability), 0)
  const commit = sum(open.filter((row) => row.probability >= 70))
  const best = sum(open.filter((row) => row.probability >= 40))
  const won = sum(rows.filter((row) => row.stageId === 'won'))
  const problems: string[] = []
  if (open.length !== 128) problems.push(`count ${open.length}`)
  if (sum(open) !== 1_840_000) problems.push(`value ${sum(open)}`)
  if (weighted !== 742_000) problems.push(`weighted ${weighted}`)
  if (commit !== 486_000) problems.push(`commit ${commit}`)
  if (best !== 1_220_000) problems.push(`best ${best}`)
  if (won !== 286_000) problems.push(`won ${won}`)
  const expect: [PipelineStageId, number, number][] = [
    ['new', 18, 210_000],
    ['contacted', 31, 348_000],
    ['discovery', 24, 382_000],
    ['proposal', 28, 512_000],
    ['negotiation', 27, 388_000],
  ]
  for (const [id, count, value] of expect) {
    const list = open.filter((row) => row.stageId === id)
    if (list.length !== count) problems.push(`${id} count ${list.length}`)
    if (sum(list) !== value) problems.push(`${id} value ${sum(list)}`)
  }
  const northstar = rows.find((row) => row.id === 'opp_northstar')
  if (!northstar || weightedValue(northstar.value, northstar.probability) !== 34_560) problems.push('northstar weighted')
  if (problems.length > 0) throw new Error(`Pipeline seed mismatch: ${problems.join('; ')}`)
}

export const seedOpportunities = buildOpportunities()

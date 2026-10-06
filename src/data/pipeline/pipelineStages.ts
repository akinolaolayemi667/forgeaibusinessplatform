export const pipelineStageOrder = ['new', 'contacted', 'discovery', 'proposal', 'negotiation', 'won', 'lost'] as const

export type PipelineStageId = (typeof pipelineStageOrder)[number]

export const openStageOrder = ['new', 'contacted', 'discovery', 'proposal', 'negotiation'] as const

export const progressStageOrder = ['new', 'contacted', 'discovery', 'proposal', 'negotiation', 'won'] as const

export type PipelineStage = {
  id: PipelineStageId
  name: string
  kind: 'open' | 'closed'
}

export const stageCatalog: Record<PipelineStageId, PipelineStage> = {
  new: { id: 'new', name: 'New Opportunity', kind: 'open' },
  contacted: { id: 'contacted', name: 'Contacted', kind: 'open' },
  discovery: { id: 'discovery', name: 'Discovery', kind: 'open' },
  proposal: { id: 'proposal', name: 'Proposal', kind: 'open' },
  negotiation: { id: 'negotiation', name: 'Negotiation', kind: 'open' },
  won: { id: 'won', name: 'Won', kind: 'closed' },
  lost: { id: 'lost', name: 'Lost', kind: 'closed' },
}

export function isOpenStage(stageId: PipelineStageId) {
  return stageCatalog[stageId].kind === 'open'
}

export function isPipelineStage(value: string): value is PipelineStageId {
  return pipelineStageOrder.includes(value as PipelineStageId)
}

export const pipelineHistory = { won: 62, lost: 188 }

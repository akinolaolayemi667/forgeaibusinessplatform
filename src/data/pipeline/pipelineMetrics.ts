import { pipelineHistory, stageCatalog, openStageOrder, type PipelineStageId } from '@/data/pipeline/pipelineStages'
import { weightedValue, type Opportunity } from '@/data/pipeline/pipelineTypes'

export type PipelineMetrics = {
  openValue: number
  weighted: number
  best: number
  commit: number
  openCount: number
  wonThisMonth: number
  winRate: number
  average: number
}

export function pipelineMetrics(opportunities: Opportunity[], deltas: { won: number; lost: number }): PipelineMetrics {
  const open = opportunities.filter((item) => stageCatalog[item.stageId].kind === 'open')
  const openValue = open.reduce((sum, item) => sum + item.value, 0)
  const weighted = open.reduce((sum, item) => sum + weightedValue(item.value, item.probability), 0)
  const best = open.filter((item) => item.probability >= 40).reduce((sum, item) => sum + item.value, 0)
  const commit = open.filter((item) => item.probability >= 70).reduce((sum, item) => sum + item.value, 0)
  const wonThisMonth = opportunities.filter((item) => item.stageId === 'won').reduce((sum, item) => sum + item.value, 0)
  const wonCount = pipelineHistory.won + deltas.won
  const lostCount = pipelineHistory.lost + deltas.lost
  const closed = wonCount + lostCount
  const winRate = closed === 0 ? 0 : (wonCount / closed) * 100
  const average = open.length === 0 ? 0 : openValue / open.length
  return { openValue, weighted, best, commit, openCount: open.length, wonThisMonth, winRate, average }
}

export type StageBreakdownRow = {
  id: PipelineStageId
  name: string
  count: number
  value: number
}

export function stageBreakdown(opportunities: Opportunity[]): StageBreakdownRow[] {
  return openStageOrder.map((id) => {
    const rows = opportunities.filter((item) => item.stageId === id)
    return {
      id,
      name: stageCatalog[id].name,
      count: rows.length,
      value: rows.reduce((sum, item) => sum + item.value, 0),
    }
  })
}

import { stageCatalog } from '@/data/pipeline/pipelineStages'
import type { Opportunity } from '@/data/pipeline/pipelineTypes'

export type PipelineQuery = {
  stage: string
  owner: string
  value: string
  probability: string
  priority: string
  close: string
  company: string
  sort: string
}

export const initialPipelineQuery: PipelineQuery = {
  stage: 'all',
  owner: 'all',
  value: 'any',
  probability: 'any',
  priority: 'all',
  close: 'any',
  company: 'all',
  sort: 'value-desc',
}

export function pipelineFiltersActive(query: PipelineQuery, search: string) {
  return (
    search.trim().length > 0 ||
    query.stage !== 'all' ||
    query.owner !== 'all' ||
    query.value !== 'any' ||
    query.probability !== 'any' ||
    query.priority !== 'all' ||
    query.close !== 'any' ||
    query.company !== 'all'
  )
}

function closeMatch(iso: string, filter: string) {
  if (filter === 'any') return true
  const close = new Date(iso).getTime()
  if (Number.isNaN(close)) return false
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const day = 24 * 60 * 60 * 1000
  if (filter === 'overdue') return close < start
  if (filter === 'week') return close >= start && close < start + 7 * day
  if (filter === '30') return close >= start && close < start + 30 * day
  if (filter === 'month') {
    const date = new Date(iso)
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  }
  return true
}

function valueMatch(value: number, filter: string) {
  if (filter === 'under-10') return value < 10_000
  if (filter === '10-25') return value >= 10_000 && value < 25_000
  if (filter === '25-50') return value >= 25_000 && value < 50_000
  if (filter === '50-plus') return value >= 50_000
  return true
}

function probabilityMatch(probability: number, filter: string) {
  if (filter === 'under-40') return probability < 40
  if (filter === '40-69') return probability >= 40 && probability < 70
  if (filter === '70-plus') return probability >= 70
  return true
}

export function filterOpportunities(opportunities: Opportunity[], search: string, query: PipelineQuery) {
  const needle = search.trim().toLowerCase()
  return opportunities.filter((item) => {
    if (query.stage !== 'all' && item.stageId !== query.stage) return false
    if (query.owner !== 'all' && item.ownerId !== query.owner) return false
    if (query.priority !== 'all' && item.priority !== query.priority) return false
    if (query.company !== 'all' && item.company !== query.company) return false
    if (!valueMatch(item.value, query.value)) return false
    if (!probabilityMatch(item.probability, query.probability)) return false
    if (!closeMatch(item.expectedCloseDate, query.close)) return false
    if (!needle) return true
    const haystack = [item.name, item.company, item.contact, item.owner, item.contactEmail].join(' ').toLowerCase()
    return haystack.includes(needle)
  })
}

export function sortOpportunities(opportunities: Opportunity[], sort: string) {
  const rows = [...opportunities]
  rows.sort((a, b) => {
    if (sort === 'value-asc') return a.value - b.value
    if (sort === 'probability-desc') return b.probability - a.probability || b.value - a.value
    if (sort === 'probability-asc') return a.probability - b.probability || a.value - b.value
    if (sort === 'close') return a.expectedCloseDate.localeCompare(b.expectedCloseDate)
    if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
    if (sort === 'oldest') return a.createdAt.localeCompare(b.createdAt)
    if (sort === 'company') return a.company.localeCompare(b.company) || a.name.localeCompare(b.name)
    return b.value - a.value
  })
  return rows
}

export function stageLabel(stageId: string) {
  if (stageId in stageCatalog) return stageCatalog[stageId as keyof typeof stageCatalog].name
  return stageId
}

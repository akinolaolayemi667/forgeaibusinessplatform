export { seedOpportunities } from '@/data/pipeline/opportunities'
export { seedOpportunityActivities, seedOpportunityNotes, seedOpportunityTasks } from '@/data/pipeline/opportunityActivities'
export { pipelineMetrics, stageBreakdown, type PipelineMetrics, type StageBreakdownRow } from '@/data/pipeline/pipelineMetrics'
export {
  isOpenStage,
  isPipelineStage,
  openStageOrder,
  pipelineHistory,
  pipelineStageOrder,
  progressStageOrder,
  stageCatalog,
  type PipelineStage,
  type PipelineStageId,
} from '@/data/pipeline/pipelineStages'
export { filterOpportunities, initialPipelineQuery, pipelineFiltersActive, sortOpportunities, stageLabel, type PipelineQuery } from '@/data/pipeline/query'
export {
  companyIdFor,
  contactIdFor,
  lossReasons,
  opportunityPriorities,
  opportunitySources,
  ownerName,
  pipelineOwners,
  weightedValue,
  type LossReason,
  type Opportunity,
  type OpportunityActivity,
  type OpportunityActivityType,
  type OpportunityDraft,
  type OpportunityNote,
  type OpportunityPriority,
  type OpportunitySource,
  type OpportunityTask,
  type PipelineOwnerId,
} from '@/data/pipeline/pipelineTypes'

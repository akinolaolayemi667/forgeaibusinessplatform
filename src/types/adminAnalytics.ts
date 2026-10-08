export type AnalyticsSource = 'live' | 'demo'

export type AnalyticsRange = '7d' | '30d' | '90d' | '12m'

export type DeltaTone = 'positive' | 'negative' | 'neutral'

export type AnalyticsCategory = 'CRM' | 'SALES' | 'AUTOMATION' | 'AI' | 'TEAM' | 'SYSTEM'

export type AnalyticsKpi = {
  id: string
  label: string
  value: string
  delta: string
  comparison: string
  tone: DeltaTone
  description: string
  source: AnalyticsSource
}

export type RevenuePoint = {
  label: string
  revenue: number
  pipeline: number
}

export type CountPoint = {
  label: string
  value: number
}

export type FunnelStage = {
  id: string
  label: string
  count: number
  share: number
  conversionToNext: number | null
}

export type PipelineStageRow = {
  id: string
  stage: string
  opportunities: number
  value: number
  weighted: number
}

export type PipelineHealthMetric = {
  id: string
  label: string
  value: string
}

export type TeamPerformanceRow = {
  id: string
  name: string
  email: string
  role: string
  status: string
  joined: string
  avatarUrl: string | null
}

export type AutomationStatusSlice = {
  id: 'success' | 'failed' | 'paused'
  label: string
  value: number
}

export type ActivityEvent = {
  id: string
  time: string
  actor: string
  event: string
  category: AnalyticsCategory
  status: string
}

export type AnalyticsInsight = {
  id: string
  text: string
}

export type AdminAnalyticsModel = {
  range: AnalyticsRange
  kpis: AnalyticsKpi[]
  revenue: RevenuePoint[]
  revenueHasRecords: boolean
  funnel: FunnelStage[]
  pipelineMetrics: PipelineHealthMetric[]
  pipelineStages: PipelineStageRow[]
  pipelineHasRecords: boolean
  team: TeamPerformanceRow[]
  automation: {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    successRate: number | null
    averageExecution: string
    mostActive: string
    dated: false
    status: AutomationStatusSlice[]
  }
  ai: {
    runs: number
    assistedLeads: string
    generatedTasks: string
    generatedOutreach: number
    estimatedUsage: string
    dated: false
    series: CountPoint[]
  }
  conversations: {
    total: number
    open: number
    resolved: string
    averageResponse: string
    aiAssisted: string
    series: CountPoint[]
    hasRecords: boolean
  }
  activity: ActivityEvent[]
  insights: AnalyticsInsight[]
}

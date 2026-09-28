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

/** Entity reads for FORGE. Swap this implementation for Supabase or HTTP without rewriting pages. */
export interface ForgeDataSource {
  listWorkspaces(): Promise<Workspace[]>
  listHomePoints(): Promise<HomePoint[]>
  listFeatures(): Promise<FeatureArea[]>
  listPlans(): Promise<Plan[]>
  getArchitecture(): Promise<ArchitectureLayer[]>
  getCaseStudy(): Promise<CaseStudy>
  listMetrics(workspaceId: string): Promise<Metric[]>
  listChart(workspaceId: string): Promise<ChartPoint[]>
  listLeads(workspaceId: string): Promise<Lead[]>
  listContacts(workspaceId: string): Promise<Contact[]>
  listDeals(workspaceId: string): Promise<Deal[]>
  listConversations(workspaceId: string): Promise<Conversation[]>
  listAutomations(workspaceId: string): Promise<Automation[]>
  listBriefings(workspaceId: string): Promise<Briefing[]>
  listIntegrations(workspaceId: string): Promise<Integration[]>
  listTeam(workspaceId: string): Promise<TeamMember[]>
  getBilling(workspaceId: string): Promise<BillingSnapshot>
}

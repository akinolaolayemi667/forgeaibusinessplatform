import { motion, useReducedMotion } from 'framer-motion'
import { forgeData } from '@/data'
import { ProductPreview } from '@/components/marketing/ProductPreview'
import {
  AiSection,
  AnalyticsSection,
  AutomationSection,
  ClosingCta,
  CrmSection,
  IntegrationsSection,
  PlatformSection,
  ProblemSection,
  SolutionSection,
  TechnologyStrip,
  WorkflowSection,
} from '@/components/marketing/HomeSections'
import type { HomeBundle } from '@/components/marketing/homeModel'
import { frame } from '@/components/marketing/primitives'
import { buttonStyles } from '@/components/ui/Button'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function HomePage() {
  const reduce = useReducedMotion()
  const { workspace } = useWorkspace()
  const preview = useAsyncData(`home:${workspace.id}`, () => loadHome(workspace.id))

  return (
    <div className="flex flex-col">
      <section aria-labelledby="home-title" className={`${frame} flex flex-col gap-10 py-12 sm:py-16`}>
        <motion.div
          className="flex flex-col gap-5"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
        >
          <p className="type-kicker text-muted">AI business automation platform</p>
          <h1 id="home-title" className="max-w-5xl font-display text-[1.7rem] text-copy sm:text-5xl lg:text-[3.25rem]">
            AUTOMATE THE WORK.
            <br />
            ACCELERATE THE BUSINESS.
          </h1>
        </motion.div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)] lg:gap-10">
          <div className="flex flex-col gap-5">
            <p className="max-w-xl text-base text-muted">
              FORGE connects CRM, AI, communication and workflow automation into one intelligent business operating system.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a href="#platform" className={buttonStyles('primary', 'lg', 'w-full tracking-[0.06em] sm:w-auto')}>
                EXPLORE THE PLATFORM
              </a>
              <a href="#workflow" className={buttonStyles('outline', 'lg', 'w-full tracking-[0.06em] sm:w-auto')}>
                VIEW HOW IT WORKS
              </a>
            </div>
          </div>
          <ProductPreview
            workspaceName={workspace.name}
            bundle={preview.data}
            loading={preview.loading}
            error={preview.error}
          />
        </div>
      </section>
      <TechnologyStrip />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection query={preview} />
      <CrmSection query={preview} />
      <AiSection query={preview} />
      <AutomationSection query={preview} />
      <AnalyticsSection query={preview} />
      <IntegrationsSection query={preview} />
      <WorkflowSection query={preview} />
      <ClosingCta />
    </div>
  )
}

function loadHome(workspaceId: string): Promise<HomeBundle> {
  return Promise.all([
    forgeData.listFeatures(),
    forgeData.listLeads(workspaceId),
    forgeData.listDeals(workspaceId),
    forgeData.listConversations(workspaceId),
    forgeData.listAutomations(workspaceId),
    forgeData.listBriefings(workspaceId),
    forgeData.listMetrics(workspaceId),
    forgeData.listChart(workspaceId),
    forgeData.listIntegrations(workspaceId),
  ]).then(([features, leads, deals, conversations, automations, briefings, metrics, chart, integrations]) => ({
    features,
    leads,
    deals,
    conversations,
    automations,
    briefings,
    metrics,
    chart,
    integrations,
  }))
}

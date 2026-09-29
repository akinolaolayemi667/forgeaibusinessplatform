import { forgeData } from '@/data'
import { BriefingPanel } from '@/components/ai/BriefingPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function AiPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`briefings:${workspace.id}`, () => forgeData.listBriefings(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="AI Assistant"
        title="Briefing"
        description="A short read of one account before anyone writes back."
      />
      <QueryState loading={query.loading} error={query.error}>
        <BriefingPanel briefings={query.data ?? []} />
      </QueryState>
    </div>
  )
}

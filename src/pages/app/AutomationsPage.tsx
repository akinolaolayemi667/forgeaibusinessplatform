import { forgeData } from '@/data'
import { AutomationTable } from '@/components/automation/AutomationTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function AutomationsPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`automations:${workspace.id}`, () => forgeData.listAutomations(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Motion"
        title="Automations"
        description="Rules that move records, with a run count you can read before editing them."
      />
      <QueryState loading={query.loading} error={query.error}>
        <AutomationTable rows={query.data ?? []} />
      </QueryState>
    </div>
  )
}

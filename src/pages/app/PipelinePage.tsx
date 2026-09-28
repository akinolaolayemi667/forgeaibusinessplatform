import { forgeData } from '@/data'
import { DealTable } from '@/components/crm/DealTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function PipelinePage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`deals:${workspace.id}`, () => forgeData.listDeals(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Pipeline"
        description="Open deals by stage and value. A board view can come later without changing this data."
      />
      <QueryState loading={query.loading} error={query.error}>
        <DealTable rows={query.data ?? []} />
      </QueryState>
    </div>
  )
}

import { forgeData } from '@/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type Column } from '@/components/ui/Table'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { Integration } from '@/types'

const columns: Column<Integration>[] = [
  { id: 'name', header: 'Integration', cell: (row) => row.name },
  { id: 'category', header: 'Category', cell: (row) => row.category },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  { id: 'owner', header: 'Owner', cell: (row) => row.owner },
]

export function IntegrationsPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`integrations:${workspace.id}`, () => forgeData.listIntegrations(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Connections"
        title="Integrations"
        description="Tools this workspace can read from. Connecting a live account is a later phase."
      />
      <QueryState loading={query.loading} error={query.error}>
        <Table caption="Integrations" columns={columns} rows={query.data ?? []} getRowId={(row) => row.id} />
      </QueryState>
    </div>
  )
}

import { forgeData } from '@/data'
import { Avatar } from '@/components/ui/Avatar'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type Column } from '@/components/ui/Table'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { TeamMember } from '@/types'

const columns: Column<TeamMember>[] = [
  {
    id: 'name',
    header: 'Member',
    cell: (row) => (
      <span className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" />
        <span>{row.name}</span>
      </span>
    ),
  },
  { id: 'email', header: 'Email', cell: (row) => row.email },
  { id: 'role', header: 'Role', cell: (row) => <StatusBadge status={row.role} /> },
  { id: 'focus', header: 'Focus', cell: (row) => row.focus },
]

export function TeamPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`team:${workspace.id}`, () => forgeData.listTeam(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="People" title="Team" description={`Operators on the ${workspace.name} sample roster.`} />
      <QueryState loading={query.loading} error={query.error}>
        <Table caption="Team" columns={columns} rows={query.data ?? []} getRowId={(row) => row.id} />
      </QueryState>
    </div>
  )
}

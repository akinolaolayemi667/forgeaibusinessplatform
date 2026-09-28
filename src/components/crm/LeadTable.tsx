import type { Lead } from '@/types'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type Column } from '@/components/ui/Table'

const columns: Column<Lead>[] = [
  {
    id: 'name',
    header: 'Lead',
    cell: (row) => (
      <span className="flex flex-col">
        <span>{row.name}</span>
        <span className="text-muted">{row.email}</span>
      </span>
    ),
  },
  { id: 'company', header: 'Company', cell: (row) => row.company },
  { id: 'source', header: 'Source', cell: (row) => row.source },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  { id: 'score', header: 'Score', align: 'right', cell: (row) => row.score },
  { id: 'owner', header: 'Owner', cell: (row) => row.owner },
]

export function LeadTable({ rows }: { rows: Lead[] }) {
  return (
    <Table
      caption="Leads"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      empty={<EmptyState title="No matching leads" description="Try another name or company, or clear the search." />}
    />
  )
}

import type { Deal } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type Column } from '@/components/ui/Table'
import { formatCurrency, formatDate } from '@/utils/format'

const columns: Column<Deal>[] = [
  {
    id: 'name',
    header: 'Deal',
    cell: (row) => (
      <span className="flex flex-col">
        <span>{row.name}</span>
        <span className="text-muted">{row.company}</span>
      </span>
    ),
  },
  { id: 'stage', header: 'Stage', cell: (row) => <StatusBadge status={row.stage} /> },
  { id: 'value', header: 'Value', align: 'right', cell: (row) => formatCurrency(row.value) },
  { id: 'owner', header: 'Owner', cell: (row) => row.owner },
  { id: 'close', header: 'Close', cell: (row) => formatDate(row.closeDate) },
]

export function DealTable({ rows }: { rows: Deal[] }) {
  return <Table caption="Pipeline" columns={columns} rows={rows} getRowId={(row) => row.id} />
}

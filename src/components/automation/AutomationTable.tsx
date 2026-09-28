import type { Automation } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table, type Column } from '@/components/ui/Table'

const columns: Column<Automation>[] = [
  { id: 'name', header: 'Automation', cell: (row) => row.name },
  { id: 'trigger', header: 'Trigger', cell: (row) => row.trigger },
  { id: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  { id: 'runs', header: 'Runs', align: 'right', cell: (row) => row.runs },
]

export function AutomationTable({ rows }: { rows: Automation[] }) {
  return <Table caption="Automations" columns={columns} rows={rows} getRowId={(row) => row.id} />
}

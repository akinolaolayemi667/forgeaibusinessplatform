import type { Contact } from '@/types'
import { Table, type Column } from '@/components/ui/Table'
import { formatDate } from '@/utils/format'

const columns: Column<Contact>[] = [
  {
    id: 'name',
    header: 'Contact',
    cell: (row) => (
      <span className="flex flex-col">
        <span>{row.name}</span>
        <span className="text-muted">{row.email}</span>
      </span>
    ),
  },
  { id: 'title', header: 'Title', cell: (row) => row.title },
  { id: 'company', header: 'Company', cell: (row) => row.company },
  { id: 'activity', header: 'Last activity', cell: (row) => formatDate(row.lastActivity) },
]

export function ContactTable({ rows }: { rows: Contact[] }) {
  return <Table caption="Contacts" columns={columns} rows={rows} getRowId={(row) => row.id} />
}

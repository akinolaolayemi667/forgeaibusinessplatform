import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'

export type Column<T> = {
  id: string
  header: string
  align?: 'left' | 'right'
  cell: (row: T) => ReactNode
}

type TableProps<T> = {
  caption: string
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  empty?: ReactNode
}

export function Table<T>({ caption, columns, rows, getRowId, empty }: TableProps<T>) {
  if (rows.length === 0) {
    return empty ?? <EmptyState title="Nothing in this view" description="No records match the current workspace." />
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-stroke bg-surface-raised">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'border-b border-stroke px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] whitespace-nowrap text-muted uppercase',
                  column.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)} className="hover:bg-wash [&>td]:border-b [&>td]:border-stroke last:[&>td]:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn(
                    'px-3 py-3 align-middle text-copy',
                    column.align === 'right' && 'type-data text-right',
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

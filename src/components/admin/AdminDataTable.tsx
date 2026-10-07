import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AdminColumn<T> = {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

export function AdminDataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
  minWidthClass = 'min-w-[44rem]',
  overflowClass = 'overflow-x-auto',
  onRowClick,
}: {
  caption: string
  columns: AdminColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty: string
  minWidthClass?: string
  overflowClass?: string
  onRowClick?: (row: T) => void
}) {
  return (
    <div className={cn(overflowClass, 'border border-stroke bg-surface-raised')}>
      <table className={cn('w-full border-collapse text-left text-sm', minWidthClass)}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-stroke">
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cn('type-kicker px-4 py-3 font-medium text-ash', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-sm text-ash">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className={cn('border-b border-stroke last:border-b-0', onRowClick && 'cursor-pointer hover:bg-wash')}
                onClick={
                  onRowClick
                    ? (event) => {
                        const target = event.target
                        if (target instanceof Element && target.closest('button, a, input, select')) return
                        onRowClick(row)
                      }
                    : undefined
                }
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' && event.target === event.currentTarget) onRowClick(row)
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3 align-middle text-stone', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

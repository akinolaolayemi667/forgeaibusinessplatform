import type { ReactNode } from 'react'

export type AdminColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export function AdminDataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
}: {
  caption: string
  columns: AdminColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty: string
}) {
  return (
    <div className="overflow-x-auto border border-stroke bg-surface-raised">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-stroke">
            {columns.map((column) => (
              <th key={column.key} scope="col" className="type-kicker px-4 py-3 font-medium text-ash">
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
              <tr key={rowKey(row)} className="border-b border-stroke last:border-b-0">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle text-stone">
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

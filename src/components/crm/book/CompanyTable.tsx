import { CompanyCard, CompanyRow } from '@/components/crm/book/CompanyRow'
import { CRMEmptyState } from '@/components/crm/book/CRMEmptyState'
import { Button } from '@/components/ui/Button'
import type { CrmCompany } from '@/data/crm'

export function CompanyTable({
  rows,
  filteredEmpty,
  onClear,
}: {
  rows: CrmCompany[]
  filteredEmpty: boolean
  onClear: () => void
}) {
  if (rows.length === 0) {
    return (
      <CRMEmptyState
        title={filteredEmpty ? 'No companies found' : 'No companies yet'}
        description={filteredEmpty ? 'Try adjusting your search or filters.' : 'Add the organization behind a relationship.'}
        action={
          filteredEmpty ? (
            <Button variant="outline" onClick={onClear}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden overflow-x-auto border border-stroke bg-surface-raised md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stroke">
              {['Company', 'Industry', 'Contacts', 'Owner', 'Status', 'Last activity'].map((label) => (
                <th
                  key={label}
                  className={
                    label === 'Contacts'
                      ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase sm:table-cell'
                      : label === 'Owner'
                        ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase md:table-cell'
                        : label === 'Last activity'
                          ? 'hidden px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase lg:table-cell'
                          : 'px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase'
                  }
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((company) => (
          <li key={company.id}>
            <CompanyCard company={company} />
          </li>
        ))}
      </ul>
    </div>
  )
}

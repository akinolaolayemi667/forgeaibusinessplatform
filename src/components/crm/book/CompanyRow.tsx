import { Link } from 'react-router-dom'
import { CompanyStatusBadge } from '@/components/crm/book/ContactStatus'
import { formatActivityWhen, type CrmCompany } from '@/data/crm'

export function CompanyRow({ company }: { company: CrmCompany }) {
  return (
    <tr className="border-b border-stroke last:border-b-0 hover:bg-wash">
      <td className="px-3 py-3">
        <Link to={`/app/crm/companies/${company.id}`} className="font-medium text-copy no-underline hover:text-ember">
          {company.name}
        </Link>
      </td>
      <td className="px-3 py-3 text-sm text-muted">{company.industry}</td>
      <td className="hidden px-3 py-3 text-sm text-copy sm:table-cell">{company.contactCount}</td>
      <td className="hidden px-3 py-3 text-sm text-muted md:table-cell">{company.owner}</td>
      <td className="px-3 py-3">
        <CompanyStatusBadge status={company.status} />
      </td>
      <td className="hidden px-3 py-3 text-sm text-muted lg:table-cell">{formatActivityWhen(company.lastActivityAt)}</td>
    </tr>
  )
}

export function CompanyCard({ company }: { company: CrmCompany }) {
  return (
    <article className="border border-stroke bg-surface-raised p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/app/crm/companies/${company.id}`} className="font-medium text-copy no-underline hover:text-ember">
            {company.name}
          </Link>
          <p className="text-sm text-muted">{company.industry}</p>
        </div>
        <CompanyStatusBadge status={company.status} />
      </div>
      <p className="mt-3 text-sm text-muted">
        {company.contactCount} contacts · {company.owner}
      </p>
    </article>
  )
}

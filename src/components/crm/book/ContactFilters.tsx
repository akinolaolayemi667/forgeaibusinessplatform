import { FieldSelect } from '@/components/crm/book/fields'
import { crmOwners, crmStatuses, type CrmCompany } from '@/data/crm'

export type ContactQuery = {
  status: string
  owner: string
  companyId: string
  tag: string
  activity: string
  sort: string
}

export function ContactFilters({
  query,
  companies,
  tags,
  onChange,
}: {
  query: ContactQuery
  companies: CrmCompany[]
  tags: string[]
  onChange: (patch: Partial<ContactQuery>) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <FieldSelect id="filter-status" label="Status" value={query.status} onChange={(status) => onChange({ status })}>
        <option value="all">All statuses</option>
        {crmStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect id="filter-owner" label="Owner" value={query.owner} onChange={(owner) => onChange({ owner })}>
        <option value="all">All owners</option>
        {crmOwners.map((owner) => (
          <option key={owner} value={owner}>
            {owner}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect id="filter-company" label="Company" value={query.companyId} onChange={(companyId) => onChange({ companyId })}>
        <option value="all">All companies</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect id="filter-tag" label="Tags" value={query.tag} onChange={(tag) => onChange({ tag })}>
        <option value="all">All tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect id="filter-activity" label="Last activity" value={query.activity} onChange={(activity) => onChange({ activity })}>
        <option value="any">Any time</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="week">This week</option>
      </FieldSelect>
      <FieldSelect id="filter-sort" label="Sort" value={query.sort} onChange={(sort) => onChange({ sort })}>
        <option value="active">Recently active</option>
        <option value="added">Recently added</option>
        <option value="az">Name A–Z</option>
        <option value="za">Name Z–A</option>
      </FieldSelect>
    </div>
  )
}

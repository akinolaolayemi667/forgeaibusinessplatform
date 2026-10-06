import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { leadOwners, leadSourceNames, leadStatuses } from '@/data/leads'

export type LeadQuery = {
  status: string
  score: string
  source: string
  owner: string
  company: string
  created: string
  activity: string
  sort: string
}

export function leadFiltersActive(query: LeadQuery, search: string) {
  return (
    search.trim().length > 0 ||
    query.status !== 'all' ||
    query.score !== 'all' ||
    query.source !== 'all' ||
    query.owner !== 'all' ||
    query.company !== 'all' ||
    query.created !== 'any' ||
    query.activity !== 'any'
  )
}

export function LeadFilters({
  query,
  companies,
  active,
  onChange,
  onClear,
}: {
  query: LeadQuery
  companies: string[]
  active: boolean
  onChange: (patch: Partial<LeadQuery>) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <FieldSelect id="lead-filter-status" label="Status" value={query.status} onChange={(status) => onChange({ status })}>
          <option value="all">All statuses</option>
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-filter-score" label="Lead score" value={query.score} onChange={(score) => onChange({ score })}>
          <option value="all">All scores</option>
          <option value="hot">Hot 75–100</option>
          <option value="warm">Warm 50–74</option>
          <option value="cold">Cold 0–49</option>
        </FieldSelect>
        <FieldSelect id="lead-filter-source" label="Source" value={query.source} onChange={(source) => onChange({ source })}>
          <option value="all">All sources</option>
          {leadSourceNames.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-filter-owner" label="Owner" value={query.owner} onChange={(owner) => onChange({ owner })}>
          <option value="all">All owners</option>
          {leadOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-filter-company" label="Company" value={query.company} onChange={(company) => onChange({ company })}>
          <option value="all">All companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-filter-created" label="Created date" value={query.created} onChange={(created) => onChange({ created })}>
          <option value="any">Any time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </FieldSelect>
        <FieldSelect id="lead-filter-activity" label="Last activity" value={query.activity} onChange={(activity) => onChange({ activity })}>
          <option value="any">Any time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This week</option>
        </FieldSelect>
        <FieldSelect id="lead-filter-sort" label="Sort" value={query.sort} onChange={(sort) => onChange({ sort })}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="score-desc">Highest score</option>
          <option value="score-asc">Lowest score</option>
          <option value="active">Recently active</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </FieldSelect>
      </div>
      {active ? (
        <div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}

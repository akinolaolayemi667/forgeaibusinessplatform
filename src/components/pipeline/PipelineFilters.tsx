import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { opportunityPriorities, pipelineOwners, pipelineStageOrder, stageCatalog, type PipelineQuery } from '@/data/pipeline'

export function PipelineFilters({
  query,
  companies,
  active,
  onChange,
  onClear,
}: {
  query: PipelineQuery
  companies: string[]
  active: boolean
  onChange: (patch: Partial<PipelineQuery>) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <FieldSelect id="pipe-filter-stage" label="Stage" value={query.stage} onChange={(stage) => onChange({ stage })}>
          <option value="all">All stages</option>
          {pipelineStageOrder.map((stage) => (
            <option key={stage} value={stage}>
              {stageCatalog[stage].name}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-filter-owner" label="Owner" value={query.owner} onChange={(owner) => onChange({ owner })}>
          <option value="all">All owners</option>
          {pipelineOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-filter-value" label="Value" value={query.value} onChange={(value) => onChange({ value })}>
          <option value="any">Any value</option>
          <option value="under-10">Under $10K</option>
          <option value="10-25">$10K–$25K</option>
          <option value="25-50">$25K–$50K</option>
          <option value="50-plus">$50K and above</option>
        </FieldSelect>
        <FieldSelect id="pipe-filter-probability" label="Probability" value={query.probability} onChange={(probability) => onChange({ probability })}>
          <option value="any">Any probability</option>
          <option value="under-40">Under 40%</option>
          <option value="40-69">40–69%</option>
          <option value="70-plus">70% and above</option>
        </FieldSelect>
        <FieldSelect id="pipe-filter-priority" label="Priority" value={query.priority} onChange={(priority) => onChange({ priority })}>
          <option value="all">All priorities</option>
          {opportunityPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-filter-close" label="Close date" value={query.close} onChange={(close) => onChange({ close })}>
          <option value="any">Any close date</option>
          <option value="overdue">Overdue</option>
          <option value="week">Next 7 days</option>
          <option value="30">Next 30 days</option>
          <option value="month">This month</option>
        </FieldSelect>
        <FieldSelect id="pipe-filter-company" label="Company" value={query.company} onChange={(company) => onChange({ company })}>
          <option value="all">All companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-filter-sort" label="Sort" value={query.sort} onChange={(sort) => onChange({ sort })}>
          <option value="value-desc">Highest value</option>
          <option value="value-asc">Lowest value</option>
          <option value="probability-desc">Highest probability</option>
          <option value="probability-asc">Lowest probability</option>
          <option value="close">Closest close date</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="company">Company A–Z</option>
        </FieldSelect>
      </div>
      {active ? (
        <div>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}

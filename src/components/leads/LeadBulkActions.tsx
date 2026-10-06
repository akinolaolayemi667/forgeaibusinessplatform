import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { leadOwners, leadStatuses, type LeadStatus } from '@/data/leads'

export function LeadBulkActions({
  count,
  onStatus,
  onAssign,
  onTag,
  onQualify,
  onClear,
}: {
  count: number
  onStatus: (status: LeadStatus) => void
  onAssign: (owner: string) => void
  onTag: () => void
  onQualify: () => void
  onClear: () => void
}) {
  if (count === 0) return null
  return (
    <div className="flex flex-col gap-3 border border-stroke bg-surface-raised px-3 py-3 sm:flex-row sm:items-center">
      <p className="text-sm text-copy">{count} selected</p>
      <div className="flex flex-1 flex-wrap gap-2">
        <FieldSelect id="lead-bulk-status" label="Change status" hideLabel value="" onChange={(value) => value && onStatus(value as LeadStatus)}>
          <option value="">Change status</option>
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-bulk-owner" label="Assign owner" hideLabel value="" onChange={(value) => value && onAssign(value)}>
          <option value="">Assign owner</option>
          {leadOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </FieldSelect>
        <Button variant="outline" size="sm" onClick={onTag}>
          Add tag
        </Button>
        <Button variant="outline" size="sm" onClick={onQualify}>
          Qualify
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear selection
      </Button>
    </div>
  )
}

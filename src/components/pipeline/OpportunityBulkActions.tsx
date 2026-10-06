import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { openStageOrder, opportunityPriorities, pipelineOwners, stageCatalog, type OpportunityPriority, type PipelineStageId } from '@/data/pipeline'

export function OpportunityBulkActions({
  count,
  onStage,
  onAssign,
  onPriority,
  onClear,
}: {
  count: number
  onStage: (stageId: PipelineStageId) => void
  onAssign: (ownerId: string) => void
  onPriority: (priority: OpportunityPriority) => void
  onClear: () => void
}) {
  if (count === 0) return null
  return (
    <div className="flex flex-col gap-3 border border-stroke bg-surface-raised px-3 py-3 sm:flex-row sm:items-center">
      <p className="text-sm text-copy">
        {count} {count === 1 ? 'opportunity' : 'opportunities'} selected
      </p>
      <div className="flex flex-1 flex-wrap gap-2">
        <FieldSelect id="pipe-bulk-stage" label="Move stage" hideLabel value="" onChange={(value) => value && onStage(value as PipelineStageId)}>
          <option value="">Move stage</option>
          {openStageOrder.map((stage) => (
            <option key={stage} value={stage}>
              {stageCatalog[stage].name}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-bulk-owner" label="Assign owner" hideLabel value="" onChange={(value) => value && onAssign(value)}>
          <option value="">Assign owner</option>
          {pipelineOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="pipe-bulk-priority" label="Set priority" hideLabel value="" onChange={(value) => value && onPriority(value as OpportunityPriority)}>
          <option value="">Set priority</option>
          {opportunityPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </FieldSelect>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}

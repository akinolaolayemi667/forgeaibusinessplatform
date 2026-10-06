import { FieldSelect } from '@/components/crm/book/fields'
import { pipelineStageOrder, stageCatalog, type PipelineStageId } from '@/data/pipeline'

export function OpportunityStageControl({
  id,
  stageId,
  label = 'Move stage',
  hideLabel = false,
  onChange,
}: {
  id: string
  stageId: PipelineStageId
  label?: string
  hideLabel?: boolean
  onChange: (stageId: PipelineStageId) => void
}) {
  return (
    <FieldSelect id={id} label={label} hideLabel={hideLabel} value={stageId} onChange={(value) => onChange(value as PipelineStageId)}>
      {pipelineStageOrder.map((stage) => (
        <option key={stage} value={stage}>
          {stageCatalog[stage].name}
        </option>
      ))}
    </FieldSelect>
  )
}

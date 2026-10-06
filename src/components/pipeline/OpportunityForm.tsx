import { useState, type FormEvent } from 'react'
import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import {
  isPipelineStage,
  lossReasons,
  opportunityPriorities,
  opportunitySources,
  pipelineOwners,
  pipelineStageOrder,
  stageCatalog,
  type LossReason,
  type Opportunity,
  type OpportunityDraft,
  type OpportunityPriority,
  type OpportunitySource,
  type PipelineStageId,
} from '@/data/pipeline'

function dateInput(iso: string) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

function defaultClose() {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function opportunityToDraft(opportunity: Opportunity): OpportunityDraft {
  return {
    name: opportunity.name,
    company: opportunity.company,
    contact: opportunity.contact,
    contactEmail: opportunity.contactEmail,
    contactPhone: opportunity.contactPhone,
    value: opportunity.value,
    probability: opportunity.probability,
    stageId: opportunity.stageId,
    ownerId: opportunity.ownerId,
    expectedCloseDate: opportunity.expectedCloseDate,
    source: opportunity.source,
    priority: opportunity.priority,
    tags: opportunity.tags,
    notes: '',
    lossReason: opportunity.lossReason,
  }
}

export function OpportunityForm({
  initial,
  mode,
  onSubmit,
  onCancel,
}: {
  initial?: OpportunityDraft
  mode: 'create' | 'edit'
  onSubmit: (draft: OpportunityDraft) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [company, setCompany] = useState(initial?.company ?? '')
  const [contact, setContact] = useState(initial?.contact ?? '')
  const [email, setEmail] = useState(initial?.contactEmail ?? '')
  const [phone, setPhone] = useState(initial?.contactPhone ?? '')
  const [value, setValue] = useState(initial ? String(initial.value) : '')
  const [probability, setProbability] = useState(initial ? String(initial.probability) : '20')
  const [stageId, setStageId] = useState<PipelineStageId>(initial?.stageId ?? 'new')
  const [ownerId, setOwnerId] = useState(initial?.ownerId ?? pipelineOwners[0].id)
  const [close, setClose] = useState(initial ? dateInput(initial.expectedCloseDate) : defaultClose())
  const [source, setSource] = useState<OpportunitySource>(initial?.source ?? 'Website')
  const [priority, setPriority] = useState<OpportunityPriority>(initial?.priority ?? 'Medium')
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [notes, setNotes] = useState('')
  const [lossReason, setLossReason] = useState<LossReason>(initial?.lossReason ?? 'Budget')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Enter an opportunity name.'
    if (!company.trim()) next.company = 'Enter a company.'
    const amount = Number(value)
    if (!value.trim() || !Number.isFinite(amount) || amount <= 0) next.value = 'Enter a deal value greater than zero.'
    const chance = Number(probability)
    if (!probability.trim() || !Number.isFinite(chance) || chance < 0 || chance > 100) next.probability = 'Enter a probability from 0 to 100.'
    if (stageId === 'lost' && !lossReason) next.lossReason = 'Choose a loss reason.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    const closeDate = close || defaultClose()
    onSubmit({
      name: name.trim(),
      company: company.trim(),
      contact: contact.trim(),
      contactEmail: email.trim(),
      contactPhone: phone.trim(),
      value: amount,
      probability: chance,
      stageId,
      ownerId,
      expectedCloseDate: `${closeDate}T12:00:00`,
      source,
      priority,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: mode === 'create' ? notes : '',
      lossReason: stageId === 'lost' ? lossReason : null,
    })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
      <TextField id="opp-name" label="Opportunity name" value={name} error={errors.name} onChange={setName} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="opp-company" label="Company" value={company} error={errors.company} onChange={setCompany} />
        <TextField id="opp-contact" label="Primary contact" value={contact} onChange={setContact} />
        <TextField id="opp-email" label="Email" value={email} onChange={setEmail} />
        <TextField id="opp-phone" label="Phone" value={phone} onChange={setPhone} />
        <TextField id="opp-value" label="Deal value" value={value} error={errors.value} onChange={setValue} />
        <TextField id="opp-probability" label="Probability" value={probability} error={errors.probability} hint="0–100" onChange={setProbability} />
        <FieldSelect
          id="opp-stage"
          label="Stage"
          value={stageId}
          onChange={(next) => {
            if (isPipelineStage(next)) setStageId(next)
          }}
        >
          {pipelineStageOrder.map((stage) => (
            <option key={stage} value={stage}>
              {stageCatalog[stage].name}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="opp-owner" label="Owner" value={ownerId} onChange={setOwnerId}>
          {pipelineOwners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </FieldSelect>
        <TextField id="opp-close" label="Expected close date" type="date" value={close} onChange={setClose} />
        <FieldSelect id="opp-source" label="Source" value={source} onChange={(next) => setSource(next as OpportunitySource)}>
          {opportunitySources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="opp-priority" label="Priority" value={priority} onChange={(next) => setPriority(next as OpportunityPriority)}>
          {opportunityPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
        {stageId === 'lost' ? (
          <FieldSelect id="opp-loss" label="Loss reason" value={lossReason} onChange={(next) => setLossReason(next as LossReason)}>
            {lossReasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FieldSelect>
        ) : null}
      </div>
      <TextField id="opp-tags" label="Tags" value={tags} hint="Separate tags with commas." onChange={setTags} />
      {mode === 'create' ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="opp-notes" className="text-sm font-medium text-copy">
            Notes
          </label>
          <textarea
            id="opp-notes"
            value={notes}
            rows={3}
            onChange={(event) => setNotes(event.target.value)}
            className="rounded-sm border border-stroke bg-surface px-3 py-2 text-sm text-copy outline-none focus-visible:border-ember"
          />
        </div>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'create' ? 'Create opportunity' : 'Save changes'}</Button>
      </div>
    </form>
  )
}

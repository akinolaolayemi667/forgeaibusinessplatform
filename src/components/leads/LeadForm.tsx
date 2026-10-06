import { useState, type FormEvent } from 'react'
import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { leadOwners, leadSourceNames, leadStatuses, type LeadDraft, type LeadSourceName, type LeadStatus, type SalesLead } from '@/data/leads'
import { isEmail } from '@/utils/format'

const empty: LeadDraft = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  location: '',
  source: 'Website',
  status: 'New',
  score: 50,
  owner: leadOwners[0],
  tags: [],
  notes: '',
}

export function leadToDraft(lead: SalesLead): LeadDraft {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    title: lead.title,
    location: lead.location,
    source: lead.source,
    status: lead.status,
    score: lead.score,
    owner: lead.owner,
    tags: lead.tags,
    notes: '',
  }
}

export function LeadForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: LeadDraft
  submitLabel: string
  onSubmit: (draft: LeadDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<LeadDraft>(initial ?? empty)
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; score?: string }>({})

  function set<K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = {
      firstName: !draft.firstName.trim() ? 'Enter a first name.' : undefined,
      lastName: !draft.lastName.trim() ? 'Enter a last name.' : undefined,
      email: !draft.email.trim() ? 'Enter an email.' : !isEmail(draft.email) ? 'Enter a valid email.' : undefined,
      score: !Number.isFinite(draft.score) || draft.score < 0 || draft.score > 100 ? 'Enter a score from 0 to 100.' : undefined,
    }
    setErrors(next)
    if (next.firstName || next.lastName || next.email || next.score) return
    onSubmit({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: notes.trim(),
    })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="lead-first" label="First name" value={draft.firstName} error={errors.firstName} onChange={(value) => set('firstName', value)} autoComplete="given-name" />
        <TextField id="lead-last" label="Last name" value={draft.lastName} error={errors.lastName} onChange={(value) => set('lastName', value)} autoComplete="family-name" />
        <TextField id="lead-email" label="Email" type="email" value={draft.email} error={errors.email} onChange={(value) => set('email', value)} autoComplete="email" />
        <TextField id="lead-phone" label="Phone" value={draft.phone} onChange={(value) => set('phone', value)} autoComplete="tel" />
        <TextField id="lead-company" label="Company" value={draft.company} onChange={(value) => set('company', value)} />
        <TextField id="lead-title" label="Job title" value={draft.title} onChange={(value) => set('title', value)} />
        <FieldSelect id="lead-source" label="Lead source" value={draft.source} onChange={(value) => set('source', value as LeadSourceName)}>
          {leadSourceNames.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="lead-status" label="Status" value={draft.status} onChange={(value) => set('status', value as LeadStatus)}>
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
        <TextField
          id="lead-score"
          label="Lead score"
          type="number"
          value={String(draft.score)}
          error={errors.score}
          onChange={(value) => set('score', Number(value))}
        />
        <FieldSelect id="lead-owner" label="Owner" value={draft.owner} onChange={(value) => set('owner', value)}>
          {leadOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </FieldSelect>
        <TextField id="lead-location" label="Location" value={draft.location} onChange={(value) => set('location', value)} className="sm:col-span-2" />
        <TextField id="lead-tags" label="Tags" value={tags} hint="Separate tags with commas." onChange={setTags} className="sm:col-span-2" />
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="lead-notes" className="text-sm font-medium text-copy">
            Notes
          </label>
          <textarea
            id="lead-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="rounded-sm border border-stroke bg-surface px-3 py-2 text-sm text-copy outline-none focus-visible:border-ember"
          />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { FieldSelect } from '@/components/crm/book/fields'
import { crmOwners, crmStatuses, type ContactDraft, type CrmCompany, type CrmStatus } from '@/data/crm'
import { isEmail } from '@/utils/format'

const empty: ContactDraft = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyId: '',
  title: '',
  status: 'New',
  owner: crmOwners[0],
  tags: [],
  location: '',
}

export function ContactForm({
  initial,
  companies,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ContactDraft
  companies: CrmCompany[]
  submitLabel: string
  onSubmit: (draft: ContactDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<ContactDraft>(initial ?? empty)
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({})

  function set<K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = {
      firstName: !draft.firstName.trim() ? 'Enter a first name.' : undefined,
      lastName: !draft.lastName.trim() ? 'Enter a last name.' : undefined,
      email: !draft.email.trim() ? 'Enter an email.' : !isEmail(draft.email) ? 'Enter a valid email.' : undefined,
    }
    setErrors(next)
    if (next.firstName || next.lastName || next.email) return
    onSubmit({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      title: draft.title.trim(),
      location: draft.location.trim(),
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="contact-first" label="First name" value={draft.firstName} error={errors.firstName} onChange={(value) => set('firstName', value)} autoComplete="given-name" />
        <TextField id="contact-last" label="Last name" value={draft.lastName} error={errors.lastName} onChange={(value) => set('lastName', value)} autoComplete="family-name" />
        <TextField id="contact-email" label="Email" type="email" value={draft.email} error={errors.email} onChange={(value) => set('email', value)} autoComplete="email" />
        <TextField id="contact-phone" label="Phone" value={draft.phone} onChange={(value) => set('phone', value)} autoComplete="tel" />
        <FieldSelect id="contact-company" label="Company" value={draft.companyId} onChange={(value) => set('companyId', value)}>
          <option value="">No company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </FieldSelect>
        <TextField id="contact-title" label="Job title" value={draft.title} onChange={(value) => set('title', value)} />
        <FieldSelect id="contact-status" label="Status" value={draft.status} onChange={(value) => set('status', value as CrmStatus)}>
          {crmStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="contact-owner" label="Owner" value={draft.owner} onChange={(value) => set('owner', value)}>
          {crmOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </FieldSelect>
        <TextField id="contact-location" label="Location" value={draft.location} onChange={(value) => set('location', value)} className="sm:col-span-2" />
        <TextField id="contact-tags" label="Tags" value={tags} hint="Separate tags with commas." onChange={setTags} className="sm:col-span-2" />
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

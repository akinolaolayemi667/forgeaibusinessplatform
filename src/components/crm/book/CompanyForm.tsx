import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { FieldSelect } from '@/components/crm/book/fields'
import { companyStatuses, crmOwners, type CompanyDraft, type CompanyStatus } from '@/data/crm'

export function CompanyForm({ onSubmit, onCancel }: { onSubmit: (draft: CompanyDraft) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState<CompanyDraft>({
    name: '',
    industry: '',
    website: '',
    phone: '',
    location: '',
    owner: crmOwners[0],
    status: 'Prospect',
  })
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!draft.name.trim()) {
      setError('Enter a company name.')
      return
    }
    onSubmit({ ...draft, name: draft.name.trim(), industry: draft.industry.trim() || 'General' })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="company-name" label="Company" value={draft.name} error={error} onChange={(name) => setDraft({ ...draft, name })} className="sm:col-span-2" />
        <TextField id="company-industry" label="Industry" value={draft.industry} onChange={(industry) => setDraft({ ...draft, industry })} />
        <TextField id="company-website" label="Website" value={draft.website} onChange={(website) => setDraft({ ...draft, website })} />
        <TextField id="company-phone" label="Phone" value={draft.phone} onChange={(phone) => setDraft({ ...draft, phone })} />
        <TextField id="company-location" label="Location" value={draft.location} onChange={(location) => setDraft({ ...draft, location })} />
        <FieldSelect id="company-owner" label="Owner" value={draft.owner} onChange={(owner) => setDraft({ ...draft, owner })}>
          {crmOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="company-status" label="Status" value={draft.status} onChange={(status) => setDraft({ ...draft, status: status as CompanyStatus })}>
          {companyStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create company</Button>
      </div>
    </form>
  )
}

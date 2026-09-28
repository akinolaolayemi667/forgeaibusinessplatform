import { useState, type FormEvent } from 'react'
import { forgeData } from '@/data'
import { LeadTable } from '@/components/crm/LeadTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { TextField } from '@/components/ui/TextField'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useSession } from '@/hooks/useSession'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { Lead } from '@/types'
import { isEmail } from '@/utils/format'

type LeadErrors = { name?: string; company?: string; email?: string }

export function LeadsPage() {
  const modal = useDisclosure()
  const { user } = useSession()
  const { workspace } = useWorkspace()
  const query = useAsyncData(`leads:${workspace.id}`, () => forgeData.listLeads(workspace.id))
  const [created, setCreated] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<LeadErrors>({})

  const rows = [...created.filter((lead) => lead.workspaceId === workspace.id), ...(query.data ?? [])].filter((lead) => {
    const haystack = `${lead.name} ${lead.company} ${lead.email}`.toLowerCase()
    return haystack.includes(search.trim().toLowerCase())
  })

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: LeadErrors = {
      name: name.trim() ? undefined : 'Enter a name.',
      company: company.trim() ? undefined : 'Enter a company.',
      email: isEmail(email) ? undefined : 'Enter a valid email.',
    }
    setErrors(next)
    if (next.name || next.company || next.email) return
    const lead: Lead = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      source: 'Manual',
      status: 'New',
      score: 50,
      owner: user?.name ?? 'Unassigned',
      createdAt: new Date().toISOString(),
    }
    setCreated((current) => [lead, ...current])
    setName('')
    setCompany('')
    setEmail('')
    setErrors({})
    modal.close()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Leads"
        description={`Inbound interest for ${workspace.name}. Added leads last until you refresh.`}
        actions={<Button onClick={modal.open}>Add lead</Button>}
      />
      <div className="max-w-sm">
        <TextField id="lead-search" label="Search leads" value={search} onChange={setSearch} autoComplete="off" />
      </div>
      <QueryState loading={query.loading} error={query.error}>
        <LeadTable rows={rows} />
      </QueryState>
      <Modal
        open={modal.isOpen}
        title="Add a lead"
        description="This stays in the current visit and is tagged to the open workspace."
        onClose={modal.close}
      >
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <TextField id="lead-name" label="Name" value={name} onChange={setName} autoComplete="name" error={errors.name} />
          <TextField id="lead-company" label="Company" value={company} onChange={setCompany} autoComplete="organization" error={errors.company} />
          <TextField id="lead-email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" error={errors.email} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save lead</Button>
            <Button type="button" variant="ghost" onClick={modal.close}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

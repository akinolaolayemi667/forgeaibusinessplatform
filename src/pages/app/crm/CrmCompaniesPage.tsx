import { useMemo, useState } from 'react'
import { CompanyForm } from '@/components/crm/book/CompanyForm'
import { CompanyImport } from '@/components/crm/book/CompanyImport'
import { CompanyTable } from '@/components/crm/book/CompanyTable'
import { ContactSearch } from '@/components/crm/book/ContactSearch'
import { CRMHeader } from '@/components/crm/book/CRMHeader'
import { FieldSelect } from '@/components/crm/book/fields'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { companyStatuses, type CompanyStatus } from '@/data/crm'
import { useCrm } from '@/hooks/useCrm'

export function CrmCompaniesPage() {
  const { companies, addCompany } = useCrm()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CompanyStatus>('all')
  const [adding, setAdding] = useState(false)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return companies.filter((company) => {
      if (status !== 'all' && company.status !== status) return false
      if (!needle) return true
      return `${company.name} ${company.industry} ${company.owner}`.toLowerCase().includes(needle)
    })
  }, [companies, query, status])

  return (
    <div className="flex flex-col gap-6">
      <CRMHeader
        eyebrow="CRM / COMPANIES"
        title="Companies"
        description="Understand the organizations behind your customer relationships."
        actions={
          <>
            <CompanyImport />
            <Button onClick={() => setAdding(true)}>+ Add Company</Button>
          </>
        }
      />
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
        <ContactSearch
          value={query}
          onChange={setQuery}
          label="Search companies"
          placeholder="Search companies by name, industry, owner..."
        />
        <FieldSelect id="company-status-filter" label="Status" value={status} onChange={(value) => setStatus(value as 'all' | CompanyStatus)}>
          <option value="all">All statuses</option>
          {companyStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
      </div>
      <CompanyTable
        rows={rows}
        filteredEmpty={query.trim().length > 0 || status !== 'all' || companies.length > 0}
        onClear={() => {
          setQuery('')
          setStatus('all')
        }}
      />
      <Modal open={adding} title="Add company" description="Open an organization in this workspace." onClose={() => setAdding(false)}>
        <CompanyForm
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            addCompany(draft)
            setAdding(false)
          }}
        />
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CompanyDetail } from '@/components/crm/book/CompanyDetail'
import { CRMEmptyState } from '@/components/crm/book/CRMEmptyState'
import { useCrm } from '@/hooks/useCrm'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CrmCompanyPage() {
  const { companyId = '' } = useParams()
  const { companies, contacts, activities, notes, tasks, addNote } = useCrm()
  const company = companies.find((item) => item.id === companyId)
  const [noting, setNoting] = useState(false)
  usePageTitle(company ? `${company.name} · FORGE` : 'Company · FORGE')

  useEffect(() => {
    if (!noting) return
    document.getElementById('note-body')?.focus()
  }, [noting])

  if (!company) {
    return (
      <CRMEmptyState
        title="Company not found"
        description="This organization is not in the current workspace."
        action={
          <Link to="/app/crm/companies" className="text-sm text-copy no-underline hover:text-ember">
            Back to companies
          </Link>
        }
      />
    )
  }

  const people = contacts.filter((contact) => contact.companyId === company.id)
  const personIds = new Set(people.map((contact) => contact.id))
  const recordActivities = activities
    .filter((item) => item.companyId === company.id || (item.contactId && personIds.has(item.contactId)))
    .sort((a, b) => b.at.localeCompare(a.at))
  const recordNotes = notes.filter((item) => item.companyId === company.id).sort((a, b) => b.at.localeCompare(a.at))
  const recordTasks = tasks.filter((task) => task.companyId === company.id || (task.contactId && personIds.has(task.contactId)))

  return (
    <div className="flex flex-col gap-4">
      <Link to="/app/crm/companies" className="text-sm text-muted no-underline hover:text-copy">
        Back to Companies
      </Link>
      <CompanyDetail
        company={company}
        contacts={people}
        activities={recordActivities}
        notes={recordNotes}
        tasks={recordTasks}
        noteOpen={noting}
        onNote={() => setNoting(true)}
        onSaveNote={(body) => addNote({ body, companyId: company.id })}
      />
    </div>
  )
}

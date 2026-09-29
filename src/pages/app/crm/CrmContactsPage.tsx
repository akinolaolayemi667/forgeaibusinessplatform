import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContactFilters, type ContactQuery } from '@/components/crm/book/ContactFilters'
import { ContactForm } from '@/components/crm/book/ContactForm'
import { ContactImport } from '@/components/crm/book/ContactImport'
import { ContactSearch } from '@/components/crm/book/ContactSearch'
import { ContactTable } from '@/components/crm/book/ContactTable'
import { CRMHeader } from '@/components/crm/book/CRMHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { contactName, withinActivityWindow, type ContactDraft, type CrmContact, type CrmStatus } from '@/data/crm'
import { contactsToCsv } from '@/data/crm/csv'
import { useCrm } from '@/hooks/useCrm'

const pageSize = 8

const initialQuery: ContactQuery = {
  status: 'all',
  owner: 'all',
  companyId: 'all',
  tag: 'all',
  activity: 'any',
  sort: 'active',
}

function toDraft(contact: CrmContact): ContactDraft {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    companyId: contact.companyId,
    title: contact.title,
    status: contact.status,
    owner: contact.owner,
    tags: contact.tags,
    location: contact.location,
  }
}

export function CrmContactsPage() {
  const navigate = useNavigate()
  const { contacts, companies, companyName, addContact, updateContact, setStatus, assignOwner } = useCrm()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<ContactQuery>(initialQuery)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<CrmContact | null>(null)

  const tags = useMemo(() => [...new Set(contacts.flatMap((contact) => contact.tags))].sort(), [contacts])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const rows = contacts.filter((contact) => {
      if (filters.status !== 'all' && contact.status !== filters.status) return false
      if (filters.owner !== 'all' && contact.owner !== filters.owner) return false
      if (filters.companyId !== 'all' && contact.companyId !== filters.companyId) return false
      if (filters.tag !== 'all' && !contact.tags.includes(filters.tag)) return false
      if (!withinActivityWindow(contact.lastActivityAt, filters.activity as 'any' | 'today' | 'yesterday' | 'week')) return false
      if (!needle) return true
      const haystack = `${contactName(contact)} ${contact.email} ${companyName(contact.companyId)}`.toLowerCase()
      return haystack.includes(needle)
    })
    rows.sort((a, b) => {
      if (filters.sort === 'added') return b.createdAt.localeCompare(a.createdAt)
      if (filters.sort === 'az') return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
      if (filters.sort === 'za') return `${b.lastName} ${b.firstName}`.localeCompare(`${a.lastName} ${a.firstName}`)
      return b.lastActivityAt.localeCompare(a.lastActivityAt)
    })
    return rows
  }, [companyName, contacts, filters, query])

  useEffect(() => {
    setPage(1)
    setSelected([])
  }, [query, filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const filtersActive =
    query.trim().length > 0 ||
    filters.status !== 'all' ||
    filters.owner !== 'all' ||
    filters.companyId !== 'all' ||
    filters.tag !== 'all' ||
    filters.activity !== 'any'

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function togglePage(checked: boolean) {
    const ids = rows.map((row) => row.id)
    setSelected((current) => (checked ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id))))
  }

  function exportContacts() {
    const csv = contactsToCsv(filtered, companyName)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'forge-contacts.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function changeStatus(ids: string[], status: CrmStatus) {
    setStatus(ids, status)
    setSelected([])
  }

  return (
    <div className="flex flex-col gap-6">
      <CRMHeader
        eyebrow="CRM / CONTACTS"
        title="Contacts"
        description="Keep every customer relationship organized and actionable."
        actions={
          <>
            <ContactImport />
            <Button variant="outline" onClick={exportContacts}>
              Export
            </Button>
            <Button onClick={() => setAdding(true)}>+ Add Contact</Button>
          </>
        }
      />
      <ContactSearch value={query} onChange={setQuery} />
      <ContactFilters query={filters} companies={companies} tags={tags} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />
      <ContactTable
        rows={rows}
        page={safePage}
        pageCount={pageCount}
        total={filtered.length}
        companyName={companyName}
        selected={selected}
        filteredEmpty={filtersActive || contacts.length > 0}
        onToggle={toggle}
        onTogglePage={togglePage}
        onClearSelection={() => setSelected([])}
        onPage={setPage}
        onOpen={(id) => navigate(`/app/crm/contacts/${id}`)}
        onEdit={setEditing}
        onStatus={changeStatus}
        onAssign={(ids, owner) => {
          assignOwner(ids, owner)
          setSelected([])
        }}
        onClearFilters={() => {
          setQuery('')
          setFilters(initialQuery)
        }}
      />
      <Modal open={adding} title="Add contact" description="Create a contact in this workspace." onClose={() => setAdding(false)}>
        <ContactForm
          companies={companies}
          submitLabel="Create contact"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            addContact(draft)
            setAdding(false)
          }}
        />
      </Modal>
      <Modal open={Boolean(editing)} title="Edit contact" description="Update this contact." onClose={() => setEditing(null)}>
        {editing ? (
          <ContactForm
            key={editing.id}
            initial={toDraft(editing)}
            companies={companies}
            submitLabel="Save"
            onCancel={() => setEditing(null)}
            onSubmit={(draft) => {
              updateContact(editing.id, draft)
              setEditing(null)
            }}
          />
        ) : null}
      </Modal>
    </div>
  )
}

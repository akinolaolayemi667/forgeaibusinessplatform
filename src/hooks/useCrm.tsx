import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  contactName,
  crmBook,
  crmOwners,
  seedActivities,
  seedCompanies,
  seedContacts,
  seedNotes,
  seedTasks,
  type CompanyDraft,
  type ContactDraft,
  type CrmActivity,
  type CrmCompany,
  type CrmContact,
  type CrmNote,
  type CrmStatus,
  type CrmTask,
  type TaskDraft,
} from '@/data/crm'

type Toast = { id: number; message: string }

type CrmContextValue = {
  contacts: CrmContact[]
  companies: CrmCompany[]
  activities: CrmActivity[]
  tasks: CrmTask[]
  notes: CrmNote[]
  book: typeof crmBook
  toast: Toast | null
  dismissToast: () => void
  companyName: (id: string) => string
  addContact: (draft: ContactDraft, options?: { silent?: boolean }) => CrmContact
  updateContact: (id: string, draft: ContactDraft) => void
  setStatus: (ids: string[], status: CrmStatus) => void
  assignOwner: (ids: string[], owner: string) => void
  addNote: (input: { body: string; contactId?: string; companyId?: string }) => void
  addTask: (draft: TaskDraft) => void
  addCompany: (draft: CompanyDraft, options?: { silent?: boolean }) => CrmCompany
  importContacts: (drafts: ContactDraft[]) => number
  importCompanies: (drafts: CompanyDraft[]) => number
}

const CrmContext = createContext<CrmContextValue | null>(null)

const leadStatuses: CrmStatus[] = ['New', 'Contacted', 'Qualified', 'Active']

function nextId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState(seedContacts)
  const [companies, setCompanies] = useState(seedCompanies)
  const [activities, setActivities] = useState(seedActivities)
  const [tasks, setTasks] = useState(seedTasks)
  const [notes, setNotes] = useState(seedNotes)
  const [extra, setExtra] = useState({ contacts: 0, activeLeads: 0, companies: 0, followUps: 0 })
  const [toast, setToast] = useState<Toast | null>(null)

  const notify = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const log = useCallback((activity: Omit<CrmActivity, 'id' | 'at' | 'actor'> & { actor?: string }) => {
    const next: CrmActivity = {
      id: nextId('act'),
      at: new Date().toISOString(),
      actor: activity.actor ?? 'You',
      contactId: activity.contactId,
      companyId: activity.companyId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
    }
    setActivities((current) => [next, ...current])
  }, [])

  const companyName = useCallback(
    (id: string) => companies.find((company) => company.id === id)?.name ?? '—',
    [companies],
  )

  const addContact = useCallback(
    (draft: ContactDraft, options?: { silent?: boolean }) => {
      const now = new Date().toISOString()
      const created: CrmContact = {
        ...draft,
        source: 'Manual',
        owner: draft.owner || crmOwners[0],
        id: nextId('ct'),
        createdAt: now,
        lastActivityAt: now,
      }
      setContacts((current) => [created, ...current])
      if (created.companyId) {
        setCompanies((current) =>
          current.map((company) =>
            company.id === created.companyId
              ? { ...company, contactCount: company.contactCount + 1, lastActivityAt: now }
              : company,
          ),
        )
      }
      setExtra((current) => ({
        ...current,
        contacts: current.contacts + 1,
        activeLeads: leadStatuses.includes(created.status) ? current.activeLeads + 1 : current.activeLeads,
      }))
      log({
        type: 'created',
        contactId: created.id,
        companyId: created.companyId || undefined,
        title: `${contactName(created)} added`,
        description: 'Contact created in this workspace.',
      })
      if (!options?.silent) notify('Contact created')
      return created
    },
    [log, notify],
  )

  const updateContact = useCallback(
    (id: string, draft: ContactDraft) => {
      const previous = contacts.find((item) => item.id === id)
      if (!previous) return
      const now = new Date().toISOString()
      const next: CrmContact = { ...previous, ...draft, lastActivityAt: now }
      setContacts((current) => current.map((item) => (item.id === id ? next : item)))
      if (previous.status !== next.status) {
        log({
          type: 'status',
          contactId: id,
          companyId: next.companyId || undefined,
          title: `${contactName(next)} moved to ${next.status}`,
          description: `Status changed from ${previous.status} to ${next.status}.`,
        })
      }
      if (previous.owner !== next.owner) {
        log({
          type: 'assigned',
          contactId: id,
          companyId: next.companyId || undefined,
          title: `${contactName(next)} assigned to ${next.owner}`,
          description: `Owner changed from ${previous.owner} to ${next.owner}.`,
        })
      }
      if (previous.companyId !== next.companyId) {
        setCompanies((current) =>
          current.map((company) => {
            if (company.id === previous.companyId) return { ...company, contactCount: Math.max(0, company.contactCount - 1) }
            if (company.id === next.companyId) return { ...company, contactCount: company.contactCount + 1, lastActivityAt: now }
            return company
          }),
        )
      }
      notify('Contact updated')
    },
    [contacts, log, notify],
  )

  const setStatus = useCallback(
    (ids: string[], status: CrmStatus) => {
      const now = new Date().toISOString()
      const selected = contacts.filter((item) => ids.includes(item.id) && item.status !== status)
      if (selected.length === 0) return
      setContacts((current) =>
        current.map((item) => (ids.includes(item.id) ? { ...item, status, lastActivityAt: now } : item)),
      )
      for (const item of selected) {
        log({
          type: 'status',
          contactId: item.id,
          companyId: item.companyId || undefined,
          title: `${contactName(item)} moved to ${status}`,
          description: `Status changed from ${item.status} to ${status}.`,
        })
      }
      notify(selected.length === 1 ? 'Status updated' : `${selected.length} statuses updated`)
    },
    [contacts, log, notify],
  )

  const assignOwner = useCallback(
    (ids: string[], owner: string) => {
      const now = new Date().toISOString()
      const selected = contacts.filter((item) => ids.includes(item.id) && item.owner !== owner)
      if (selected.length === 0) return
      setContacts((current) =>
        current.map((item) => (ids.includes(item.id) ? { ...item, owner, lastActivityAt: now } : item)),
      )
      for (const item of selected) {
        log({
          type: 'assigned',
          contactId: item.id,
          companyId: item.companyId || undefined,
          title: `${contactName(item)} assigned to ${owner}`,
          description: `Owner changed from ${item.owner} to ${owner}.`,
        })
      }
      notify(selected.length === 1 ? 'Owner assigned' : `${selected.length} contacts assigned`)
    },
    [contacts, log, notify],
  )

  const addNote = useCallback(
    (input: { body: string; contactId?: string; companyId?: string }) => {
      const body = input.body.trim()
      if (!body) return
      const note: CrmNote = {
        id: nextId('note'),
        body,
        author: 'You',
        at: new Date().toISOString(),
        contactId: input.contactId,
        companyId: input.companyId,
      }
      setNotes((current) => [note, ...current])
      const person = contacts.find((item) => item.id === input.contactId)
      const company = companies.find((item) => item.id === (input.companyId || person?.companyId))
      log({
        type: 'note',
        contactId: input.contactId,
        companyId: input.companyId || person?.companyId || undefined,
        title: person ? `Note added for ${contactName(person)}` : `Note added for ${company?.name ?? 'the record'}`,
        description: body,
      })
      if (input.contactId) {
        setContacts((current) =>
          current.map((item) => (item.id === input.contactId ? { ...item, lastActivityAt: note.at } : item)),
        )
      }
      notify('Note added')
    },
    [companies, contacts, log, notify],
  )

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const task: CrmTask = {
        id: nextId('task'),
        title: draft.title.trim(),
        description: draft.description.trim(),
        dueAt: draft.dueAt,
        priority: draft.priority,
        assignee: draft.assignee || crmOwners[0],
        contactId: draft.contactId,
        companyId: draft.companyId,
        done: false,
      }
      setTasks((current) => [task, ...current])
      setExtra((current) => ({ ...current, followUps: current.followUps + 1 }))
      const person = contacts.find((item) => item.id === draft.contactId)
      const company = companies.find((item) => item.id === (draft.companyId || person?.companyId))
      log({
        type: 'task',
        contactId: draft.contactId,
        companyId: draft.companyId || person?.companyId || undefined,
        title: `Follow-up task created${company ? ` for ${company.name}` : ''}`,
        description: task.title,
      })
      if (draft.contactId) {
        setContacts((current) =>
          current.map((item) => (item.id === draft.contactId ? { ...item, lastActivityAt: new Date().toISOString() } : item)),
        )
      }
      notify('Task created')
    },
    [companies, contacts, log, notify],
  )

  const addCompany = useCallback(
    (draft: CompanyDraft, options?: { silent?: boolean }) => {
      const now = new Date().toISOString()
      const created: CrmCompany = {
        ...draft,
        id: nextId('co'),
        owner: draft.owner || crmOwners[0],
        contactCount: 0,
        openOpportunities: 0,
        lastActivityAt: now,
      }
      setCompanies((current) => [created, ...current])
      setExtra((current) => ({ ...current, companies: current.companies + 1 }))
      log({
        type: 'company',
        companyId: created.id,
        title: `${created.name} added as a new company`,
        description: `${created.industry} account opened in this workspace.`,
      })
      if (!options?.silent) notify('Company created')
      return created
    },
    [log, notify],
  )

  const importContacts = useCallback(
    (drafts: ContactDraft[]) => {
      let added = 0
      for (const draft of drafts) {
        const company = companies.find((item) => item.name.toLowerCase() === draft.companyId.toLowerCase())
        addContact(
          {
            ...draft,
            companyId: company?.id ?? '',
            owner: crmOwners.find((owner) => owner === draft.owner) ?? crmOwners[0],
          },
          { silent: true },
        )
        added += 1
      }
      notify(added === 0 ? 'No contacts found in that file' : added === 1 ? '1 contact imported' : `${added} contacts imported`)
      return added
    },
    [addContact, companies, notify],
  )

  const importCompanies = useCallback(
    (drafts: CompanyDraft[]) => {
      let added = 0
      for (const draft of drafts) {
        if (!draft.name.trim()) continue
        addCompany(
          {
            ...draft,
            owner: crmOwners.find((owner) => owner === draft.owner) ?? crmOwners[0],
          },
          { silent: true },
        )
        added += 1
      }
      notify(added === 0 ? 'No companies found in that file' : added === 1 ? '1 company imported' : `${added} companies imported`)
      return added
    },
    [addCompany, notify],
  )

  const value = useMemo<CrmContextValue>(
    () => ({
      contacts,
      companies,
      activities,
      tasks,
      notes,
      book: {
        contacts: crmBook.contacts + extra.contacts,
        activeLeads: crmBook.activeLeads + extra.activeLeads,
        companies: crmBook.companies + extra.companies,
        followUps: crmBook.followUps + extra.followUps,
      },
      toast,
      dismissToast: () => setToast(null),
      companyName,
      addContact,
      updateContact,
      setStatus,
      assignOwner,
      addNote,
      addTask,
      addCompany,
      importContacts,
      importCompanies,
    }),
    [
      activities,
      addCompany,
      addContact,
      addNote,
      addTask,
      assignOwner,
      companies,
      companyName,
      contacts,
      extra,
      importContacts,
      importCompanies,
      notes,
      setStatus,
      tasks,
      toast,
      updateContact,
    ],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const value = useContext(CrmContext)
  if (!value) throw new Error('useCrm must be used within CrmProvider')
  return value
}

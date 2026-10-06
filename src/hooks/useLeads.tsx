import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  leadBook,
  leadName,
  leadOwners,
  scoreBand,
  seedLeadActivities,
  seedLeadNotes,
  seedLeads,
  seedLeadTasks,
  type LeadActivity,
  type LeadDraft,
  type LeadNote,
  type LeadStatus,
  type LeadTask,
  type SalesLead,
} from '@/data/leads'
import type { TaskDraft } from '@/data/crm'

type Toast = { id: number; message: string }

type LeadsContextValue = {
  leads: SalesLead[]
  activities: LeadActivity[]
  tasks: LeadTask[]
  notes: LeadNote[]
  book: typeof leadBook
  toast: Toast | null
  dismissToast: () => void
  nextFollowUp: (leadId: string) => string | null
  addLead: (draft: LeadDraft, options?: { silent?: boolean }) => SalesLead
  updateLead: (id: string, draft: LeadDraft) => void
  setStatus: (ids: string[], status: LeadStatus) => void
  assignOwner: (ids: string[], owner: string) => void
  addTag: (ids: string[], tag: string) => void
  qualify: (id: string) => void
  convert: (id: string) => void
  addNote: (leadId: string, body: string) => void
  addTask: (leadId: string, draft: TaskDraft) => void
  importLeads: (drafts: LeadDraft[]) => number
}

const LeadsContext = createContext<LeadsContextValue | null>(null)

function nextId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

function blankEngagement(at: string): SalesLead['engagement'] {
  return { emailOpens: 0, emailReplies: 0, websiteVisits: 0, messages: 0, calls: 0, lastEngagementAt: at }
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState(seedLeads)
  const [activities, setActivities] = useState(seedLeadActivities)
  const [tasks, setTasks] = useState(seedLeadTasks)
  const [notes, setNotes] = useState(seedLeadNotes)
  const [extra, setExtra] = useState({ total: 0, newThisWeek: 0, qualified: 0, hot: 0, followUps: 0 })
  const [toast, setToast] = useState<Toast | null>(null)

  const notify = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const log = useCallback((activity: Omit<LeadActivity, 'id' | 'at' | 'actor'> & { actor?: string }) => {
    const next: LeadActivity = {
      id: nextId('lact'),
      at: new Date().toISOString(),
      actor: activity.actor ?? 'You',
      leadId: activity.leadId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
    }
    setActivities((current) => [next, ...current])
  }, [])

  const touch = useCallback((id: string, at: string) => {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, lastActivityAt: at } : lead)))
  }, [])

  const nextFollowUp = useCallback(
    (leadId: string) => {
      const open = tasks.filter((task) => task.leadId === leadId && !task.done).sort((a, b) => a.dueAt.localeCompare(b.dueAt))
      return open[0]?.dueAt ?? null
    },
    [tasks],
  )

  const addLead = useCallback(
    (draft: LeadDraft, options?: { silent?: boolean }) => {
      const now = new Date().toISOString()
      const created: SalesLead = {
        id: nextId('ld'),
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        company: draft.company.trim() || 'Independent',
        title: draft.title.trim(),
        location: draft.location.trim(),
        source: draft.source,
        campaign: 'Manual capture',
        landingPage: '/app/leads',
        status: draft.status,
        score: draft.score,
        owner: draft.owner || leadOwners[0],
        tags: draft.tags,
        createdAt: now,
        lastActivityAt: now,
        engagement: blankEngagement(now),
      }
      setLeads((current) => [created, ...current])
      setExtra((current) => ({
        ...current,
        total: current.total + 1,
        newThisWeek: current.newThisWeek + 1,
        qualified: created.status === 'Qualified' ? current.qualified + 1 : current.qualified,
        hot: scoreBand(created.score) === 'HOT' ? current.hot + 1 : current.hot,
      }))
      log({
        leadId: created.id,
        type: 'created',
        title: 'Lead created',
        description: `${leadName(created)} entered from ${created.source}.`,
      })
      if (draft.notes.trim()) {
        const note: LeadNote = {
          id: nextId('lnote'),
          leadId: created.id,
          body: draft.notes.trim(),
          author: 'You',
          at: now,
        }
        setNotes((current) => [note, ...current])
        log({
          leadId: created.id,
          type: 'note',
          title: 'Note added',
          description: note.body,
        })
      }
      if (!options?.silent) notify('Lead created')
      return created
    },
    [log, notify],
  )

  const updateLead = useCallback(
    (id: string, draft: LeadDraft) => {
      const previous = leads.find((lead) => lead.id === id)
      if (!previous) return
      const now = new Date().toISOString()
      const next: SalesLead = {
        ...previous,
        ...draft,
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        company: draft.company.trim() || previous.company,
        title: draft.title.trim(),
        location: draft.location.trim(),
        owner: draft.owner || previous.owner,
        lastActivityAt: now,
      }
      setLeads((current) => current.map((lead) => (lead.id === id ? next : lead)))
      if (previous.status !== next.status) {
        log({
          leadId: id,
          type: 'status',
          title: `${leadName(next)} moved to ${next.status}`,
          description: `Status changed from ${previous.status} to ${next.status}.`,
        })
      }
      if (previous.owner !== next.owner) {
        log({
          leadId: id,
          type: 'assigned',
          title: `${leadName(next)} assigned to ${next.owner}`,
          description: `Owner changed from ${previous.owner} to ${next.owner}.`,
        })
      }
      notify('Lead updated')
    },
    [leads, log, notify],
  )

  const setStatus = useCallback(
    (ids: string[], status: LeadStatus) => {
      const now = new Date().toISOString()
      const selected = leads.filter((lead) => ids.includes(lead.id) && lead.status !== status)
      if (selected.length === 0) return
      setLeads((current) => current.map((lead) => (ids.includes(lead.id) && lead.status !== status ? { ...lead, status, lastActivityAt: now } : lead)))
      let qualified = 0
      for (const lead of selected) {
        if (status === 'Qualified' && lead.status !== 'Qualified') qualified += 1
        log({
          leadId: lead.id,
          type: status === 'Qualified' ? 'qualified' : status === 'Converted' ? 'converted' : 'status',
          title: status === 'Qualified' ? 'Status changed to Qualified' : `${leadName(lead)} moved to ${status}`,
          description: `Status changed from ${lead.status} to ${status}.`,
        })
      }
      if (qualified > 0) setExtra((current) => ({ ...current, qualified: current.qualified + qualified }))
      notify(
        status === 'Qualified' && selected.length === 1
          ? 'Lead qualified successfully.'
          : selected.length === 1
            ? 'Status updated'
            : `${selected.length} statuses updated`,
      )
    },
    [leads, log, notify],
  )

  const assignOwner = useCallback(
    (ids: string[], owner: string) => {
      const now = new Date().toISOString()
      const selected = leads.filter((lead) => ids.includes(lead.id) && lead.owner !== owner)
      if (selected.length === 0) return
      setLeads((current) => current.map((lead) => (ids.includes(lead.id) ? { ...lead, owner, lastActivityAt: now } : lead)))
      for (const lead of selected) {
        log({
          leadId: lead.id,
          type: 'assigned',
          title: `${leadName(lead)} assigned to ${owner}`,
          description: `Owner changed from ${lead.owner} to ${owner}.`,
        })
      }
      notify(selected.length === 1 ? 'Owner assigned' : `${selected.length} leads assigned`)
    },
    [leads, log, notify],
  )

  const addTag = useCallback(
    (ids: string[], tag: string) => {
      const nextTag = tag.trim()
      if (!nextTag || ids.length === 0) return
      setLeads((current) =>
        current.map((lead) => (ids.includes(lead.id) && !lead.tags.includes(nextTag) ? { ...lead, tags: [...lead.tags, nextTag] } : lead)),
      )
      notify(ids.length === 1 ? 'Tag added' : `Tag added to ${ids.length} leads`)
    },
    [notify],
  )

  const qualify = useCallback(
    (id: string) => {
      const lead = leads.find((item) => item.id === id)
      if (!lead) return
      if (lead.status === 'Qualified') {
        notify('Lead is already qualified.')
        return
      }
      setStatus([id], 'Qualified')
    },
    [leads, notify, setStatus],
  )

  const convert = useCallback(
    (id: string) => {
      const lead = leads.find((item) => item.id === id)
      if (!lead || lead.status === 'Converted') return
      const now = new Date().toISOString()
      setLeads((current) => current.map((item) => (item.id === id ? { ...item, status: 'Converted', lastActivityAt: now } : item)))
      log({
        leadId: id,
        type: 'converted',
        title: `${leadName(lead)} converted`,
        description: 'Converted into an active customer relationship. The lead record stays on the book.',
      })
      notify('Lead converted')
    },
    [leads, log, notify],
  )

  const addNote = useCallback(
    (leadId: string, body: string) => {
      const text = body.trim()
      if (!text) return
      const note: LeadNote = { id: nextId('lnote'), leadId, body: text, author: 'You', at: new Date().toISOString() }
      setNotes((current) => [note, ...current])
      const lead = leads.find((item) => item.id === leadId)
      log({
        leadId,
        type: 'note',
        title: lead ? `Note added for ${leadName(lead)}` : 'Note added',
        description: text,
      })
      touch(leadId, note.at)
      notify('Note added')
    },
    [leads, log, notify, touch],
  )

  const addTask = useCallback(
    (leadId: string, draft: TaskDraft) => {
      const task: LeadTask = {
        id: nextId('ltask'),
        leadId,
        title: draft.title.trim(),
        description: draft.description.trim(),
        dueAt: draft.dueAt,
        priority: draft.priority,
        assignee: draft.assignee || leadOwners[0],
        done: false,
      }
      setTasks((current) => [task, ...current])
      setExtra((current) => ({ ...current, followUps: current.followUps + 1 }))
      const lead = leads.find((item) => item.id === leadId)
      const at = new Date().toISOString()
      log({
        leadId,
        type: 'task',
        title: 'Follow-up task created',
        description: lead ? `${task.title} · ${leadName(lead)}` : task.title,
      })
      touch(leadId, at)
      notify('Task created')
    },
    [leads, log, notify, touch],
  )

  const importLeads = useCallback(
    (drafts: LeadDraft[]) => {
      let added = 0
      for (const draft of drafts) {
        addLead(
          {
            ...draft,
            owner: leadOwners.find((owner) => owner === draft.owner) ?? leadOwners[0],
          },
          { silent: true },
        )
        added += 1
      }
      notify(added === 0 ? 'No leads found in that file' : added === 1 ? '1 lead imported' : `${added} leads imported`)
      return added
    },
    [addLead, notify],
  )

  const value = useMemo<LeadsContextValue>(
    () => ({
      leads,
      activities,
      tasks,
      notes,
      book: {
        ...leadBook,
        total: leadBook.total + extra.total,
        newThisWeek: leadBook.newThisWeek + extra.newThisWeek,
        qualified: leadBook.qualified + extra.qualified,
        hot: leadBook.hot + extra.hot,
        followUps: leadBook.followUps + extra.followUps,
      },
      toast,
      dismissToast: () => setToast(null),
      nextFollowUp,
      addLead,
      updateLead,
      setStatus,
      assignOwner,
      addTag,
      qualify,
      convert,
      addNote,
      addTask,
      importLeads,
    }),
    [activities, addLead, addNote, addTag, addTask, assignOwner, convert, extra, importLeads, leads, nextFollowUp, notes, qualify, setStatus, tasks, toast, updateLead],
  )

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
}

export function useLeads() {
  const value = useContext(LeadsContext)
  if (!value) throw new Error('useLeads must be used within LeadsProvider')
  return value
}

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { TaskDraft } from '@/data/crm'
import { formatCurrency } from '@/utils/format'
import {
  companyIdFor,
  contactIdFor,
  isOpenStage,
  ownerName,
  pipelineMetrics,
  seedOpportunities,
  seedOpportunityActivities,
  seedOpportunityNotes,
  seedOpportunityTasks,
  stageCatalog,
  type LossReason,
  type Opportunity,
  type OpportunityActivity,
  type OpportunityDraft,
  type OpportunityNote,
  type OpportunityPriority,
  type OpportunityTask,
  type PipelineStageId,
} from '@/data/pipeline'

type Toast = { id: number; message: string }

type PipelineContextValue = {
  opportunities: Opportunity[]
  activities: OpportunityActivity[]
  tasks: OpportunityTask[]
  notes: OpportunityNote[]
  metrics: ReturnType<typeof pipelineMetrics>
  toast: Toast | null
  dismissToast: () => void
  report: (message: string) => void
  addOpportunity: (draft: OpportunityDraft) => Opportunity
  updateOpportunity: (id: string, draft: OpportunityDraft) => void
  moveStage: (ids: string[], stageId: PipelineStageId) => void
  markWon: (id: string) => void
  markLost: (id: string, reason: LossReason) => void
  restore: (id: string) => void
  assignOwner: (ids: string[], ownerId: string) => void
  setPriority: (ids: string[], priority: OpportunityPriority) => void
  addNote: (opportunityId: string, body: string) => void
  addTask: (opportunityId: string, draft: TaskDraft) => void
  completeTask: (taskId: string) => void
}

const PipelineContext = createContext<PipelineContextValue | null>(null)

function nextId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState(seedOpportunities)
  const [activities, setActivities] = useState(seedOpportunityActivities)
  const [tasks, setTasks] = useState(seedOpportunityTasks)
  const [notes, setNotes] = useState(seedOpportunityNotes)
  const [deltas, setDeltas] = useState({ won: 0, lost: 0 })
  const [toast, setToast] = useState<Toast | null>(null)

  const notify = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const log = useCallback((activity: Omit<OpportunityActivity, 'id' | 'at' | 'actor'> & { actor?: string; at?: string }) => {
    const next: OpportunityActivity = {
      id: nextId('oact'),
      at: activity.at ?? new Date().toISOString(),
      actor: activity.actor ?? 'You',
      opportunityId: activity.opportunityId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
    }
    setActivities((current) => [next, ...current])
  }, [])

  const shiftClosures = useCallback((from: PipelineStageId | null, to: PipelineStageId) => {
    const won = (to === 'won' ? 1 : 0) - (from === 'won' ? 1 : 0)
    const lost = (to === 'lost' ? 1 : 0) - (from === 'lost' ? 1 : 0)
    if (won === 0 && lost === 0) return
    setDeltas((current) => ({ won: current.won + won, lost: current.lost + lost }))
  }, [])

  const metrics = useMemo(() => pipelineMetrics(opportunities, deltas), [deltas, opportunities])

  const addOpportunity = useCallback(
    (draft: OpportunityDraft) => {
      const now = new Date().toISOString()
      const companyId = companyIdFor(draft.company)
      const linked = contactIdFor(draft.contact, companyId)
      const stageId = draft.stageId
      const created: Opportunity = {
        id: nextId('opp'),
        name: draft.name.trim(),
        companyId,
        company: draft.company.trim(),
        contactId: linked ?? nextId('ct'),
        contact: draft.contact.trim(),
        contactEmail: draft.contactEmail.trim(),
        contactPhone: draft.contactPhone.trim(),
        value: Math.round(draft.value),
        probability: stageId === 'won' ? 100 : Math.min(100, Math.max(0, Math.round(draft.probability))),
        stageId,
        ownerId: draft.ownerId,
        owner: ownerName(draft.ownerId),
        expectedCloseDate: draft.expectedCloseDate,
        source: draft.source,
        priority: draft.priority,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        tags: draft.tags,
        lossReason: stageId === 'lost' ? draft.lossReason : null,
        previousStageId: stageId === 'lost' ? 'new' : null,
      }
      setOpportunities((current) => [created, ...current])
      shiftClosures(null, stageId)
      log({
        opportunityId: created.id,
        type: 'created',
        title: 'Opportunity created',
        description: `${created.name} opened for ${created.company}.`,
      })
      if (created.source === 'Lead conversion') {
        log({
          opportunityId: created.id,
          type: 'converted',
          title: 'Lead converted',
          description: `${created.contact || created.company} entered the pipeline from a converted lead.`,
        })
      }
      if (draft.notes.trim()) {
        const note: OpportunityNote = {
          id: nextId('onote'),
          opportunityId: created.id,
          body: draft.notes.trim(),
          author: 'You',
          at: now,
        }
        setNotes((current) => [note, ...current])
        log({
          opportunityId: created.id,
          type: 'note',
          title: 'Note added',
          description: note.body,
        })
      }
      notify('Opportunity created')
      return created
    },
    [log, notify, shiftClosures],
  )

  const updateOpportunity = useCallback(
    (id: string, draft: OpportunityDraft) => {
      const previous = opportunities.find((item) => item.id === id)
      if (!previous) return
      const now = new Date().toISOString()
      const companyId = companyIdFor(draft.company)
      const linked = contactIdFor(draft.contact, companyId)
      const stageId = draft.stageId
      const next: Opportunity = {
        ...previous,
        name: draft.name.trim(),
        companyId,
        company: draft.company.trim(),
        contactId: linked ?? previous.contactId,
        contact: draft.contact.trim(),
        contactEmail: draft.contactEmail.trim(),
        contactPhone: draft.contactPhone.trim(),
        value: Math.round(draft.value),
        probability: stageId === 'won' ? 100 : Math.min(100, Math.max(0, Math.round(draft.probability))),
        stageId,
        ownerId: draft.ownerId,
        owner: ownerName(draft.ownerId),
        expectedCloseDate: draft.expectedCloseDate,
        source: draft.source,
        priority: draft.priority,
        tags: draft.tags,
        updatedAt: now,
        lastActivityAt: now,
        lossReason: stageId === 'lost' ? draft.lossReason ?? previous.lossReason : null,
        previousStageId: stageId === 'lost' && previous.stageId !== 'lost' ? previous.stageId : previous.previousStageId,
      }
      setOpportunities((current) => current.map((item) => (item.id === id ? next : item)))
      shiftClosures(previous.stageId, stageId)
      if (previous.stageId !== next.stageId) {
        log({
          opportunityId: id,
          type: next.stageId === 'won' ? 'won' : next.stageId === 'lost' ? 'lost' : 'stage',
          title: next.stageId === 'won' ? 'Marked won' : next.stageId === 'lost' ? 'Marked lost' : 'Stage changed',
          description:
            next.stageId === 'lost' && next.lossReason
              ? `${next.name} marked lost. Reason: ${next.lossReason}.`
              : `${next.name} moved to ${stageCatalog[next.stageId].name}.`,
        })
      }
      if (previous.ownerId !== next.ownerId) {
        log({
          opportunityId: id,
          type: 'owner',
          title: 'Owner assigned',
          description: `${next.name} assigned to ${next.owner}.`,
        })
      }
      if (previous.value !== next.value || previous.probability !== next.probability) {
        log({
          opportunityId: id,
          type: 'value',
          title: 'Deal value updated',
          description: `${next.name} is now ${formatCurrency(next.value)} at ${next.probability}%.`,
        })
      }
      notify('Opportunity updated')
    },
    [log, notify, opportunities, shiftClosures],
  )

  const moveStage = useCallback(
    (ids: string[], stageId: PipelineStageId) => {
      if (!isOpenStage(stageId)) return
      const now = new Date().toISOString()
      const selected = opportunities.filter((item) => ids.includes(item.id) && item.stageId !== stageId)
      if (selected.length === 0) return
      let won = 0
      let lost = 0
      for (const item of selected) {
        if (item.stageId === 'won') won -= 1
        if (item.stageId === 'lost') lost -= 1
        log({
          opportunityId: item.id,
          type: 'stage',
          title: 'Stage changed',
          description: `${item.name} moved to ${stageCatalog[stageId].name}.`,
        })
      }
      if (won !== 0 || lost !== 0) setDeltas((current) => ({ won: current.won + won, lost: current.lost + lost }))
      setOpportunities((current) =>
        current.map((item) =>
          ids.includes(item.id) && item.stageId !== stageId
            ? { ...item, stageId, lossReason: null, updatedAt: now, lastActivityAt: now }
            : item,
        ),
      )
      const label = stageCatalog[stageId].name
      notify(selected.length === 1 ? `${selected[0].name} moved to ${label}.` : `${selected.length} opportunities moved to ${label}.`)
    },
    [log, notify, opportunities],
  )

  const markWon = useCallback(
    (id: string) => {
      const current = opportunities.find((item) => item.id === id)
      if (!current) return
      if (current.stageId === 'won') {
        notify('Opportunity is already won.')
        return
      }
      const now = new Date().toISOString()
      shiftClosures(current.stageId, 'won')
      setOpportunities((rows) =>
        rows.map((item) =>
          item.id === id
            ? { ...item, stageId: 'won', probability: 100, lossReason: null, updatedAt: now, lastActivityAt: now }
            : item,
        ),
      )
      log({
        opportunityId: id,
        type: 'won',
        title: 'Marked won',
        description: `${current.name} closed at ${formatCurrency(current.value)}.`,
      })
      notify(`${current.name} marked won.`)
    },
    [log, notify, opportunities, shiftClosures],
  )

  const markLost = useCallback(
    (id: string, reason: LossReason) => {
      const current = opportunities.find((item) => item.id === id)
      if (!current) return
      if (current.stageId === 'lost') {
        notify('Opportunity is already lost.')
        return
      }
      const now = new Date().toISOString()
      shiftClosures(current.stageId, 'lost')
      setOpportunities((rows) =>
        rows.map((item) =>
          item.id === id
            ? {
                ...item,
                stageId: 'lost',
                previousStageId: current.stageId,
                lossReason: reason,
                updatedAt: now,
                lastActivityAt: now,
              }
            : item,
        ),
      )
      log({
        opportunityId: id,
        type: 'lost',
        title: 'Marked lost',
        description: `${current.name} marked lost. Reason: ${reason}.`,
      })
      notify(`${current.name} marked lost.`)
    },
    [log, notify, opportunities, shiftClosures],
  )

  const restore = useCallback(
    (id: string) => {
      const current = opportunities.find((item) => item.id === id)
      if (!current || current.stageId !== 'lost') return
      const target = current.previousStageId && isOpenStage(current.previousStageId) ? current.previousStageId : 'new'
      const now = new Date().toISOString()
      shiftClosures('lost', target)
      setOpportunities((rows) =>
        rows.map((item) =>
          item.id === id ? { ...item, stageId: target, lossReason: null, updatedAt: now, lastActivityAt: now } : item,
        ),
      )
      log({
        opportunityId: id,
        type: 'restored',
        title: 'Opportunity restored',
        description: `${current.name} returned to ${stageCatalog[target].name}.`,
      })
      notify(`${current.name} restored to ${stageCatalog[target].name}.`)
    },
    [log, notify, opportunities, shiftClosures],
  )

  const assignOwner = useCallback(
    (ids: string[], ownerId: string) => {
      const now = new Date().toISOString()
      const name = ownerName(ownerId)
      const selected = opportunities.filter((item) => ids.includes(item.id) && item.ownerId !== ownerId)
      if (selected.length === 0) return
      setOpportunities((current) =>
        current.map((item) => (ids.includes(item.id) && item.ownerId !== ownerId ? { ...item, ownerId, owner: name, updatedAt: now, lastActivityAt: now } : item)),
      )
      for (const item of selected) {
        log({
          opportunityId: item.id,
          type: 'owner',
          title: 'Owner assigned',
          description: `${item.name} assigned to ${name}.`,
        })
      }
      notify(selected.length === 1 ? `${selected[0].name} assigned to ${name}.` : `${selected.length} owners updated.`)
    },
    [log, notify, opportunities],
  )

  const setPriority = useCallback(
    (ids: string[], priority: OpportunityPriority) => {
      const now = new Date().toISOString()
      const selected = opportunities.filter((item) => ids.includes(item.id) && item.priority !== priority)
      if (selected.length === 0) return
      setOpportunities((current) =>
        current.map((item) => (ids.includes(item.id) && item.priority !== priority ? { ...item, priority, updatedAt: now, lastActivityAt: now } : item)),
      )
      notify(selected.length === 1 ? `Priority set to ${priority}.` : `${selected.length} priorities updated.`)
    },
    [notify, opportunities],
  )

  const addNote = useCallback(
    (opportunityId: string, body: string) => {
      const opportunity = opportunities.find((item) => item.id === opportunityId)
      if (!opportunity || !body.trim()) return
      const now = new Date().toISOString()
      const note: OpportunityNote = { id: nextId('onote'), opportunityId, body: body.trim(), author: 'You', at: now }
      setNotes((current) => [note, ...current])
      setOpportunities((current) => current.map((item) => (item.id === opportunityId ? { ...item, lastActivityAt: now, updatedAt: now } : item)))
      log({ opportunityId, type: 'note', title: 'Note added', description: note.body })
      notify('Note added')
    },
    [log, notify, opportunities],
  )

  const addTask = useCallback(
    (opportunityId: string, draft: TaskDraft) => {
      const opportunity = opportunities.find((item) => item.id === opportunityId)
      if (!opportunity) return
      const now = new Date().toISOString()
      const task: OpportunityTask = {
        id: nextId('otask'),
        opportunityId,
        title: draft.title,
        description: draft.description,
        dueAt: draft.dueAt,
        priority: draft.priority,
        assignee: draft.assignee,
        done: false,
      }
      setTasks((current) => [task, ...current])
      setOpportunities((current) => current.map((item) => (item.id === opportunityId ? { ...item, lastActivityAt: now, updatedAt: now } : item)))
      log({
        opportunityId,
        type: 'task',
        title: 'Follow-up scheduled',
        description: `${task.title} assigned to ${task.assignee}.`,
      })
      notify('Task created')
    },
    [log, notify, opportunities],
  )

  const completeTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((item) => item.id === taskId)
      if (!task || task.done) return
      const now = new Date().toISOString()
      setTasks((current) => current.map((item) => (item.id === taskId ? { ...item, done: true } : item)))
      setOpportunities((current) => current.map((item) => (item.id === task.opportunityId ? { ...item, lastActivityAt: now, updatedAt: now } : item)))
      log({
        opportunityId: task.opportunityId,
        type: 'task',
        title: 'Task completed',
        description: task.title,
      })
      notify('Task completed')
    },
    [log, notify, tasks],
  )

  const dismissToast = useCallback(() => setToast(null), [])

  const value = useMemo<PipelineContextValue>(
    () => ({
      opportunities,
      activities,
      tasks,
      notes,
      metrics,
      toast,
      dismissToast,
      report: notify,
      addOpportunity,
      updateOpportunity,
      moveStage,
      markWon,
      markLost,
      restore,
      assignOwner,
      setPriority,
      addNote,
      addTask,
      completeTask,
    }),
    [
      activities,
      addNote,
      addOpportunity,
      addTask,
      assignOwner,
      completeTask,
      dismissToast,
      markLost,
      markWon,
      metrics,
      moveStage,
      notify,
      notes,
      opportunities,
      restore,
      setPriority,
      tasks,
      toast,
      updateOpportunity,
    ],
  )

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>
}

export function usePipeline() {
  const context = useContext(PipelineContext)
  if (!context) throw new Error('usePipeline must be used within PipelineProvider')
  return context
}

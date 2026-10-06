import { LeadActivityTimeline } from '@/components/leads/LeadActivityTimeline'
import { LeadCapture } from '@/components/leads/LeadCapture'
import { LeadEngagement } from '@/components/leads/LeadEngagement'
import { LeadNotes } from '@/components/leads/LeadNotes'
import { LeadProfile } from '@/components/leads/LeadProfile'
import { LeadQuickActions } from '@/components/leads/LeadQuickActions'
import { LeadScore } from '@/components/leads/LeadScore'
import { LeadStatusBadge } from '@/components/leads/LeadStatus'
import { Button } from '@/components/ui/Button'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { formatDue } from '@/data/crm/time'
import { leadName, leadOwners, leadStatuses, type LeadActivity, type LeadNote, type LeadStatus, type LeadTask, type SalesLead } from '@/data/leads'

export function LeadDetail({
  lead,
  activities,
  notes,
  tasks,
  noteOpen,
  onBack,
  onEdit,
  onQualify,
  onConvert,
  onTask,
  onNote,
  onSaveNote,
  onStatus,
  onAssign,
}: {
  lead: SalesLead
  activities: LeadActivity[]
  notes: LeadNote[]
  tasks: LeadTask[]
  noteOpen: boolean
  onBack: () => void
  onEdit: () => void
  onQualify: () => void
  onConvert: () => void
  onTask: () => void
  onNote: () => void
  onSaveNote: (body: string) => void
  onStatus: (status: LeadStatus) => void
  onAssign: (owner: string) => void
}) {
  const openTasks = tasks.filter((task) => !task.done)
  const more = [
    { id: 'convert', label: 'Convert lead', onSelect: onConvert },
    ...leadStatuses.map((status) => ({ id: status, label: `Mark ${status}`, onSelect: () => onStatus(status) })),
    ...leadOwners.map((owner) => ({ id: owner, label: `Assign ${owner}`, onSelect: () => onAssign(owner) })),
  ]
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button type="button" className="cursor-pointer text-sm text-muted hover:text-copy" onClick={onBack}>
          Back to Leads
        </button>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl text-copy sm:text-4xl">{leadName(lead)}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="text-copy">{lead.company}</span>
              <LeadStatusBadge status={lead.status} />
              <span>{lead.owner}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LeadScore score={lead.score} size="lg" />
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" onClick={onQualify}>
              Qualify
            </Button>
            <Button variant="outline" onClick={onTask}>
              Create task
            </Button>
            <Button onClick={onNote}>Add note</Button>
            <RowMenu label="More actions" items={more} />
          </div>
        </div>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-6">
          <LeadProfile lead={lead} onEdit={onEdit} />
          <section className="border border-stroke bg-surface-raised">
            <div className="border-b border-stroke px-4 py-3">
              <h2 className="font-display text-lg text-copy">Activity</h2>
            </div>
            <div className="px-4">
              <LeadActivityTimeline items={activities} />
            </div>
          </section>
          <section className="border border-stroke bg-surface-raised">
            <div className="border-b border-stroke px-4 py-3">
              <h2 className="font-display text-lg text-copy">Follow-ups</h2>
            </div>
            {openTasks.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No tasks on this lead.</p> : null}
            <ul>
              {openTasks.map((task) => (
                <li key={task.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                  <p className="text-sm text-copy">{task.title}</p>
                  <p className="text-sm text-muted">
                    {task.priority} · {task.assignee} · {formatDue(task.dueAt)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <LeadNotes notes={notes} open={noteOpen} onOpen={onNote} onSave={onSaveNote} />
        </div>
        <aside className="flex flex-col gap-4">
          <LeadQuickActions
            email={lead.email}
            phone={lead.phone}
            status={lead.status}
            owner={lead.owner}
            onTask={onTask}
            onNote={onNote}
            onQualify={onQualify}
            onConvert={onConvert}
            onStatus={onStatus}
            onAssign={onAssign}
          />
          <LeadEngagement engagement={lead.engagement} />
          <LeadCapture lead={lead} />
        </aside>
      </div>
    </div>
  )
}

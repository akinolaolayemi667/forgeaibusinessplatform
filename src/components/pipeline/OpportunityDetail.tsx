import { OpportunityNotes } from '@/components/pipeline/OpportunityNotes'
import { OpportunityStageControl } from '@/components/pipeline/OpportunityStageControl'
import { OpportunityProbability } from '@/components/pipeline/OpportunityProbability'
import { OpportunityProfile } from '@/components/pipeline/OpportunityProfile'
import { OpportunityProgress } from '@/components/pipeline/OpportunityProgress'
import { OpportunityQuickActions } from '@/components/pipeline/OpportunityQuickActions'
import { OpportunityTimeline } from '@/components/pipeline/OpportunityTimeline'
import { OpportunityValue } from '@/components/pipeline/OpportunityValue'
import { PipelineStageBadge } from '@/components/pipeline/PipelineStageBadge'
import { Button } from '@/components/ui/Button'
import { RowMenu } from '@/components/crm/book/RowMenu'
import { formatDue } from '@/data/crm/time'
import { formatCurrency } from '@/utils/format'
import {
  pipelineOwners,
  weightedValue,
  type Opportunity,
  type OpportunityActivity,
  type OpportunityNote,
  type OpportunityTask,
  type PipelineStageId,
} from '@/data/pipeline'

export function OpportunityDetail({
  opportunity,
  activities,
  notes,
  tasks,
  noteOpen,
  onBack,
  onEdit,
  onStage,
  onTask,
  onNote,
  onSaveNote,
  onWon,
  onLost,
  onRestore,
  onAssign,
  onCompleteTask,
  onUnavailable,
}: {
  opportunity: Opportunity
  activities: OpportunityActivity[]
  notes: OpportunityNote[]
  tasks: OpportunityTask[]
  noteOpen: boolean
  onBack: () => void
  onEdit: () => void
  onStage: (stageId: PipelineStageId) => void
  onTask: () => void
  onNote: () => void
  onSaveNote: (body: string) => void
  onWon: () => void
  onLost: () => void
  onRestore: () => void
  onAssign: (ownerId: string) => void
  onCompleteTask: (taskId: string) => void
  onUnavailable: (message: string) => void
}) {
  const weighted = weightedValue(opportunity.value, opportunity.probability)
  const openTasks = tasks.filter((task) => !task.done)
  const doneTasks = tasks.filter((task) => task.done)
  const more = [
    ...pipelineOwners.map((owner) => ({ id: owner.id, label: `Assign ${owner.name}`, onSelect: () => onAssign(owner.id) })),
    ...(opportunity.stageId === 'lost' ? [{ id: 'restore', label: 'Restore opportunity', onSelect: onRestore }] : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button type="button" className="cursor-pointer text-sm text-muted hover:text-copy" onClick={onBack}>
          Back to Pipeline
        </button>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl text-copy sm:text-4xl">{opportunity.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="text-copy">{opportunity.company}</span>
              <PipelineStageBadge stageId={opportunity.stageId} />
              <span>{opportunity.owner}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-44">
              <OpportunityStageControl id="opp-header-stage" stageId={opportunity.stageId} onChange={onStage} />
            </div>
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" onClick={onTask}>
              Create task
            </Button>
            <Button onClick={onNote}>Add note</Button>
            <Button variant="outline" onClick={onWon}>
              Mark won
            </Button>
            <Button variant="outline" onClick={onLost}>
              Mark lost
            </Button>
            {opportunity.stageId === 'lost' ? (
              <Button variant="outline" onClick={onRestore}>
                Restore opportunity
              </Button>
            ) : null}
            <RowMenu label="More actions" items={more} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <section className="border border-stroke bg-surface-raised p-4">
            <h2 className="type-kicker text-muted">Deal value</h2>
            <OpportunityValue value={opportunity.value} size="lg" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="type-kicker text-muted">Probability</p>
                <div className="mt-1">
                  <OpportunityProbability probability={opportunity.probability} />
                </div>
              </div>
              <div>
                <p className="type-kicker text-muted">Weighted</p>
                <p className="type-data mt-1 text-sm text-ember">{formatCurrency(weighted)}</p>
              </div>
            </div>
          </section>
          <OpportunityProfile opportunity={opportunity} />
          <section className="border border-stroke bg-surface-raised">
            <header className="border-b border-stroke px-4 py-3">
              <h2 className="font-display text-lg text-copy">Activity</h2>
            </header>
            <div className="px-4">
              <OpportunityTimeline items={activities} />
            </div>
          </section>
          <OpportunityNotes notes={notes} open={noteOpen} onOpen={onNote} onSave={onSaveNote} />
          <section className="border border-stroke bg-surface-raised">
            <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
              <h2 className="font-display text-lg text-copy">Tasks</h2>
              <Button size="sm" variant="outline" onClick={onTask}>
                Create task
              </Button>
            </div>
            {tasks.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No tasks on this opportunity.</p> : null}
            <ul>
              {openTasks.map((task) => (
                <li key={task.id} className="flex flex-col gap-2 border-b border-stroke px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-copy">{task.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {task.priority} · {task.assignee} · {formatDue(task.dueAt)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onCompleteTask(task.id)}>
                    Mark complete
                  </Button>
                </li>
              ))}
              {doneTasks.map((task) => (
                <li key={task.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                  <p className="text-sm text-muted">{task.title}</p>
                  <p className="mt-1 text-xs text-muted">Completed · {task.assignee}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="flex flex-col gap-4">
          <OpportunityProgress stageId={opportunity.stageId} />
          <OpportunityQuickActions
            opportunity={opportunity}
            onTask={onTask}
            onNote={onNote}
            onStage={onStage}
            onAssign={onAssign}
            onWon={onWon}
            onLost={onLost}
            onRestore={onRestore}
            onUnavailable={onUnavailable}
          />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { OpportunityDetail } from '@/components/pipeline/OpportunityDetail'
import { OpportunityForm, opportunityToDraft } from '@/components/pipeline/OpportunityForm'
import { OpportunityLostModal } from '@/components/pipeline/OpportunityLostModal'
import { OpportunityWonModal } from '@/components/pipeline/OpportunityWonModal'
import { PipelineEmptyState } from '@/components/pipeline/PipelineEmptyState'
import { TaskForm } from '@/components/crm/book/TaskForm'
import { Modal } from '@/components/ui/Modal'
import type { PipelineStageId } from '@/data/pipeline'
import { usePageTitle } from '@/hooks/usePageTitle'
import { usePipeline } from '@/hooks/usePipeline'

export function OpportunityRecordPage() {
  const { opportunityId = '' } = useParams()
  const navigate = useNavigate()
  const {
    opportunities,
    activities,
    notes,
    tasks,
    updateOpportunity,
    moveStage,
    markWon,
    markLost,
    restore,
    assignOwner,
    addNote,
    addTask,
    completeTask,
    report,
  } = usePipeline()
  const opportunity = opportunities.find((item) => item.id === opportunityId)
  const [editing, setEditing] = useState(false)
  const [tasking, setTasking] = useState(false)
  const [noting, setNoting] = useState(false)
  const [winning, setWinning] = useState(false)
  const [losing, setLosing] = useState(false)
  usePageTitle(opportunity ? `${opportunity.name} · FORGE` : 'Opportunity details · FORGE')

  useEffect(() => {
    if (!noting) return
    document.getElementById('opportunity-note-body')?.focus()
  }, [noting])

  if (!opportunity) {
    return (
      <PipelineEmptyState
        title="Opportunity not found"
        description="This record is not in the current workspace."
        action={
          <Link to="/app/pipeline" className="text-sm text-copy no-underline hover:text-ember">
            Back to pipeline
          </Link>
        }
      />
    )
  }

  const current = opportunity

  function changeStage(stageId: PipelineStageId) {
    if (stageId === 'won') {
      setWinning(true)
      return
    }
    if (stageId === 'lost') {
      setLosing(true)
      return
    }
    moveStage([current.id], stageId)
  }

  return (
    <>
      <OpportunityDetail
        opportunity={current}
        activities={activities.filter((item) => item.opportunityId === current.id)}
        notes={notes.filter((item) => item.opportunityId === current.id)}
        tasks={tasks.filter((item) => item.opportunityId === current.id)}
        noteOpen={noting}
        onBack={() => navigate('/app/pipeline')}
        onEdit={() => setEditing(true)}
        onStage={changeStage}
        onTask={() => setTasking(true)}
        onNote={() => setNoting(true)}
        onSaveNote={(body) => {
          addNote(current.id, body)
          setNoting(false)
        }}
        onWon={() => setWinning(true)}
        onLost={() => setLosing(true)}
        onRestore={() => restore(current.id)}
        onAssign={(ownerId) => assignOwner([current.id], ownerId)}
        onCompleteTask={completeTask}
        onUnavailable={report}
      />
      <Modal open={editing} title="Edit opportunity" onClose={() => setEditing(false)}>
        <OpportunityForm
          mode="edit"
          initial={opportunityToDraft(current)}
          onSubmit={(draft) => {
            updateOpportunity(current.id, draft)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </Modal>
      <Modal open={tasking} title="Create task" onClose={() => setTasking(false)}>
        <TaskForm
          assignee={current.owner}
          onSubmit={(draft) => {
            addTask(current.id, draft)
            setTasking(false)
          }}
          onCancel={() => setTasking(false)}
        />
      </Modal>
      <OpportunityWonModal
        opportunity={current}
        open={winning}
        onClose={() => setWinning(false)}
        onConfirm={() => {
          markWon(current.id)
          setWinning(false)
        }}
      />
      <OpportunityLostModal
        opportunity={current}
        open={losing}
        onClose={() => setLosing(false)}
        onConfirm={(reason) => {
          markLost(current.id, reason)
          setLosing(false)
        }}
      />
    </>
  )
}

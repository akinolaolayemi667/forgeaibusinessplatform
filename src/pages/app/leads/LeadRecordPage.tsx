import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LeadConversionModal } from '@/components/leads/LeadConversionModal'
import { LeadDetail } from '@/components/leads/LeadDetail'
import { LeadEmptyState } from '@/components/leads/LeadEmptyState'
import { LeadForm, leadToDraft } from '@/components/leads/LeadForm'
import { LeadQualificationModal } from '@/components/leads/LeadQualificationModal'
import { TaskForm } from '@/components/crm/book/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { leadName, type LeadStatus } from '@/data/leads'
import { useLeads } from '@/hooks/useLeads'
import { usePageTitle } from '@/hooks/usePageTitle'

export function LeadRecordPage() {
  const { leadId = '' } = useParams()
  const navigate = useNavigate()
  const { leads, activities, notes, tasks, updateLead, setStatus, assignOwner, qualify, convert, addNote, addTask } = useLeads()
  const lead = leads.find((item) => item.id === leadId)
  const [editing, setEditing] = useState(false)
  const [tasking, setTasking] = useState(false)
  const [noting, setNoting] = useState(false)
  const [converting, setConverting] = useState(false)
  const [qualifying, setQualifying] = useState(false)
  usePageTitle(lead ? `${leadName(lead)} · FORGE` : 'Lead details · FORGE')

  useEffect(() => {
    if (!noting) return
    document.getElementById('lead-note-body')?.focus()
  }, [noting])

  if (!lead) {
    return (
      <LeadEmptyState
        title="Lead not found"
        description="This record is not in the current workspace."
        action={
          <Link to="/app/leads" className="text-sm text-copy no-underline hover:text-ember">
            Back to leads
          </Link>
        }
      />
    )
  }

  const current = lead

  function changeStatus(status: LeadStatus) {
    if (status === 'Converted') {
      setConverting(true)
      return
    }
    setStatus([current.id], status)
  }

  return (
    <>
      <LeadDetail
        lead={current}
        activities={activities.filter((item) => item.leadId === current.id).sort((a, b) => b.at.localeCompare(a.at))}
        notes={notes.filter((item) => item.leadId === current.id).sort((a, b) => b.at.localeCompare(a.at))}
        tasks={tasks.filter((item) => item.leadId === current.id)}
        noteOpen={noting}
        onBack={() => navigate('/app/leads')}
        onEdit={() => setEditing(true)}
        onQualify={() => setQualifying(true)}
        onConvert={() => {
          if (current.status !== 'Converted') setConverting(true)
        }}
        onTask={() => setTasking(true)}
        onNote={() => setNoting(true)}
        onSaveNote={(body) => addNote(current.id, body)}
        onStatus={changeStatus}
        onAssign={(owner) => assignOwner([current.id], owner)}
      />
      <Modal open={editing} title="Edit lead" onClose={() => setEditing(false)}>
        <LeadForm
          initial={leadToDraft(current)}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(draft) => {
            updateLead(current.id, draft)
            setEditing(false)
          }}
        />
      </Modal>
      <Modal open={tasking} title="Create task" description="Schedule a follow-up on this lead." onClose={() => setTasking(false)}>
        <TaskForm
          assignee={current.owner}
          onCancel={() => setTasking(false)}
          onSubmit={(draft) => {
            addTask(current.id, draft)
            setTasking(false)
          }}
        />
      </Modal>
      <LeadConversionModal
        lead={current}
        open={converting}
        onClose={() => setConverting(false)}
        onConfirm={() => {
          convert(current.id)
          setConverting(false)
        }}
      />
      <LeadQualificationModal
        lead={current}
        count={1}
        open={qualifying}
        onClose={() => setQualifying(false)}
        onConfirm={() => {
          qualify(current.id)
          setQualifying(false)
        }}
      />
    </>
  )
}

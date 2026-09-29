import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContactDetail } from '@/components/crm/book/ContactDetail'
import { ContactForm } from '@/components/crm/book/ContactForm'
import { CRMEmptyState } from '@/components/crm/book/CRMEmptyState'
import { TaskForm } from '@/components/crm/book/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { contactName, type ContactDraft, type CrmContact } from '@/data/crm'
import { useCrm } from '@/hooks/useCrm'
import { usePageTitle } from '@/hooks/usePageTitle'

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

export function CrmContactPage() {
  const { contactId = '' } = useParams()
  const navigate = useNavigate()
  const { contacts, companies, activities, notes, companyName, updateContact, setStatus, assignOwner, addNote, addTask } = useCrm()
  const contact = contacts.find((item) => item.id === contactId)
  const [editing, setEditing] = useState(false)
  const [tasking, setTasking] = useState(false)
  const [noting, setNoting] = useState(false)
  usePageTitle(contact ? `${contactName(contact)} · FORGE` : 'Contact details · FORGE')

  useEffect(() => {
    if (!noting) return
    document.getElementById('note-body')?.focus()
  }, [noting])

  if (!contact) {
    return (
      <CRMEmptyState
        title="Contact not found"
        description="This record is not in the current workspace."
        action={
          <Link to="/app/crm/contacts" className="text-sm text-copy no-underline hover:text-ember">
            Back to contacts
          </Link>
        }
      />
    )
  }

  const recordActivities = activities
    .filter((item) => item.contactId === contact.id)
    .sort((a, b) => b.at.localeCompare(a.at))
  const recordNotes = notes.filter((item) => item.contactId === contact.id).sort((a, b) => b.at.localeCompare(a.at))

  return (
    <>
      <ContactDetail
        contact={contact}
        company={companyName(contact.companyId)}
        activities={recordActivities}
        notes={recordNotes}
        noteOpen={noting}
        onBack={() => navigate('/app/crm/contacts')}
        onEdit={() => setEditing(true)}
        onTask={() => setTasking(true)}
        onNote={() => setNoting(true)}
        onSaveNote={(body) => addNote({ body, contactId: contact.id, companyId: contact.companyId || undefined })}
        onStatus={(status) => setStatus([contact.id], status)}
        onAssign={(owner) => assignOwner([contact.id], owner)}
      />
      <Modal open={editing} title="Edit contact" onClose={() => setEditing(false)}>
        <ContactForm
          initial={toDraft(contact)}
          companies={companies}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(draft) => {
            updateContact(contact.id, draft)
            setEditing(false)
          }}
        />
      </Modal>
      <Modal open={tasking} title="Create task" description="Schedule a follow-up on this contact." onClose={() => setTasking(false)}>
        <TaskForm
          assignee={contact.owner}
          onCancel={() => setTasking(false)}
          onSubmit={(draft) => {
            addTask({ ...draft, contactId: contact.id, companyId: contact.companyId || undefined })
            setTasking(false)
          }}
        />
      </Modal>
    </>
  )
}

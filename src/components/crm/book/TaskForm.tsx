import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { FieldSelect } from '@/components/crm/book/fields'
import { crmOwners, taskPriorities, type TaskDraft, type TaskPriority } from '@/data/crm'

export function TaskForm({
  assignee,
  onSubmit,
  onCancel,
}: {
  assignee: string
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [due, setDue] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [owner, setOwner] = useState(assignee || crmOwners[0])
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Enter a task title.')
      return
    }
    if (!due) {
      setError('Choose a due date.')
      return
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueAt: new Date(`${due}T12:00:00`).toISOString(),
      priority,
      assignee: owner,
    })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
      <TextField id="task-title" label="Task title" value={title} error={error && !title.trim() ? error : undefined} onChange={setTitle} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-description" className="text-sm font-medium text-copy">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="rounded-sm border border-stroke bg-surface px-3 py-2 text-sm text-copy outline-none focus-visible:border-ember"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="task-due" label="Due date" type="date" value={due} error={error && !due ? error : undefined} onChange={setDue} />
        <FieldSelect id="task-priority" label="Priority" value={priority} onChange={(value) => setPriority(value as TaskPriority)}>
          {taskPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect id="task-owner" label="Assigned to" value={owner} onChange={setOwner}>
          {crmOwners.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FieldSelect>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create task</Button>
      </div>
    </form>
  )
}

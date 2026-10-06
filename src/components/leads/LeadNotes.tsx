import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatActivityWhen } from '@/data/crm/time'
import type { LeadNote } from '@/data/leads'

export function LeadNotes({
  notes,
  open,
  onOpen,
  onSave,
}: {
  notes: LeadNote[]
  open: boolean
  onOpen: () => void
  onSave: (body: string) => void
}) {
  const [body, setBody] = useState('')
  return (
    <section id="lead-notes" className="border border-stroke bg-surface-raised">
      <div className="flex items-center justify-between gap-3 border-b border-stroke px-4 py-3">
        <h2 className="font-display text-lg text-copy">Notes</h2>
        <Button size="sm" variant="outline" onClick={onOpen}>
          Add note
        </Button>
      </div>
      {open ? (
        <form
          className="border-b border-stroke px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (!body.trim()) return
            onSave(body)
            setBody('')
          }}
        >
          <label htmlFor="lead-note-body" className="text-sm font-medium text-copy">
            Note
          </label>
          <textarea
            id="lead-note-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-sm border border-stroke bg-surface px-3 py-2 text-sm text-copy outline-none focus-visible:border-ember"
            placeholder="Decision maker confirmed interest in automated lead qualification."
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" size="sm">
              Save note
            </Button>
          </div>
        </form>
      ) : null}
      {notes.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No notes on this lead.</p> : null}
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-copy">{note.author}</p>
              <time className="type-data text-[11px] text-muted" dateTime={note.at}>
                {formatActivityWhen(note.at)}
              </time>
            </div>
            <p className="mt-1 text-sm text-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

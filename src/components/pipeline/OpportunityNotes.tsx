import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatActivityWhen } from '@/data/crm/time'
import type { OpportunityNote } from '@/data/pipeline'

export function OpportunityNotes({
  notes,
  open,
  onOpen,
  onSave,
}: {
  notes: OpportunityNote[]
  open: boolean
  onOpen: () => void
  onSave: (body: string) => void
}) {
  const [body, setBody] = useState('')
  return (
    <section id="opportunity-notes" className="border border-stroke bg-surface-raised">
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
          <label htmlFor="opportunity-note-body" className="text-sm font-medium text-copy">
            Note
          </label>
          <textarea
            id="opportunity-note-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-sm border border-stroke bg-surface px-3 py-2 text-sm text-copy outline-none focus-visible:border-ember"
            placeholder="Procurement team requested revised implementation timeline."
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" size="sm">
              Save note
            </Button>
          </div>
        </form>
      ) : null}
      {notes.length === 0 ? <p className="px-4 py-4 text-sm text-muted">No notes on this opportunity.</p> : null}
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

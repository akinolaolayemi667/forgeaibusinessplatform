import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Search } from 'lucide-react'
import { forgeData } from '@/data'
import { appNav } from '@/data/navigation'
import { useWorkspace } from '@/hooks/useWorkspace'
import { trapTabKey } from '@/utils/focus'

type Hit = {
  id: string
  group: string
  label: string
  hint: string
  to: string
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { workspace } = useWorkspace()
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    let alive = true
    setLoading(true)
    Promise.all([
      forgeData.listLeads(workspace.id),
      forgeData.listContacts(workspace.id),
      forgeData.listDeals(workspace.id),
      forgeData.listAutomations(workspace.id),
    ])
      .then(([leads, contacts, deals, automations]) => {
        if (!alive) return
        setRecords([
          ...leads.map((lead) => ({
            id: lead.id,
            group: 'Leads',
            label: lead.name,
            hint: lead.company,
            to: '/app/leads',
          })),
          ...contacts.map((contact) => ({
            id: contact.id,
            group: 'Contacts',
            label: contact.name,
            hint: contact.company,
            to: '/app/contacts',
          })),
          ...deals.map((deal) => ({
            id: deal.id,
            group: 'Pipeline',
            label: deal.name,
            hint: deal.company,
            to: '/app/pipeline',
          })),
          ...automations.map((automation) => ({
            id: automation.id,
            group: 'Automations',
            label: automation.name,
            hint: automation.status,
            to: '/app/automations',
          })),
        ])
      })
      .catch(() => {
        if (alive) setRecords([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [open, workspace.id])

  const pages = useMemo(
    () =>
      appNav.map((item) => ({
        id: item.to,
        group: 'Pages',
        label: item.label,
        hint: 'Open page',
        to: item.to,
      })),
    [],
  )

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const pool = needle ? [...pages, ...records] : pages
    if (!needle) return pool
    return pool.filter((hit) => `${hit.label} ${hit.hint} ${hit.group}`.toLowerCase().includes(needle))
  }, [pages, query, records])

  useEffect(() => {
    setActive(0)
  }, [query, results.length])

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
      const panel = panelRef.current
      if (panel) trapTabKey(event, panel)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(hit: Hit | undefined) {
    if (!hit) return
    onClose()
    navigate(hit.to)
  }

  if (!open) return null

  const current = results[active]
  const groups = groupHits(results)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-theme="iron"
        className="relative z-10 flex max-h-[70dvh] w-full max-w-xl flex-col border border-stroke bg-surface text-copy shadow-md outline-none"
      >
        <h2 id={titleId} className="sr-only">
          Search the workspace
        </h2>
        <div className="flex items-center gap-2 border-b border-stroke px-3">
          <Search aria-hidden size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={current ? `${listId}-${current.id}` : undefined}
            aria-autocomplete="list"
            placeholder="Search pages and records"
            className="h-12 w-full bg-transparent text-sm text-copy outline-none placeholder:text-muted"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((index) => (results.length === 0 ? 0 : (index - 1 + results.length) % results.length))
              } else if (event.key === 'Enter') {
                event.preventDefault()
                choose(current)
              }
            }}
          />
        </div>
        <div id={listId} role="listbox" aria-label="Search results" className="min-h-0 flex-1 overflow-y-auto p-2">
          {loading && query.trim() ? <p className="px-2 py-3 text-sm text-muted">Loading records…</p> : null}
          {!loading && results.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted">No matching pages or records.</p>
          ) : null}
          {groups.map((group) => (
            <div key={group.name} role="group" aria-label={group.name} className="mb-2">
              <p className="type-kicker px-2 py-1 text-muted">{group.name}</p>
              <ul>
                {group.hits.map((hit) => {
                  const index = results.indexOf(hit)
                  const selected = index === active
                  return (
                    <li key={hit.id}>
                      <button
                        id={`${listId}-${hit.id}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={
                          selected
                            ? 'flex w-full cursor-pointer items-center justify-between gap-3 bg-wash px-2 py-2 text-left'
                            : 'flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-2 text-left hover:bg-wash'
                        }
                        onMouseEnter={() => setActive(index)}
                        onClick={() => choose(hit)}
                      >
                        <span className="truncate text-sm text-copy">{hit.label}</span>
                        <span className="shrink-0 text-xs text-muted">{hit.hint}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-stroke px-3 py-2 text-xs text-muted">Enter opens the selection. Esc closes.</p>
      </div>
    </div>,
    document.body,
  )
}

function groupHits(hits: Hit[]) {
  const order: string[] = []
  const map = new Map<string, Hit[]>()
  for (const hit of hits) {
    const list = map.get(hit.group)
    if (list) list.push(hit)
    else {
      map.set(hit.group, [hit])
      order.push(hit.group)
    }
  }
  return order.map((name) => ({ name, hits: map.get(name) ?? [] }))
}

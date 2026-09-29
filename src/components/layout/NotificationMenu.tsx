import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { forgeData } from '@/data'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'
import { readStorage, writeStorage } from '@/lib/storage'
import { cn } from '@/lib/cn'
import type { Automation, Briefing, Conversation } from '@/types'

type Notice = {
  id: string
  title: string
  detail: string
  href: string
}

const READ_KEY = 'forge.notices.read'

function readIds() {
  const stored = readStorage(READ_KEY)
  return Array.isArray(stored) && stored.every((item) => typeof item === 'string') ? stored : []
}

function buildNotices(conversations: Conversation[], automations: Automation[], briefings: Briefing[]): Notice[] {
  return [
    ...conversations
      .filter((item) => item.unread)
      .map((item) => ({
        id: item.id,
        title: `${item.contact} is waiting`,
        detail: item.preview,
        href: '/app/conversations',
      })),
    ...briefings.map((item) => ({
      id: item.id,
      title: `Briefing · ${item.account}`,
      detail: item.nextStep,
      href: '/app/ai',
    })),
    ...automations
      .filter((item) => item.status === 'Paused')
      .map((item) => ({
        id: item.id,
        title: `${item.name} is paused`,
        detail: item.trigger,
        href: '/app/automations',
      })),
  ]
}

export function NotificationMenu() {
  const { workspace } = useWorkspace()
  const navigate = useNavigate()
  const query = useAsyncData(`notices:${workspace.id}`, async () => {
    const [conversations, automations, briefings] = await Promise.all([
      forgeData.listConversations(workspace.id),
      forgeData.listAutomations(workspace.id),
      forgeData.listBriefings(workspace.id),
    ])
    return buildNotices(conversations, automations, briefings)
  })
  const [read, setRead] = useState<string[]>(readIds)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  useClickOutside(rootRef, () => setOpen(false), open)

  const notices = query.data ?? []
  const unread = notices.filter((notice) => !read.includes(notice.id))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function mark(ids: string[]) {
    const next = Array.from(new Set([...read, ...ids]))
    setRead(next)
    writeStorage(READ_KEY, next)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-sm text-copy hover:bg-wash"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={unread.length > 0 ? `Notifications, ${unread.length} unread` : 'Notifications'}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell aria-hidden size={16} />
        {unread.length > 0 ? <span className="absolute top-2 right-2 size-1.5 bg-ember" aria-hidden /> : null}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] border border-stroke bg-surface-overlay shadow-md"
        >
          <div className="flex items-center justify-between gap-3 border-b border-stroke px-3 py-2">
            <p className="type-kicker text-muted">Notifications</p>
            <button
              type="button"
              className="cursor-pointer text-xs text-copy hover:text-ember disabled:cursor-not-allowed disabled:text-muted"
              disabled={unread.length === 0}
              onClick={() => mark(notices.map((notice) => notice.id))}
            >
              Mark read
            </button>
          </div>
          {query.loading ? <p className="px-3 py-4 text-sm text-muted">Loading notices…</p> : null}
          {query.error ? <p className="px-3 py-4 text-sm text-badge-danger-fg">{query.error}</p> : null}
          {!query.loading && !query.error && notices.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted">No open notices.</p>
          ) : null}
          <ul>
            {notices.map((notice) => {
              const seen = read.includes(notice.id)
              return (
                <li key={notice.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={cn(
                      'flex w-full cursor-pointer flex-col gap-1 border-b border-stroke px-3 py-3 text-left last:border-b-0 hover:bg-wash',
                      seen && 'opacity-70',
                    )}
                    onClick={() => {
                      mark([notice.id])
                      setOpen(false)
                      navigate(notice.href)
                    }}
                  >
                    <span className="text-sm text-copy">{notice.title}</span>
                    <span className="line-clamp-2 text-xs text-muted">{notice.detail}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

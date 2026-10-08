import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { useAuth } from '@/hooks/useAuth'
import { auditActionLabel, filterAuditLogs, formatAuditTime, type AuditFilter } from '@/lib/auditLogs'
import { cn } from '@/lib/cn'
import type { AuditLog } from '@/types/auditLogs'

const filters: { id: AuditFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'organization', label: 'Organization' },
  { id: 'membership', label: 'Membership' },
]

export function AdminActivityPage() {
  const { organization } = useAuth()
  const audit = useAuditLogs(organization?.id ?? null)
  const [filter, setFilter] = useState<AuditFilter>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AuditLog | null>(null)
  const rows = useMemo(() => filterAuditLogs(audit.logs, filter, search), [audit.logs, filter, search])

  return (
    <>
      <PageHeader
        title="ACTIVITY"
        description="Administrative events recorded for this organization. Sample workspace activity is not shown here."
        actions={<Button variant="outline" onClick={audit.reload} disabled={audit.loading || !organization}>Refresh</Button>}
      />
      {!organization ? <p className="text-sm text-ash">No organization is attached to this session.</p> : null}
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Audit category" className="flex gap-2 overflow-x-auto">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={cn('h-9 shrink-0 border px-3 font-mono text-[11px] uppercase tracking-[0.12em]', filter === item.id ? 'border-ember text-ember' : 'border-stroke text-ash hover:text-paper')}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex min-w-0 flex-col gap-1.5 md:w-72">
          <span className="type-kicker text-ash">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Actor, action, or target"
            className="h-9 min-w-0 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none focus-visible:border-ember"
          />
        </label>
      </div>
      <section className="min-w-0 border border-stroke bg-surface-raised" aria-label="Audit log">
        {audit.loading ? <p className="px-4 py-8 text-sm text-ash">Loading audit events.</p> : null}
        {audit.error ? <p role="alert" className="px-4 py-8 text-sm text-badge-danger-fg">{audit.error}</p> : null}
        {!audit.loading && !audit.error && audit.logs.length === 0 ? (
          <div className="px-4 py-10">
            <p className="type-kicker text-ash">No audit events</p>
            <p className="mt-2 text-sm text-paper">Organization and membership changes will appear here after they succeed.</p>
          </div>
        ) : null}
        {!audit.loading && !audit.error && audit.logs.length > 0 && rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-ash">No audit events match this search.</p>
        ) : null}
        {rows.length > 0 ? (
          <>
            <ul className="flex flex-col md:hidden">
              {rows.map((log) => (
                <li key={log.id} className="border-b border-stroke last:border-b-0">
                  <button type="button" className="flex w-full flex-col gap-1 px-4 py-3 text-left" onClick={() => setSelected(log)}>
                    <span className="text-sm text-paper">{auditActionLabel(log.action)}</span>
                    <span className="text-sm text-ash">{log.actorName}</span>
                    <span className="font-mono text-[11px] text-ash">{formatAuditTime(log.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left">
                <thead className="border-b border-stroke">
                  <tr>
                    {['Time', 'Actor', 'Action', 'Target'].map((label) => (
                      <th key={label} className="px-4 py-2 type-kicker font-normal text-ash">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((log) => (
                    <tr key={log.id} className="border-b border-stroke last:border-b-0">
                      <td className="px-4 py-3 font-mono text-xs text-ash">{formatAuditTime(log.createdAt)}</td>
                      <td className="truncate px-4 py-3 text-sm text-paper">{log.actorName}</td>
                      <td className="px-4 py-3 text-sm text-paper">{auditActionLabel(log.action)}</td>
                      <td className="px-4 py-3">
                        <button type="button" className="truncate text-sm text-ember" onClick={() => setSelected(log)}>
                          {log.targetType}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
      <Modal open={selected !== null} title={selected ? auditActionLabel(selected.action) : 'Audit event'} description="Recorded administrative event." onClose={() => setSelected(null)}>
        {selected ? <AuditDetail log={selected} /> : null}
      </Modal>
    </>
  )
}

function AuditDetail({ log }: { log: AuditLog }) {
  const metadata = Object.entries(log.metadata)
  return (
    <dl className="grid gap-3 text-sm">
      <div>
        <dt className="type-kicker text-ash">Time</dt>
        <dd className="mt-1 text-paper">{formatAuditTime(log.createdAt)}</dd>
      </div>
      <div>
        <dt className="type-kicker text-ash">Actor</dt>
        <dd className="mt-1 break-words text-paper">{log.actorName}</dd>
        <dd className="break-all text-ash">{log.actorEmail}</dd>
      </div>
      <div>
        <dt className="type-kicker text-ash">Action</dt>
        <dd className="mt-1 font-mono text-xs text-paper">{log.action}</dd>
      </div>
      <div>
        <dt className="type-kicker text-ash">Target</dt>
        <dd className="mt-1 text-paper">{log.targetType}</dd>
        <dd className="break-all font-mono text-xs text-ash">{log.targetId ?? 'No target id'}</dd>
      </div>
      <div>
        <dt className="type-kicker text-ash">Details</dt>
        <dd className="mt-2">
          {metadata.length === 0 ? <p className="text-ash">No additional details.</p> : (
            <ul className="flex flex-col gap-2">
              {metadata.map(([key, value]) => (
                <li key={key} className="break-all border border-stroke px-3 py-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash">{key}</span>
                  <p className="mt-1 text-paper">{metadataValue(value)}</p>
                </li>
              ))}
            </ul>
          )}
        </dd>
      </div>
    </dl>
  )
}

function metadataValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null || value === undefined) return 'None'
  return JSON.stringify(value)
}

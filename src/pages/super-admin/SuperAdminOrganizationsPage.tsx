import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { usePlatformOrganizationDirectory } from '@/hooks/usePlatformOrganizationDirectory'
import { formatAuditTime } from '@/lib/auditLogs'
import { cn } from '@/lib/cn'
import { organizationSortLabel } from '@/lib/platformOrganizations'
import { organizationPageSize, organizationSorts, type OrganizationSort, type PlatformOrganizationRow } from '@/types/platformOrganizations'

export function SuperAdminOrganizationsPage() {
  const { isSuperAdmin } = useAuth()
  const directory = usePlatformOrganizationDirectory(isSuperAdmin)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const pageCount = Math.max(1, Math.ceil(directory.total / organizationPageSize))
  const rangeStart = directory.total === 0 ? 0 : directory.page * organizationPageSize + 1
  const rangeEnd = Math.min(directory.total, (directory.page + 1) * organizationPageSize)
  const showLoading = directory.loading && directory.rows.length === 0

  async function copyId(row: PlatformOrganizationRow) {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(row.id)
      setCopiedId(row.id)
    } catch (caught) {
      if (import.meta.env.DEV) console.info('copy organization id', caught)
      setCopiedId(null)
      setCopyError('Unable to copy this organization ID.')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Platform control"
        title="ORGANIZATIONS"
        description="Real organizations from public.organizations. Status, plans, usage, and revenue are not connected."
        actions={
          <Button variant="outline" onClick={directory.reload} loading={directory.refreshing} disabled={!isSuperAdmin || showLoading}>
            Refresh
          </Button>
        }
      />
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5 lg:max-w-sm">
          <span className="type-kicker text-ash">Search</span>
          <input
            value={directory.search}
            onChange={(event) => directory.setSearch(event.target.value)}
            placeholder="Name or slug"
            className="h-9 min-w-0 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none focus-visible:border-ember"
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 lg:w-48">
          <span className="type-kicker text-ash">Sort</span>
          <select
            value={directory.sort}
            onChange={(event) => directory.setSort(readSort(event.target.value))}
            className="h-9 min-w-0 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none focus-visible:border-ember"
          >
            {organizationSorts.map((sort) => (
              <option key={sort} value={sort}>{organizationSortLabel(sort)}</option>
            ))}
          </select>
        </label>
      </div>
      {directory.error ? <p role="alert" className="text-sm text-badge-danger-fg">{directory.error} Try again.</p> : null}
      {copyError ? <p role="alert" className="text-sm text-badge-danger-fg">{copyError}</p> : null}
      <section className="min-w-0 border border-stroke bg-surface-raised" aria-label="Organization directory">
        {showLoading ? <p className="px-4 py-8 text-sm text-ash sm:px-5">Loading organizations...</p> : null}
        {!showLoading && !directory.error && directory.rows.length === 0 ? (
          <div className="px-4 py-8 sm:px-5">
            <p className="type-kicker text-ash">{directory.search.trim() ? 'No matches' : 'No organizations'}</p>
            <p className="mt-2 text-sm text-paper">
              {directory.search.trim() ? 'No organizations match this name or slug.' : 'No organizations have been created yet.'}
            </p>
          </div>
        ) : null}
        {directory.rows.length > 0 ? (
          <>
            <ul className="flex flex-col md:hidden">
              {directory.rows.map((row) => (
                <li key={row.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                  <OrganizationIdentity row={row} copied={copiedId === row.id} onCopy={() => void copyId(row)} />
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="type-kicker text-ash">Created</dt>
                      <dd className="mt-1 font-mono text-xs text-paper">{formatAuditTime(row.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="type-kicker text-ash">Members</dt>
                      <dd className="mt-1 text-paper">{memberLabel(row, directory.membersStatus)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[40rem] text-left lg:min-w-0 lg:table-fixed">
                <thead className="border-b border-stroke">
                  <tr>
                    {['Organization', 'Slug', 'Created', 'Members', 'ID'].map((label) => (
                      <th key={label} className="px-4 py-2 type-kicker font-normal text-ash sm:px-5">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {directory.rows.map((row) => (
                    <tr key={row.id} className="border-b border-stroke last:border-b-0">
                      <td className="px-4 py-3 sm:px-5">
                        <Link to={`/super-admin/organizations/${row.id}`} className="text-sm text-paper no-underline hover:text-ember">
                          {row.name}
                        </Link>
                      </td>
                      <td className="truncate px-4 py-3 font-mono text-xs text-ash sm:px-5">{row.slug}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ash sm:px-5">{formatAuditTime(row.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-paper sm:px-5">{memberLabel(row, directory.membersStatus)}</td>
                      <td className="px-4 py-3 sm:px-5">
                        <p className="truncate font-mono text-[11px] text-ash">{row.id}</p>
                        <Button variant="ghost" size="sm" className="mt-1 h-8 px-2" onClick={() => void copyId(row)} aria-label={`Copy organization ID for ${row.name}`}>
                          {copiedId === row.id ? 'Copied' : 'Copy ID'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
      <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Organization pages">
        <p className="font-mono text-xs text-ash">
          {directory.total === 0 ? '0 organizations' : `${rangeStart}–${rangeEnd} of ${directory.total}`}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => directory.setPage(directory.page - 1)} disabled={directory.page === 0 || directory.loading}>
            Previous
          </Button>
          <p className={cn('inline-flex h-8 items-center font-mono text-xs text-ash')}>
            Page {Math.min(directory.page + 1, pageCount)} of {pageCount}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => directory.setPage(directory.page + 1)}
            disabled={directory.page >= pageCount - 1 || directory.loading}
          >
            Next
          </Button>
        </div>
      </nav>
    </>
  )
}

function OrganizationIdentity({ row, copied, onCopy }: { row: PlatformOrganizationRow; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Link to={`/super-admin/organizations/${row.id}`} className="text-sm text-paper no-underline hover:text-ember">
          {row.name}
        </Link>
        <p className="truncate font-mono text-xs text-ash">{row.slug}</p>
        <p className="truncate font-mono text-[11px] text-ash">{row.id}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-8 shrink-0 px-2" onClick={onCopy} aria-label={`Copy organization ID for ${row.name}`}>
        {copied ? 'Copied' : 'Copy ID'}
      </Button>
    </div>
  )
}

function memberLabel(row: PlatformOrganizationRow, status: 'live' | 'not_connected') {
  if (status !== 'live' || row.members === null) return 'Not connected'
  return String(row.members)
}

function readSort(value: string): OrganizationSort {
  for (const sort of organizationSorts) {
    if (sort === value) return sort
  }
  return 'created_desc'
}

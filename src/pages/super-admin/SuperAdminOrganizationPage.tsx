import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { usePlatformOrganizationDetail } from '@/hooks/usePlatformOrganizationDetail'
import { auditActionLabel, filterAuditLogs, formatAuditTime, type AuditFilter } from '@/lib/auditLogs'
import { cn } from '@/lib/cn'
import { displayRole, formatJoined } from '@/lib/memberDisplay'
import type { AuditLog } from '@/types/auditLogs'
import type { OrganizationMemberRole } from '@/types/organizationMember'
import type { PlatformOrganizationMember, PlatformOrganizationProfile } from '@/types/platformOrganizations'

const unavailable = [
  { label: 'Status', detail: 'Organizations do not have a persisted status.' },
  { label: 'Plan', detail: 'Billing is not connected.' },
  { label: 'Usage', detail: 'No platform usage records are stored.' },
  { label: 'Revenue', detail: 'No platform revenue records are stored.' },
]

const auditFilters: { id: AuditFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'organization', label: 'Organization' },
  { id: 'membership', label: 'Membership' },
]

const roleFilters: { id: 'all' | OrganizationMemberRole; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'owner', label: 'Owner' },
  { id: 'admin', label: 'Admin' },
  { id: 'member', label: 'Member' },
]

export function SuperAdminOrganizationPage() {
  const { organizationId } = useParams()
  const { isSuperAdmin } = useAuth()
  const detail = usePlatformOrganizationDetail(organizationId, isSuperAdmin)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [memberQuery, setMemberQuery] = useState('')
  const [role, setRole] = useState<(typeof roleFilters)[number]['id']>('all')
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('all')
  const [auditQuery, setAuditQuery] = useState('')
  const members = useMemo(() => filterMembers(detail.members, role, memberQuery), [detail.members, memberQuery, role])
  const audit = useMemo(() => filterAuditLogs(detail.audit, auditFilter, auditQuery), [auditFilter, auditQuery, detail.audit])
  const showLoading = detail.loading && !detail.organization && !detail.missing

  async function copyId(id: string) {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
    } catch (caught) {
      if (import.meta.env.DEV) console.info('copy organization id', caught)
      setCopied(false)
      setCopyError('Unable to copy this organization ID.')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Platform control"
        title={detail.organization?.name ?? 'ORGANIZATION'}
        description="Organization profile, members, and recorded organization or membership events."
        actions={
          <>
            <Link to="/super-admin/organizations" className="inline-flex h-10 items-center px-1 text-sm text-ash no-underline hover:text-paper">
              All organizations
            </Link>
            <Button variant="outline" onClick={detail.reload} loading={detail.refreshing} disabled={!isSuperAdmin || showLoading}>
              Refresh
            </Button>
          </>
        }
      />
      {showLoading ? <p className="text-sm text-ash">Loading organization...</p> : null}
      {detail.error ? <p role="alert" className="text-sm text-badge-danger-fg">{detail.error} Try again.</p> : null}
      {copyError ? <p role="alert" className="text-sm text-badge-danger-fg">{copyError}</p> : null}
      {!showLoading && detail.missing ? (
        <section className="border border-stroke bg-surface-raised px-4 py-8 sm:px-5">
          <p className="type-kicker text-ash">Organization not found</p>
          <p className="mt-2 text-sm text-paper">This organization does not exist or cannot be read.</p>
        </section>
      ) : null}
      {detail.organization ? (
        <>
          <OrganizationProfile organization={detail.organization} memberCount={detail.memberCount} copied={copied} onCopy={() => void copyId(detail.organization?.id ?? '')} />
          <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Fields that are not connected">
            {unavailable.map((item) => (
              <article key={item.label} className="border border-stroke bg-surface-raised px-4 py-4">
                <p className="type-kicker text-ash">{item.label}</p>
                <p className="mt-2 text-sm text-paper">Not connected</p>
                <p className="mt-1 text-sm text-ash">{item.detail}</p>
              </article>
            ))}
          </section>
          <MembersSection
            members={members}
            total={detail.members.length}
            error={detail.membersError}
            query={memberQuery}
            role={role}
            onQuery={setMemberQuery}
            onRole={setRole}
          />
          <AuditSection
            rows={audit}
            total={detail.audit.length}
            error={detail.auditError}
            filter={auditFilter}
            query={auditQuery}
            onFilter={setAuditFilter}
            onQuery={setAuditQuery}
          />
        </>
      ) : null}
    </>
  )
}

function OrganizationProfile({
  organization,
  memberCount,
  copied,
  onCopy,
}: {
  organization: PlatformOrganizationProfile
  memberCount: number | null
  copied: boolean
  onCopy: () => void
}) {
  const facts = [
    { label: 'Slug', value: organization.slug },
    { label: 'Created', value: formatAuditTime(organization.createdAt) },
    { label: 'Updated', value: formatAuditTime(organization.updatedAt) },
    { label: 'Members', value: memberCount === null ? 'Not connected' : String(memberCount) },
  ]
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="organization-profile-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="organization-profile-heading" className="font-display text-xl text-paper">Profile</h2>
        <p className="mt-1 text-sm text-ash">Read from public.organizations. Member count comes from public.organization_members.</p>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="type-kicker text-ash">Organization ID</p>
            <p className="mt-1 truncate font-mono text-xs text-paper">{organization.id}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onCopy} aria-label="Copy organization ID">
            {copied ? 'Copied' : 'Copy ID'}
          </Button>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="type-kicker text-ash">{fact.label}</dt>
              <dd className="mt-1 truncate font-mono text-xs text-paper">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function MembersSection({
  members,
  total,
  error,
  query,
  role,
  onQuery,
  onRole,
}: {
  members: PlatformOrganizationMember[]
  total: number
  error: string | null
  query: string
  role: (typeof roleFilters)[number]['id']
  onQuery: (value: string) => void
  onRole: (value: (typeof roleFilters)[number]['id']) => void
}) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="organization-members-heading">
      <div className="flex flex-col gap-3 border-b border-stroke px-4 py-4 sm:px-5">
        <div>
          <h2 id="organization-members-heading" className="font-display text-xl text-paper">Members</h2>
          <p className="mt-1 text-sm text-ash">Names and emails come from public.profiles. Roles and dates come from public.organization_members.</p>
        </div>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Member role" className="flex gap-2 overflow-x-auto">
            {roleFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={role === item.id}
                className={tabClass(role === item.id)}
                onClick={() => onRole(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 flex-col gap-1.5 lg:w-64">
            <span className="type-kicker text-ash">Search members</span>
            <input
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Name or email"
              className="h-9 min-w-0 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none focus-visible:border-ember"
            />
          </label>
        </div>
      </div>
      {error ? <p role="alert" className="px-4 py-8 text-sm text-badge-danger-fg sm:px-5">{error} Try again.</p> : null}
      {!error && total === 0 ? (
        <div className="px-4 py-8 sm:px-5">
          <p className="type-kicker text-ash">No members</p>
          <p className="mt-2 text-sm text-paper">This organization has no membership records.</p>
        </div>
      ) : null}
      {!error && total > 0 && members.length === 0 ? <p className="px-4 py-8 text-sm text-ash sm:px-5">No members match this search.</p> : null}
      {members.length > 0 ? (
        <>
          <ul className="flex flex-col md:hidden">
            {members.map((member) => (
              <li key={member.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                <p className="text-sm text-paper">{member.name}</p>
                <p className="truncate text-sm text-ash">{member.email}</p>
                <p className="mt-1 text-sm text-paper">{displayRole(member.role)}</p>
                <p className="font-mono text-[11px] text-ash">{formatJoined(member.joinedAt)}</p>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[36rem] text-left lg:min-w-0 lg:table-fixed">
              <thead className="border-b border-stroke">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined'].map((label) => (
                    <th key={label} className="px-4 py-2 type-kicker font-normal text-ash sm:px-5">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-stroke last:border-b-0">
                    <td className="truncate px-4 py-3 text-sm text-paper sm:px-5">{member.name}</td>
                    <td className="truncate px-4 py-3 text-sm text-ash sm:px-5">{member.email}</td>
                    <td className="px-4 py-3 text-sm text-paper sm:px-5">{displayRole(member.role)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ash sm:px-5">{formatJoined(member.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  )
}

function AuditSection({
  rows,
  total,
  error,
  filter,
  query,
  onFilter,
  onQuery,
}: {
  rows: AuditLog[]
  total: number
  error: string | null
  filter: AuditFilter
  query: string
  onFilter: (value: AuditFilter) => void
  onQuery: (value: string) => void
}) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="organization-audit-heading">
      <div className="flex flex-col gap-3 border-b border-stroke px-4 py-4 sm:px-5">
        <div>
          <h2 id="organization-audit-heading" className="font-display text-xl text-paper">Recorded events</h2>
          <p className="mt-1 text-sm text-ash">Organization and membership events recorded for this organization. This is not a complete platform activity feed.</p>
        </div>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Audit category" className="flex gap-2 overflow-x-auto">
            {auditFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={tabClass(filter === item.id)}
                onClick={() => onFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 flex-col gap-1.5 lg:w-72">
            <span className="type-kicker text-ash">Search events</span>
            <input
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Actor, action, or target"
              className="h-9 min-w-0 rounded-sm border border-stroke bg-surface px-3 text-sm text-copy outline-none focus-visible:border-ember"
            />
          </label>
        </div>
      </div>
      {error ? <p role="alert" className="px-4 py-8 text-sm text-badge-danger-fg sm:px-5">{error}</p> : null}
      {!error && total === 0 ? (
        <div className="px-4 py-8 sm:px-5">
          <p className="type-kicker text-ash">No audit events</p>
          <p className="mt-2 text-sm text-paper">No organization or membership events have been recorded for this organization.</p>
        </div>
      ) : null}
      {!error && total > 0 && rows.length === 0 ? <p className="px-4 py-8 text-sm text-ash sm:px-5">No recorded events match this search.</p> : null}
      {rows.length > 0 ? (
        <>
          <ul className="flex flex-col md:hidden">
            {rows.map((log) => (
              <li key={log.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
                <p className="text-sm text-paper">{auditActionLabel(log.action)}</p>
                <p className="text-sm text-ash">{log.actorName}</p>
                <p className="truncate font-mono text-[11px] text-ash">{log.targetId ? `${log.targetType} ${log.targetId}` : log.targetType}</p>
                <p className="font-mono text-[11px] text-ash">{formatAuditTime(log.createdAt)}</p>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[40rem] text-left lg:min-w-0">
              <thead className="border-b border-stroke">
                <tr>
                  {['Time', 'Actor', 'Action', 'Target'].map((label) => (
                    <th key={label} className="px-4 py-2 type-kicker font-normal text-ash sm:px-5">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((log) => (
                  <tr key={log.id} className="border-b border-stroke last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-ash sm:px-5">{formatAuditTime(log.createdAt)}</td>
                    <td className="truncate px-4 py-3 text-sm text-paper sm:px-5">{log.actorName}</td>
                    <td className="px-4 py-3 text-sm text-paper sm:px-5">{auditActionLabel(log.action)}</td>
                    <td className="truncate px-4 py-3 font-mono text-xs text-ash sm:px-5">{log.targetId ? `${log.targetType} ${log.targetId}` : log.targetType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  )
}

function filterMembers(members: PlatformOrganizationMember[], role: (typeof roleFilters)[number]['id'], search: string) {
  const query = search.trim().toLowerCase()
  return members.filter((member) => {
    if (role !== 'all' && member.role !== role) return false
    if (!query) return true
    return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
  })
}

function tabClass(selected: boolean) {
  return cn('h-9 shrink-0 border px-3 font-mono text-[11px] uppercase tracking-[0.12em]', selected ? 'border-ember text-ember' : 'border-stroke text-ash hover:text-paper')
}

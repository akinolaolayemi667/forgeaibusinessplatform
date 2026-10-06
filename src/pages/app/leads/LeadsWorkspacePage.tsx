import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LeadConversionModal } from '@/components/leads/LeadConversionModal'
import { LeadFilters, leadFiltersActive, type LeadQuery } from '@/components/leads/LeadFilters'
import { LeadForm, leadToDraft } from '@/components/leads/LeadForm'
import { LeadQualificationModal } from '@/components/leads/LeadQualificationModal'
import { LeadScore } from '@/components/leads/LeadScore'
import { LeadSearch } from '@/components/leads/LeadSearch'
import { LeadSourceCard } from '@/components/leads/LeadSourceCard'
import { LeadStatCard } from '@/components/leads/LeadStatCard'
import { LeadStatusBadge } from '@/components/leads/LeadStatus'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadsHeader } from '@/components/leads/LeadsHeader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextField } from '@/components/ui/TextField'
import { formatActivityWhen, withinActivityWindow } from '@/data/crm/time'
import { leadBook, leadFlow, leadName, leadSourceMix, scoreBand, type LeadStatus, type SalesLead } from '@/data/leads'
import { parseLeadCsv } from '@/data/leads/csv'
import { useLeads } from '@/hooks/useLeads'

const LeadFlowChart = lazy(() => import('@/components/leads/LeadFlowChart').then((module) => ({ default: module.LeadFlowChart })))

const pageSize = 8

const initialQuery: LeadQuery = {
  status: 'all',
  score: 'all',
  source: 'all',
  owner: 'all',
  company: 'all',
  created: 'any',
  activity: 'any',
  sort: 'newest',
}

function createdMatch(iso: string, window: string) {
  if (window === 'any') return true
  if (window === 'month') {
    const then = new Date(iso).getTime()
    return Date.now() - then <= 30 * 24 * 60 * 60 * 1000 && then <= Date.now()
  }
  if (window === 'today' || window === 'week') return withinActivityWindow(iso, window)
  return true
}

export function LeadsWorkspacePage() {
  const navigate = useNavigate()
  const { leads, book, nextFollowUp, addLead, updateLead, setStatus, assignOwner, addTag, qualify, convert, importLeads } = useLeads()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<LeadQuery>(initialQuery)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<SalesLead | null>(null)
  const [converting, setConverting] = useState<SalesLead | null>(null)
  const [qualifying, setQualifying] = useState<SalesLead | null>(null)
  const [tagging, setTagging] = useState(false)
  const [tag, setTag] = useState('')
  const importRef = useRef<HTMLInputElement>(null)

  const companies = useMemo(() => [...new Set(leads.map((lead) => lead.company))].sort(), [leads])
  const active = leadFiltersActive(filters, search)

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const rows = leads.filter((lead) => {
      if (filters.status !== 'all' && lead.status !== filters.status) return false
      if (filters.score !== 'all' && scoreBand(lead.score).toLowerCase() !== filters.score) return false
      if (filters.source !== 'all' && lead.source !== filters.source) return false
      if (filters.owner !== 'all' && lead.owner !== filters.owner) return false
      if (filters.company !== 'all' && lead.company !== filters.company) return false
      if (!createdMatch(lead.createdAt, filters.created)) return false
      if (!withinActivityWindow(lead.lastActivityAt, filters.activity as 'any' | 'today' | 'yesterday' | 'week')) return false
      if (!needle) return true
      const haystack = `${leadName(lead)} ${lead.email} ${lead.company} ${lead.phone} ${lead.source}`.toLowerCase()
      return haystack.includes(needle)
    })
    rows.sort((a, b) => {
      if (filters.sort === 'oldest') return a.createdAt.localeCompare(b.createdAt)
      if (filters.sort === 'score-desc') return b.score - a.score
      if (filters.sort === 'score-asc') return a.score - b.score
      if (filters.sort === 'active') return b.lastActivityAt.localeCompare(a.lastActivityAt)
      if (filters.sort === 'az') return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
      if (filters.sort === 'za') return `${b.lastName} ${b.firstName}`.localeCompare(`${a.lastName} ${a.firstName}`)
      return b.createdAt.localeCompare(a.createdAt)
    })
    return rows
  }, [filters, leads, search])

  useEffect(() => {
    setPage(1)
    setSelected([])
  }, [search, filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const priority = [...leads]
    .filter((lead) => lead.status !== 'Lost' && lead.status !== 'Converted')
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
  const flowBase = leadFlow[0]?.count || 1

  function changeStatus(ids: string[], status: LeadStatus) {
    if (status === 'Converted') {
      const lead = leads.find((item) => item.id === ids[0] && item.status !== 'Converted')
      if (lead) setConverting(lead)
      return
    }
    setStatus(ids, status)
    setSelected([])
  }

  return (
    <div className="flex flex-col gap-8">
      <LeadsHeader
        eyebrow="SALES / LEADS"
        title="Turn prospects into opportunities."
        description="Capture, qualify, prioritize, and follow up with every lead from one operational workspace."
        actions={
          <>
            <Button variant="outline" onClick={() => importRef.current?.click()}>
              Import Leads
            </Button>
            <input
              ref={importRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              aria-label="Import leads CSV"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (!file) return
                void file.text().then((text) => importLeads(parseLeadCsv(text)))
              }}
            />
            <Button onClick={() => setAdding(true)}>+ Add Lead</Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <LeadStatCard label="Total leads" value={book.total.toLocaleString('en-US')} hint="Book total plus leads added in this session." />
        <LeadStatCard label="New this week" value={book.newThisWeek.toLocaleString('en-US')} hint="Leads captured in the current week." />
        <LeadStatCard label="Qualified" value={book.qualified.toLocaleString('en-US')} hint="Leads marked qualified." />
        <LeadStatCard label="Hot leads" value={book.hot.toLocaleString('en-US')} hint="Scores from 75 to 100." />
        <LeadStatCard label="Conversion rate" value={`${book.conversionRate.toFixed(1)}%`} hint="Reported conversion for the current book." />
        <LeadStatCard label="Follow-ups due" value={book.followUps.toLocaleString('en-US')} hint="Open follow-ups across the book." />
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="border border-stroke bg-surface-raised">
          <div className="border-b border-stroke px-4 py-3">
            <h2 className="font-display text-lg text-copy">Lead flow</h2>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <Suspense fallback={<div className="h-52 border border-stroke" />}>
              <LeadFlowChart stages={leadFlow} />
            </Suspense>
            <ul className="flex flex-col justify-center gap-2">
              {leadFlow.map((stage) => (
                <li key={stage.stage} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted">{stage.stage}</span>
                  <span className="type-data text-copy">
                    {stage.count.toLocaleString('en-US')}
                    <span className="ml-2 text-muted">{Math.round((stage.count / flowBase) * 1000) / 10}%</span>
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-3 border-t border-stroke pt-2 text-sm">
                <span className="text-muted">Lost</span>
                <span className="type-data text-copy">{leadBook.lost.toLocaleString('en-US')}</span>
              </li>
            </ul>
          </div>
        </section>
        <LeadSourceCard sources={leadSourceMix} />
      </div>
      <section className="border border-stroke bg-surface-raised">
        <div className="border-b border-stroke px-4 py-3">
          <h2 className="font-display text-lg text-copy">Priority leads</h2>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stroke">
                {['Name', 'Company', 'Score', 'Status', 'Source', 'Owner', 'Last activity'].map((label) => (
                  <th key={label} className="px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {priority.map((lead) => (
                <tr key={lead.id} className="border-b border-stroke last:border-b-0">
                  <td className="px-3 py-3">
                    <Link to={`/app/leads/${lead.id}`} className="font-medium text-copy no-underline hover:text-ember">
                      {leadName(lead)}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted">{lead.company}</td>
                  <td className="px-3 py-3">
                    <LeadScore score={lead.score} />
                  </td>
                  <td className="px-3 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="hidden px-3 py-3 text-sm text-muted md:table-cell">{lead.source}</td>
                  <td className="hidden px-3 py-3 text-sm text-muted sm:table-cell">{lead.owner}</td>
                  <td className="px-3 py-3 text-sm text-muted">{formatActivityWhen(lead.lastActivityAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="flex flex-col md:hidden">
          {priority.map((lead) => (
            <li key={lead.id} className="border-b border-stroke px-4 py-3 last:border-b-0">
              <Link to={`/app/leads/${lead.id}`} className="font-medium text-copy no-underline hover:text-ember">
                {leadName(lead)}
              </Link>
              <p className="text-sm text-muted">{lead.company}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <LeadScore score={lead.score} />
                <LeadStatusBadge status={lead.status} />
                <span className="text-xs text-muted">{formatActivityWhen(lead.lastActivityAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl text-copy">All leads</h2>
        <LeadSearch value={search} onChange={setSearch} />
        <LeadFilters
          query={filters}
          companies={companies}
          active={active}
          onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
          onClear={() => {
            setSearch('')
            setFilters(initialQuery)
          }}
        />
        <LeadTable
          rows={rows}
          page={safePage}
          pageCount={pageCount}
          total={filtered.length}
          selected={selected}
          followUp={nextFollowUp}
          filteredEmpty={active || leads.length > 0}
          onToggle={(id) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
          onTogglePage={(checked) => {
            const ids = rows.map((row) => row.id)
            setSelected((current) => (checked ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id))))
          }}
          onClearSelection={() => setSelected([])}
          onPage={setPage}
          onOpen={(id) => navigate(`/app/leads/${id}`)}
          onEdit={setEditing}
          onQualify={(id) => {
            const lead = leads.find((item) => item.id === id)
            if (lead) setQualifying(lead)
          }}
          onConvert={(id) => {
            const lead = leads.find((item) => item.id === id)
            if (lead && lead.status !== 'Converted') setConverting(lead)
          }}
          onStatus={changeStatus}
          onAssign={(ids, owner) => {
            assignOwner(ids, owner)
            setSelected([])
          }}
          onTag={() => setTagging(true)}
          onQualifySelected={() => {
            const ids = selected.filter((id) => leads.some((lead) => lead.id === id && lead.status !== 'Qualified'))
            if (ids.length === 1) {
              const lead = leads.find((item) => item.id === ids[0])
              if (lead) setQualifying(lead)
              return
            }
            if (ids.length > 1) {
              setStatus(ids, 'Qualified')
              setSelected([])
            }
          }}
          onClearFilters={() => {
            setSearch('')
            setFilters(initialQuery)
          }}
        />
      </section>
      <Modal open={adding} title="Add lead" description="Capture a prospect in this workspace." onClose={() => setAdding(false)}>
        <LeadForm
          submitLabel="Create lead"
          onCancel={() => setAdding(false)}
          onSubmit={(draft) => {
            addLead(draft)
            setAdding(false)
          }}
        />
      </Modal>
      <Modal open={Boolean(editing)} title="Edit lead" description="Update this lead." onClose={() => setEditing(null)}>
        {editing ? (
          <LeadForm
            key={editing.id}
            initial={leadToDraft(editing)}
            submitLabel="Save"
            onCancel={() => setEditing(null)}
            onSubmit={(draft) => {
              updateLead(editing.id, draft)
              setEditing(null)
            }}
          />
        ) : null}
      </Modal>
      <LeadConversionModal
        lead={converting}
        open={Boolean(converting)}
        onClose={() => setConverting(null)}
        onConfirm={() => {
          if (converting) convert(converting.id)
          setConverting(null)
          setSelected([])
        }}
      />
      <LeadQualificationModal
        lead={qualifying}
        count={qualifying ? 1 : 0}
        open={Boolean(qualifying)}
        onClose={() => setQualifying(null)}
        onConfirm={() => {
          if (qualifying) qualify(qualifying.id)
          setQualifying(null)
          setSelected([])
        }}
      />
      <Modal open={tagging} title="Add tag" description="Apply one tag to the selected leads." onClose={() => setTagging(false)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!tag.trim()) return
            addTag(selected, tag)
            setTag('')
            setTagging(false)
            setSelected([])
          }}
        >
          <TextField id="lead-bulk-tag" label="Tag" value={tag} onChange={setTag} />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setTagging(false)}>
              Cancel
            </Button>
            <Button type="submit">Add tag</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

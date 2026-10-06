import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { OpportunityForm, opportunityToDraft } from '@/components/pipeline/OpportunityForm'
import { OpportunityList } from '@/components/pipeline/OpportunityList'
import { OpportunityLostModal } from '@/components/pipeline/OpportunityLostModal'
import { OpportunityWonModal } from '@/components/pipeline/OpportunityWonModal'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import { PipelineBreakdown } from '@/components/pipeline/PipelineBreakdown'
import { PipelineEmptyState } from '@/components/pipeline/PipelineEmptyState'
import { PipelineFilters } from '@/components/pipeline/PipelineFilters'
import { PipelineForecast } from '@/components/pipeline/PipelineForecast'
import { PipelineHeader } from '@/components/pipeline/PipelineHeader'
import { PipelineSearch } from '@/components/pipeline/PipelineSearch'
import { PipelineSettings } from '@/components/pipeline/PipelineSettings'
import { PipelineStats } from '@/components/pipeline/PipelineStats'
import { PipelineViewToggle } from '@/components/pipeline/PipelineViewToggle'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  filterOpportunities,
  initialPipelineQuery,
  pipelineFiltersActive,
  sortOpportunities,
  stageBreakdown,
  type Opportunity,
  type OpportunityDraft,
  type PipelineQuery,
} from '@/data/pipeline'
import { usePipeline } from '@/hooks/usePipeline'

export function PipelineWorkspacePage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { opportunities, metrics, addOpportunity, updateOpportunity, moveStage, markWon, markLost, restore, assignOwner, setPriority } = usePipeline()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState<PipelineQuery>(initialPipelineQuery)
  const [view, setView] = useState<'board' | 'list'>('board')
  const [showClosed, setShowClosed] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Opportunity | null>(null)
  const [won, setWon] = useState<Opportunity | null>(null)
  const [lost, setLost] = useState<Opportunity | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [updatedId, setUpdatedId] = useState<string | null>(null)

  const companies = useMemo(
    () => [...new Set(opportunities.map((item) => item.company))].sort((a, b) => a.localeCompare(b)),
    [opportunities],
  )
  const filtered = useMemo(
    () => sortOpportunities(filterOpportunities(opportunities, search, query), query.sort),
    [opportunities, query, search],
  )
  const breakdown = useMemo(() => stageBreakdown(opportunities), [opportunities])
  const active = pipelineFiltersActive(query, search)

  useEffect(() => {
    setPage(1)
    setSelected([])
  }, [query, search])

  useEffect(() => {
    if (!updatedId) return
    const timer = window.setTimeout(() => setUpdatedId(null), 1200)
    return () => window.clearTimeout(timer)
  }, [updatedId])

  function clearFilters() {
    setSearch('')
    setQuery(initialPipelineQuery)
  }

  function saveCreate(draft: OpportunityDraft) {
    addOpportunity(draft)
    setCreating(false)
  }

  function saveEdit(draft: OpportunityDraft) {
    if (!editing) return
    updateOpportunity(editing.id, draft)
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PipelineHeader
        eyebrow="SALES / PIPELINE"
        title="Move every opportunity forward."
        description="Track deals, forecast revenue, and keep your sales team focused on the next action."
        actions={
          <>
            <Button onClick={() => setCreating(true)}>+ New Opportunity</Button>
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              Pipeline Settings
            </Button>
          </>
        }
      />
      <PipelineStats metrics={metrics} />
      <div className="grid gap-4 lg:grid-cols-2">
        <PipelineForecast metrics={metrics} />
        <PipelineBreakdown rows={breakdown} />
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <PipelineSearch value={search} onChange={setSearch} />
        <PipelineViewToggle view={view} onChange={setView} />
      </div>
      <PipelineFilters query={query} companies={companies} active={active} onChange={(patch) => setQuery((current) => ({ ...current, ...patch }))} onClear={clearFilters} />
      <motion.div key={view} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.18 }}>
        {filtered.length === 0 ? (
          <PipelineEmptyState
            title={active ? 'No opportunities found' : 'No opportunities'}
            description={active ? 'Try adjusting your search or filters.' : 'Create the first opportunity to start the pipeline.'}
            action={
              active ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setCreating(true)}>+ New Opportunity</Button>
              )
            }
          />
        ) : view === 'board' ? (
          <PipelineBoard
            opportunities={filtered}
            showClosed={showClosed}
            updatedId={updatedId}
            onOpen={(id) => navigate(`/app/pipeline/${id}`)}
            onMove={(id, stageId) => {
              moveStage([id], stageId)
              setUpdatedId(id)
            }}
            onRequestWon={setWon}
            onRequestLost={setLost}
          />
        ) : (
          <OpportunityList
            rows={filtered}
            page={page}
            total={filtered.length}
            selected={selected}
            filteredEmpty={active}
            onToggle={(id) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
            onTogglePage={(checked, ids) =>
              setSelected((current) => (checked ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id))))
            }
            onClearSelection={() => setSelected([])}
            onPage={setPage}
            onOpen={(id) => navigate(`/app/pipeline/${id}`)}
            onEdit={setEditing}
            onStage={(ids, stageId) => {
              moveStage(ids, stageId)
              if (ids.length === 1) setUpdatedId(ids[0])
            }}
            onWon={setWon}
            onLost={setLost}
            onRestore={restore}
            onAssign={assignOwner}
            onPriority={(priority) => setPriority(selected, priority)}
            onClearFilters={clearFilters}
          />
        )}
      </motion.div>
      <Modal open={creating} title="New opportunity" description="Add a deal to the open pipeline." onClose={() => setCreating(false)}>
        <OpportunityForm mode="create" onSubmit={saveCreate} onCancel={() => setCreating(false)} />
      </Modal>
      <Modal open={Boolean(editing)} title="Edit opportunity" onClose={() => setEditing(null)}>
        {editing ? <OpportunityForm mode="edit" initial={opportunityToDraft(editing)} onSubmit={saveEdit} onCancel={() => setEditing(null)} /> : null}
      </Modal>
      <PipelineSettings open={settingsOpen} showClosed={showClosed} onShowClosed={setShowClosed} onClose={() => setSettingsOpen(false)} />
      <OpportunityWonModal
        opportunity={won}
        open={Boolean(won)}
        onClose={() => setWon(null)}
        onConfirm={() => {
          if (!won) return
          markWon(won.id)
          setUpdatedId(won.id)
          setWon(null)
        }}
      />
      <OpportunityLostModal
        opportunity={lost}
        open={Boolean(lost)}
        onClose={() => setLost(null)}
        onConfirm={(reason) => {
          if (!lost) return
          markLost(lost.id, reason)
          setUpdatedId(lost.id)
          setLost(null)
        }}
      />
    </div>
  )
}

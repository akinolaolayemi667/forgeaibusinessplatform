import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { Briefing } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

export function BriefingPanel({ briefings }: { briefings: Briefing[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const briefing = briefings.find((item) => item.id === activeId) ?? null
  const sample = briefings[0]

  if (!sample) {
    return <EmptyState title="No briefing queued" description="This workspace has no sample account to read." />
  }

  if (!briefing) {
    return (
      <EmptyState
        icon={<Sparkles size={20} />}
        title="No briefing open"
        description="Load the sample account before writing back."
        action={
          <Button onClick={() => setActiveId(sample.id)}>Show sample briefing</Button>
        }
      />
    )
  }

  return (
    <Card as="article">
      <CardTitle>{briefing.account}</CardTitle>
      <CardDescription>Sample briefing for this visit.</CardDescription>
      <p className="text-sm text-copy">{briefing.summary}</p>
      <p className="text-sm text-copy">
        <span className="font-medium">Next step. </span>
        {briefing.nextStep}
      </p>
      <Button variant="outline" onClick={() => setActiveId(null)}>
        Clear briefing
      </Button>
    </Card>
  )
}

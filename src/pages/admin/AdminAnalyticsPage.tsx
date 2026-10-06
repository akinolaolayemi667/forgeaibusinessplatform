import { useState } from 'react'
import { AdminChart } from '@/components/admin/AdminChart'
import { PageHeader } from '@/components/ui/PageHeader'
import { adminRanges, analyticsByRange, type AdminRange } from '@/data/adminData'
import { cn } from '@/lib/cn'

const panels = [
  { key: 'growth', title: 'Organization Growth', group: 'Organization Overview' },
  { key: 'userActivity', title: 'User Activity', group: 'Team Activity' },
  { key: 'leadGrowth', title: 'Lead Growth', group: 'Operational Performance' },
  { key: 'automationRuns', title: 'Automation Runs', group: 'AI & Automation' },
  { key: 'aiUsage', title: 'AI Usage', group: 'AI & Automation', unit: '%' },
  { key: 'conversion', title: 'Conversion Rate', group: 'Operational Performance', unit: '%' },
] as const

export function AdminAnalyticsPage() {
  const [range, setRange] = useState<AdminRange>('30D')
  const data = analyticsByRange[range]

  return (
    <>
      <PageHeader
        title="ANALYTICS"
        description="Organization growth, operations, and allowance use for the selected range."
        actions={
          <div role="tablist" aria-label="Date range" className="flex border border-stroke">
            {adminRanges.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={range === item}
                className={cn('h-10 px-3 font-mono text-xs', range === item ? 'bg-ember text-on-accent' : 'text-ash hover:bg-wash hover:text-paper')}
                onClick={() => setRange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {panels.map((panel) => (
          <div key={panel.key} className="flex flex-col gap-2">
            <p className="type-kicker text-ash">{panel.group}</p>
            <AdminChart title={panel.title} points={data[panel.key]} unit={'unit' in panel ? panel.unit : ''} />
          </div>
        ))}
      </div>
    </>
  )
}

import { useMemo, useState } from 'react'
import { AdminActivityRow } from '@/components/admin/AdminActivityFeed'
import { PageHeader } from '@/components/ui/PageHeader'
import { activityCategories, adminActivity, type AdminActivityCategory } from '@/data/adminData'
import { cn } from '@/lib/cn'

export function AdminActivityPage() {
  const [category, setCategory] = useState<(typeof activityCategories)[number]>('All')
  const rows = useMemo(
    () => adminActivity.filter((item) => category === 'All' || item.category === (category as AdminActivityCategory)),
    [category],
  )

  return (
    <>
      <PageHeader title="ACTIVITY" description="Organization actions recorded for this preview. The audit log will read from Supabase later." />
      <div role="tablist" aria-label="Activity category" className="flex gap-2 overflow-x-auto">
        {activityCategories.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={category === item}
            className={cn('h-9 shrink-0 border px-3 font-mono text-[11px] uppercase tracking-[0.12em]', category === item ? 'border-ember text-ember' : 'border-stroke text-ash hover:text-paper')}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="border border-stroke bg-surface-raised" aria-label="Activity log">
        <div className="hidden border-b border-stroke px-4 py-2 sm:grid sm:grid-cols-[4.5rem_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto]">
          {['Time', 'Actor', 'Action', 'Resource', 'Status'].map((label) => (
            <p key={label} className="type-kicker text-ash">
              {label}
            </p>
          ))}
        </div>
        {rows.length === 0 ? <p className="px-4 py-8 text-sm text-ash">No activity in this category.</p> : rows.map((item) => <AdminActivityRow key={item.id} item={item} />)}
      </section>
    </>
  )
}

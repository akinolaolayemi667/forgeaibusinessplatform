import { Search } from 'lucide-react'
import { controlClass } from '@/components/crm/book/fields'

export function PipelineSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search aria-hidden size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <label htmlFor="pipeline-search" className="sr-only">
        Search opportunities
      </label>
      <input
        id="pipeline-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search opportunities, companies, contacts..."
        className={controlClass('w-full pl-9')}
      />
    </div>
  )
}

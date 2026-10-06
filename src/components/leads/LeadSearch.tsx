import { Search } from 'lucide-react'
import { controlClass } from '@/components/crm/book/fields'

export function LeadSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative min-w-0">
      <Search aria-hidden size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <label htmlFor="lead-search" className="sr-only">
        Search leads
      </label>
      <input
        id="lead-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search leads by name, company, email..."
        className={controlClass('w-full pl-9')}
      />
    </div>
  )
}

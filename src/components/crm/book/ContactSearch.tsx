import { Search } from 'lucide-react'
import { controlClass } from '@/components/crm/book/fields'

export function ContactSearch({
  value,
  onChange,
  placeholder = 'Search contacts by name, email, company...',
  label = 'Search contacts',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search aria-hidden size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
      <label htmlFor="contact-search" className="sr-only">
        {label}
      </label>
      <input
        id="contact-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={controlClass('w-full pl-9')}
      />
    </div>
  )
}

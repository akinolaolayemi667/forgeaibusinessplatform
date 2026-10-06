import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/cn'

export function OpportunityValue({ value, size = 'md' }: { value: number; size?: 'md' | 'lg' }) {
  return <p className={cn('type-data text-copy', size === 'lg' ? 'text-3xl' : 'text-lg')}>{formatCurrency(value)}</p>
}

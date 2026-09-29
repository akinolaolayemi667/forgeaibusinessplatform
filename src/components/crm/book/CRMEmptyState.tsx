import { EmptyState } from '@/components/ui/EmptyState'
import type { ReactNode } from 'react'

export function CRMEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <EmptyState title={title} description={description} action={action} />
}

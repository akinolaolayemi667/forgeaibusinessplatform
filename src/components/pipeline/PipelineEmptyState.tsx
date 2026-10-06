import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'

export function PipelineEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <EmptyState title={title} description={description} action={action} />
}

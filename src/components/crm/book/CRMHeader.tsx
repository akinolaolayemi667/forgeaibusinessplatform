import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export function CRMHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
}

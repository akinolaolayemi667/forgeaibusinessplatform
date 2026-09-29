import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import type { CompanyStatus, CrmStatus } from '@/data/crm'

const contactTone: Record<CrmStatus, BadgeVariant> = {
  New: 'info',
  Contacted: 'neutral',
  Qualified: 'accent',
  Active: 'success',
  Customer: 'warning',
  Inactive: 'neutral',
}

const companyTone: Record<CompanyStatus, BadgeVariant> = {
  Active: 'success',
  Prospect: 'accent',
  Customer: 'warning',
  Inactive: 'neutral',
}

export function ContactStatus({ status }: { status: CrmStatus }) {
  return <Badge variant={contactTone[status]}>{status}</Badge>
}

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  return <Badge variant={companyTone[status]}>{status}</Badge>
}

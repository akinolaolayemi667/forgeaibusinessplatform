import { useMemo } from 'react'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { billingView } from '@/lib/billing'

export function useBilling(organizationId: string | null) {
  const members = useOrganizationMembers(organizationId)
  const view = useMemo(
    () => billingView(members.loading || members.error ? null : members.members.length),
    [members.error, members.loading, members.members.length],
  )

  return {
    view,
    loading: Boolean(organizationId) && members.loading,
    error: members.error,
    reload: members.reload,
  }
}

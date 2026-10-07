import { useCallback, useEffect, useState } from 'react'
import { getOrganizationMembers, memberMessage } from '@/lib/organizationMembers'
import type { OrganizationMember } from '@/types/organizationMember'

export function useOrganizationMembers(organizationId: string | null) {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(Boolean(organizationId))
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setRequest((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!organizationId) return
    let active = true
    void getOrganizationMembers(organizationId).then(
      (next) => {
        if (!active) return
        setMembers(next)
        setError(null)
        setLoading(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('organization members', caught)
        setError(memberMessage(caught, 'Unable to load team members.'))
        setMembers([])
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [organizationId, request])

  return { members, loading, error, reload }
}

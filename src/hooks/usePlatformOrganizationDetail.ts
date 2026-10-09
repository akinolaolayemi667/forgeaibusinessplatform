import { useCallback, useEffect, useRef, useState } from 'react'
import { getPlatformOrganizationDetail, organizationMessage } from '@/lib/platformOrganizations'
import type { AuditLog } from '@/types/auditLogs'
import type { PlatformOrganizationMember, PlatformOrganizationProfile } from '@/types/platformOrganizations'

export function usePlatformOrganizationDetail(organizationId: string | undefined, enabled: boolean) {
  const [organization, setOrganization] = useState<PlatformOrganizationProfile | null>(null)
  const [missing, setMissing] = useState(false)
  const [members, setMembers] = useState<PlatformOrganizationMember[]>([])
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [membersError, setMembersError] = useState<string | null>(null)
  const [audit, setAudit] = useState<AuditLog[]>([])
  const [auditError, setAuditError] = useState<string | null>(null)
  const [loading, setLoading] = useState(enabled && Boolean(organizationId))
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState(0)
  const loaded = useRef(false)

  const reload = useCallback(() => {
    if (!enabled || !organizationId) return
    setRequest((current) => current + 1)
  }, [enabled, organizationId])

  useEffect(() => {
    loaded.current = false
    setOrganization(null)
    setMissing(false)
    setMembers([])
    setMemberCount(null)
    setMembersError(null)
    setAudit([])
    setAuditError(null)
    setError(null)
    setLoading(Boolean(enabled && organizationId))
  }, [enabled, organizationId])

  useEffect(() => {
    if (!enabled || !organizationId) return
    let active = true
    setError(null)
    setMissing(false)
    if (loaded.current) setRefreshing(true)
    else setLoading(true)
    void getPlatformOrganizationDetail(organizationId).then(
      (next) => {
        if (!active) return
        if (next.state === 'missing') {
          setOrganization(null)
          setMembers([])
          setMemberCount(null)
          setMembersError(null)
          setAudit([])
          setAuditError(null)
          setMissing(true)
        } else {
          setOrganization(next.organization)
          setMembers(next.members)
          setMemberCount(next.memberCount)
          setMembersError(next.membersError)
          setAudit(next.audit)
          setAuditError(next.auditError)
          setMissing(false)
        }
        loaded.current = true
        setLoading(false)
        setRefreshing(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('platform organization', caught)
        setError(organizationMessage(caught, 'Unable to load this organization.'))
        setLoading(false)
        setRefreshing(false)
      },
    )
    return () => {
      active = false
    }
  }, [enabled, organizationId, request])

  return {
    organization,
    missing,
    members,
    memberCount,
    membersError,
    audit,
    auditError,
    loading,
    refreshing,
    error,
    reload,
  }
}

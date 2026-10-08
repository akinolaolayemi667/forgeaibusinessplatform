import { useCallback, useEffect, useState } from 'react'
import { auditMessage, getAuditLogs } from '@/lib/auditLogs'
import type { AuditLog } from '@/types/auditLogs'

export function useAuditLogs(organizationId: string | null) {
  const [logs, setLogs] = useState<AuditLog[]>([])
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
    void getAuditLogs(organizationId).then(
      (next) => {
        if (!active) return
        setLogs(next)
        setError(null)
        setLoading(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('audit logs', caught)
        setLogs([])
        setError(auditMessage(caught))
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [organizationId, request])

  return { logs, loading, error, reload }
}

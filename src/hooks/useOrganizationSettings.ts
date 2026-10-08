import { useCallback, useEffect, useState } from 'react'
import { getOrganization, organizationMessage, updateOrganization } from '@/lib/organizationSettings'
import type { OrganizationDraft, OrganizationRecord } from '@/types/organizationSettings'

export function useOrganizationSettings(organizationId: string | null) {
  const [record, setRecord] = useState<OrganizationRecord | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(Boolean(organizationId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [request, setRequest] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setRequest((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!organizationId) return
    let active = true
    void getOrganization(organizationId).then(
      (next) => {
        if (!active) return
        setRecord(next)
        setName(next?.name ?? '')
        setSlug(next?.slug ?? '')
        setError(next ? null : 'Unable to load organization settings.')
        setLoading(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('organization settings', caught)
        setRecord(null)
        setError(organizationMessage(caught, 'Unable to load organization settings.'))
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [organizationId, request])

  const save = useCallback(async (draft: OrganizationDraft) => {
    if (!organizationId) return null
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const next = await updateOrganization(organizationId, draft)
      setRecord(next)
      setName(next.name)
      setSlug(next.slug)
      setNotice('Organization saved.')
      return next
    } catch (caught) {
      if (import.meta.env.DEV) console.info('organization update', caught)
      setError(organizationMessage(caught, 'Unable to update organization.'))
      return null
    } finally {
      setSaving(false)
    }
  }, [organizationId])

  return { record, name, setName, slug, setSlug, loading, saving, error, notice, reload, save }
}

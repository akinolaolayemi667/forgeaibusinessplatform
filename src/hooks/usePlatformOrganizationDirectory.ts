import { useCallback, useEffect, useRef, useState } from 'react'
import { getPlatformOrganizationDirectory, organizationMessage } from '@/lib/platformOrganizations'
import { organizationPageSize, type OrganizationSort, type PlatformOrganizationRow } from '@/types/platformOrganizations'

export function usePlatformOrganizationDirectory(enabled: boolean) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<OrganizationSort>('created_desc')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<PlatformOrganizationRow[]>([])
  const [total, setTotal] = useState(0)
  const [membersStatus, setMembersStatus] = useState<'live' | 'not_connected'>('live')
  const [loading, setLoading] = useState(enabled)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState(0)
  const loaded = useRef(false)

  const reload = useCallback(() => {
    if (!enabled) return
    setRequest((current) => current + 1)
  }, [enabled])

  function updateSearch(value: string) {
    setSearch(value)
    setPage(0)
  }

  function updateSort(value: OrganizationSort) {
    setSort(value)
    setPage(0)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!enabled) return
    let active = true
    setError(null)
    if (loaded.current) setRefreshing(true)
    else setLoading(true)
    void getPlatformOrganizationDirectory({ search: query, sort, page }).then(
      (next) => {
        if (!active) return
        const pageCount = Math.max(1, Math.ceil(next.total / organizationPageSize))
        if (page > pageCount - 1) {
          setPage(pageCount - 1)
          setRefreshing(false)
          setLoading(false)
          return
        }
        loaded.current = true
        setRows(next.rows)
        setTotal(next.total)
        setMembersStatus(next.membersStatus)
        setLoading(false)
        setRefreshing(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('platform organizations', caught)
        setError(organizationMessage(caught, 'Unable to load platform organizations.'))
        setLoading(false)
        setRefreshing(false)
      },
    )
    return () => {
      active = false
    }
  }, [enabled, page, query, request, sort])

  return {
    search,
    setSearch: updateSearch,
    sort,
    setSort: updateSort,
    page,
    setPage,
    rows,
    total,
    membersStatus,
    loading,
    refreshing,
    error,
    reload,
  }
}

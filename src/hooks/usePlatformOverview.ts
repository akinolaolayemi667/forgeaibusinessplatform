import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { filterActivity, getPlatformSnapshot, growthSeries } from '@/lib/platformOverview'
import type { PlatformRange, PlatformSnapshot } from '@/types/platformOverview'

export function usePlatformOverview(enabled: boolean) {
  const [range, setRange] = useState<PlatformRange>('30d')
  const [snapshot, setSnapshot] = useState<PlatformSnapshot | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState(0)
  const loaded = useRef(false)

  const reload = useCallback(() => {
    if (!enabled) return
    setRequest((current) => current + 1)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    let active = true
    setError(null)
    if (loaded.current) setRefreshing(true)
    else setLoading(true)
    void getPlatformSnapshot().then(
      (next) => {
        if (!active) return
        loaded.current = true
        setSnapshot(next)
        setLoading(false)
        setRefreshing(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('platform dashboard', caught)
        setError('Unable to load the platform dashboard.')
        setLoading(false)
        setRefreshing(false)
      },
    )
    return () => {
      active = false
    }
  }, [enabled, request])

  const view = useMemo(() => {
    if (!snapshot) return null
    return {
      ...snapshot,
      organizationGrowth: growthSeries(snapshot.organizationDates, range),
      userGrowth: growthSeries(snapshot.profileDates, range),
      activity: filterActivity(snapshot.activity, range),
    }
  }, [range, snapshot])

  return { view, loading, refreshing, error, range, setRange, reload }
}

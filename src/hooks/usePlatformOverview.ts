import { useCallback, useEffect, useState } from 'react'
import { getPlatformOverview } from '@/lib/platformOverview'
import type { PlatformOverview } from '@/lib/platformOverview'

export function usePlatformOverview(enabled: boolean) {
  const [overview, setOverview] = useState<PlatformOverview | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [request, setRequest] = useState(0)

  const reload = useCallback(() => {
    if (!enabled) return
    setLoading(true)
    setRequest((current) => current + 1)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    let active = true
    void getPlatformOverview().then(
      (next) => {
        if (!active) return
        setOverview(next)
        setLoading(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('platform overview', caught)
        setOverview(null)
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [enabled, request])

  return { overview, loading, reload }
}

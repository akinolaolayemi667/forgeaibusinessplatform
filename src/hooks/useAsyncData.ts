import { useEffect, useRef, useState } from 'react'

export type AsyncData<T> = {
  data: T | null
  error: string | null
  loading: boolean
}

export function useAsyncData<T>(key: string, load: () => Promise<T>): AsyncData<T> {
  const loadRef = useRef(load)
  loadRef.current = load
  const [state, setState] = useState<AsyncData<T>>({
    data: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    let active = true
    setState({ data: null, error: null, loading: true })
    loadRef.current()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false })
      })
      .catch((reason: unknown) => {
        if (!active) return
        const message = reason instanceof Error ? reason.message : 'Unable to load records.'
        setState({ data: null, error: message, loading: false })
      })
    return () => {
      active = false
    }
  }, [key])

  return state
}

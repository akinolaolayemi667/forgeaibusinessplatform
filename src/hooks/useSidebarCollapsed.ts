import { useCallback, useState } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

const KEY = 'forge.sidebar'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => readStorage(KEY) === true)

  const toggle = useCallback(() => {
    setCollapsed((value) => {
      const next = !value
      writeStorage(KEY, next)
      return next
    })
  }, [])

  return { collapsed, toggle }
}

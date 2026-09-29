import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.documentElement.dataset.pageTitle = title
    const apply = () => {
      document.title = title
    }
    apply()
    const timer = window.setTimeout(apply, 0)
    return () => {
      window.clearTimeout(timer)
      if (document.documentElement.dataset.pageTitle === title) delete document.documentElement.dataset.pageTitle
    }
  }, [title])
}

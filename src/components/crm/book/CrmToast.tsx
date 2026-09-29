import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useCrm } from '@/hooks/useCrm'

export function CrmToast() {
  const { toast, dismissToast } = useCrm()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(dismissToast, 3200)
    return () => window.clearTimeout(timer)
  }, [dismissToast, toast])

  if (!toast) return null

  return (
    <motion.div
      key={toast.id}
      role="status"
      className="fixed right-4 bottom-4 z-[60] max-w-sm border border-stroke bg-surface-overlay px-4 py-3 text-sm text-copy shadow-md"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <span className="mr-2 inline-block size-1.5 bg-ember align-middle" aria-hidden />
      {toast.message}
    </motion.div>
  )
}

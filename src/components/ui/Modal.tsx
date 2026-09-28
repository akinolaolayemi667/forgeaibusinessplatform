import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getFocusable, trapTabKey } from '@/utils/focus'

type ModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const focusables = panel ? getFocusable(panel) : []
    ;(focusables[0] ?? panel)?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
      if (panel) trapTabKey(event, panel)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <motion.div
        className="absolute inset-0 bg-ink/55"
        aria-hidden
        onClick={() => onCloseRef.current()}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        data-theme="paper"
        className="relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-stroke bg-surface-raised p-5 text-copy outline-none"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      >
        <h2 id={titleId} className="pr-10 font-display text-2xl text-copy">
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className="mt-1 text-sm text-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-4">{children}</div>
        <button
          type="button"
          className="absolute top-4 right-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-copy hover:bg-wash"
          aria-label="Close dialog"
          onClick={() => onCloseRef.current()}
        >
          <X aria-hidden size={18} />
        </button>
      </motion.div>
    </div>,
    document.body,
  )
}

import { useId, useState, type ReactNode } from 'react'

type TooltipProps = {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <span className="inline-flex" aria-describedby={open ? id : undefined}>
        {children}
      </span>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="pointer-events-none absolute top-full left-1/2 z-30 mt-2 w-max max-w-xs -translate-x-1/2 rounded-sm border border-steel bg-black px-2 py-1 text-xs text-paper"
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}

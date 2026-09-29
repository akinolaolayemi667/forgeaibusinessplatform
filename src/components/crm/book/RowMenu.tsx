import { useEffect, useId, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/cn'

export function RowMenu({
  label,
  items,
}: {
  label: string
  items: { id: string; label: string; onSelect: () => void }[]
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  useClickOutside(rootRef, () => setOpen(false), open)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div ref={rootRef} className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-sm text-muted hover:bg-wash hover:text-copy"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal aria-hidden size={16} />
      </button>
      {open ? (
        <div id={menuId} role="menu" className="absolute right-0 z-30 mt-1 min-w-44 border border-stroke bg-surface-overlay p-1 shadow-md">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={cn(
                'flex w-full cursor-pointer px-3 py-2 text-left text-sm text-copy hover:bg-wash',
                index === active && 'bg-wash',
              )}
              onMouseEnter={() => setActive(index)}
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

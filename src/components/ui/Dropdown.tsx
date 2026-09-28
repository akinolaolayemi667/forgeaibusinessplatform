import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/cn'

export type DropdownItem = {
  id: string
  label: string
  disabled?: boolean
  onSelect: () => void
}

type DropdownProps = {
  label: string
  menuLabel?: string
  items: DropdownItem[]
  align?: 'start' | 'end'
  hint?: string
  trigger?: ReactNode
}

function moveIndex(items: DropdownItem[], current: number, direction: 1 | -1) {
  if (items.length === 0) return 0
  let index = current
  for (let step = 0; step < items.length; step += 1) {
    index = (index + direction + items.length) % items.length
    if (!items[index]?.disabled) return index
  }
  return current
}

export function Dropdown({ label, menuLabel, items, align = 'start', hint, trigger }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuId = useId()
  useClickOutside(rootRef, () => setOpen(false), open)

  useEffect(() => {
    if (!open) return
    itemRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  function openMenu() {
    if (items.length === 0) return
    const first = items.findIndex((item) => !item.disabled)
    setActiveIndex(first === -1 ? 0 : first)
    setOpen(true)
  }

  function choose(item: DropdownItem) {
    if (item.disabled) return
    item.onSelect()
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => moveIndex(items, current, 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => moveIndex(items, current, -1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      const first = items.findIndex((item) => !item.disabled)
      setActiveIndex(first === -1 ? 0 : first)
    } else if (event.key === 'End') {
      event.preventDefault()
      const last = items.findLastIndex((item) => !item.disabled)
      setActiveIndex(last === -1 ? 0 : last)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm text-copy hover:bg-wash"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={menuLabel ?? label}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (!open) openMenu()
          }
        }}
      >
        {trigger ?? (
          <>
            <span className="max-w-40 truncate">{label}</span>
            <ChevronDown aria-hidden size={16} />
          </>
        )}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={menuLabel ?? label}
          className={cn(
            'absolute z-50 mt-2 min-w-56 rounded-lg border border-stroke bg-surface-raised p-1',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          onKeyDown={onMenuKeyDown}
        >
          {hint ? <p className="border-b border-stroke px-3 py-2 text-xs text-muted">{hint}</p> : null}
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              tabIndex={index === activeIndex ? 0 : -1}
              className={cn(
                'flex w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-copy hover:bg-wash disabled:cursor-not-allowed disabled:text-muted',
                index === activeIndex && 'bg-wash',
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

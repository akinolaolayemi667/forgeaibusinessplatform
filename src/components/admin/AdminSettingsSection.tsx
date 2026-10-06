import type { ReactNode } from 'react'

export function AdminSettingsSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border border-stroke bg-surface-raised">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id={`${id}-title`} className="font-display text-xl text-paper">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ash">{description}</p>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">{children}</div>
    </section>
  )
}

export function AdminToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 border border-stroke px-3 py-3 text-left text-sm text-paper hover:bg-wash"
    >
      <span>{label}</span>
      <span className={checked ? 'bg-ember text-on-accent' : 'bg-steel text-ash'} >
        <span className="inline-block min-w-12 px-2 py-1 text-center font-mono text-[10px] uppercase tracking-[0.12em]">
          {checked ? 'On' : 'Off'}
        </span>
      </span>
    </button>
  )
}

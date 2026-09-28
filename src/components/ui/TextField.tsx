import { cn } from '@/lib/cn'

type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  error?: string
  hint?: string
  className?: string
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  error,
  hint,
  className,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-copy">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-11 rounded-md border bg-surface-raised px-3 text-copy outline-none',
          error ? 'border-danger' : 'border-stroke',
        )}
      />
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-badge-danger-fg">
          {error}
        </p>
      ) : null}
    </div>
  )
}

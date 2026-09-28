import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-ember text-paper hover:bg-ember-deep',
  secondary: 'bg-oxide text-paper hover:bg-oxide-deep',
  ghost: 'bg-transparent text-copy hover:bg-wash',
  outline: 'border border-stroke bg-transparent text-copy hover:bg-wash',
  danger: 'bg-danger text-paper hover:bg-danger-deep',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    variantClass[variant],
    sizeClass[size],
    className,
  )
}

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
} & ComponentProps<'button'>

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="size-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
            aria-hidden
          />
          Working…
        </>
      ) : (
        children
      )}
    </button>
  )
}

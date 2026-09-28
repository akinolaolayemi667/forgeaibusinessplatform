import { useState } from 'react'
import { cn } from '@/lib/cn'
import { getInitials } from '@/utils/format'

type AvatarSize = 'sm' | 'md' | 'lg'

const sizeClass: Record<AvatarSize, string> = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
}

type AvatarProps = {
  name: string
  src?: string
  size?: AvatarSize
  decorative?: boolean
}

export function Avatar({ name, src, size = 'md', decorative = true }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-oxide font-medium text-paper',
        sizeClass[size],
      )}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative ? true : undefined}
    >
      {showImage ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}

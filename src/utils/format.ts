export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactMoney(value: number) {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const digits = abs >= 10_000_000 ? 1 : 2
    const text = (abs / 1_000_000).toFixed(digits).replace(/0$/, '').replace(/\.0$/, '')
    return `${sign}$${text}M`
  }
  if (abs >= 1_000) {
    const thousands = abs / 1_000
    const text = thousands >= 100 ? String(Math.round(thousands)) : (Math.round(thousands * 10) / 10).toFixed(1).replace(/\.0$/, '')
    return `${sign}$${text}K`
  }
  return formatCurrency(value)
}

export function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? '').join('')
  return letters || '?'
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function nameFromEmail(email: string) {
  const local = email.trim().split('@')[0] ?? ''
  const words = local
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return 'Operator'
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

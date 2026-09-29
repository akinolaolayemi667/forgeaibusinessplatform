import { formatDate } from '@/utils/format'

const hour = 60 * 60 * 1000

export function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * hour).toISOString()
}

export function hoursAhead(hours: number) {
  return new Date(Date.now() + hours * hour).toISOString()
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function formatActivityWhen(iso: string) {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return iso
  const now = new Date()
  const hours = (now.getTime() - then.getTime()) / hour
  if (hours >= 0 && hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60))
    return `${minutes}m ago`
  }
  if (hours >= 1 && hours < 6) {
    const rounded = Math.round(hours)
    return `${rounded} hour${rounded === 1 ? '' : 's'} ago`
  }
  if (sameDay(then, now)) return 'Today'
  const yesterday = new Date(now.getTime() - 24 * hour)
  if (sameDay(then, yesterday)) return 'Yesterday'
  return formatDate(iso)
}

export function formatDue(iso: string) {
  const when = formatActivityWhen(iso)
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
  if (when === 'Today' || when === 'Yesterday' || when.endsWith('ago')) return `${when} · ${time}`
  return `${when} · ${time}`
}

export function withinActivityWindow(iso: string, window: 'any' | 'today' | 'yesterday' | 'week') {
  if (window === 'any') return true
  const then = new Date(iso)
  const now = new Date()
  if (window === 'today') return sameDay(then, now)
  if (window === 'yesterday') return sameDay(then, new Date(now.getTime() - 24 * hour))
  return now.getTime() - then.getTime() <= 7 * 24 * hour && then.getTime() <= now.getTime()
}

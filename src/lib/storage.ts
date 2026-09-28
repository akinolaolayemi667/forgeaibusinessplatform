export function readStorage(key: string): unknown {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function clearStorage(key: string) {
  sessionStorage.removeItem(key)
}

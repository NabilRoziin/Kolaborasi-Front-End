export type AuthUser = {
  id: string
  name?: string
  email?: string
  avatarUrl?: string
  role?: "customer" | "staff"
}

const STORAGE_KEY = "auth:user"
const AUTH_EVENT = "v0-auth-change"

function isBrowser() {
  return typeof window !== "undefined"
}

export function getUser(): AuthUser | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function setUser(user: AuthUser) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  emitAuthChange(user)
}

export function clearUser() {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEY)
  emitAuthChange(null)
}

export function onAuthChange(cb: (user: AuthUser | null) => void) {
  if (!isBrowser()) return () => {}

  const handler = (e: Event) => {
    if (e instanceof StorageEvent) {
      if (e.key === STORAGE_KEY) cb(getUser())
    } else {
      // custom event
      cb(getUser())
    }
  }

  window.addEventListener("storage", handler)
  window.addEventListener(AUTH_EVENT, handler as EventListener)

  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(AUTH_EVENT, handler as EventListener)
  }
}

function emitAuthChange(_user: AuthUser | null) {
  if (!isBrowser()) return
  window.dispatchEvent(new Event(AUTH_EVENT))
}

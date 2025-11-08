"use client"

const FIRST_SEEN_KEY_PREFIX = "welcome:first-seen:"
const CLAIMED_KEY_PREFIX = "welcome:claimed:"
const ELIGIBLE_SESSION_PREFIX = "welcome:eligible_session:"
const DISCOUNT_EVENT = "kebabnation:discount-updated"

// 10% welcome discount
export const WELCOME_DISCOUNT_PERCENT = 0.1

function isBrowser() {
  return typeof window !== "undefined"
}

function lsGet(key: string) {
  if (!isBrowser()) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function lsSet(key: string, val: string) {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, val)
  } catch {}
}

function ssGet(key: string) {
  if (!isBrowser()) return null
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function ssSet(key: string, val: string) {
  if (!isBrowser()) return
  try {
    window.sessionStorage.setItem(key, val)
  } catch {}
}

function emitDiscountChange() {
  if (!isBrowser()) return
  window.dispatchEvent(new Event(DISCOUNT_EVENT))
}

// Call on successful login/register
export function markFirstLogin(email?: string | null) {
  if (!email) return
  const seenKey = FIRST_SEEN_KEY_PREFIX + email
  const eligibleKey = ELIGIBLE_SESSION_PREFIX + email
  const seen = !!lsGet(seenKey)
  if (!seen) {
    // first time we ever see this email: mark seen and set session eligibility
    lsSet(seenKey, "1")
    ssSet(eligibleKey, "1")
  }
}

export function isSessionEligible(email?: string | null) {
  if (!email) return false
  const eligibleKey = ELIGIBLE_SESSION_PREFIX + email
  return !!ssGet(eligibleKey)
}

export function isClaimed(email?: string | null) {
  if (!email) return false
  const claimKey = CLAIMED_KEY_PREFIX + email
  return !!lsGet(claimKey)
}

export function claimWelcomeDiscount(email?: string | null) {
  if (!email) return
  const claimKey = CLAIMED_KEY_PREFIX + email
  lsSet(claimKey, "1")
  emitDiscountChange()
}

export function getActiveDiscountPercentage(email?: string | null) {
  if (!email) return 0
  return isClaimed(email) ? WELCOME_DISCOUNT_PERCENT : 0
}

export function onDiscountChange(cb: () => void) {
  if (!isBrowser()) return () => {}
  const handler = () => cb()
  window.addEventListener(DISCOUNT_EVENT, handler)
  return () => window.removeEventListener(DISCOUNT_EVENT, handler)
}

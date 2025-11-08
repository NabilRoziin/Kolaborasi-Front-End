"use client"

import { useEffect, useState, useCallback } from "react"
import { clearUser, getUser, setUser, type AuthUser, onAuthChange } from "@/lib/auth"
import { markFirstLogin } from "@/lib/discount"

type SignInInput = { email: string; password: string; role?: "customer" | "staff" }
type RegisterInput = { name: string; email: string; password: string }

export function useAuth() {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUser()
    setUserState(currentUser)
    setIsLoading(false)
    const unsub = onAuthChange(setUserState)
    return () => unsub()
  }, [])

  const signIn = useCallback(async ({ email, role = "customer" }: SignInInput) => {
    try {
      const name = email.split("@")[0]
      setUser({
        id: crypto.randomUUID(),
        name,
        email,
        avatarUrl: "/diverse-user-avatars.png",
        role,
      })
      markFirstLogin(email)
    } catch (error) {
      console.error("[v0] Sign in error:", error)
      throw error
    }
  }, [])

  const register = useCallback(async ({ name, email }: RegisterInput) => {
    try {
      setUser({
        id: crypto.randomUUID(),
        name,
        email,
        avatarUrl: "/diverse-user-avatars.png",
        role: "customer",
      })
      markFirstLogin(email)
    } catch (error) {
      console.error("[v0] Register error:", error)
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    clearUser()
    setUserState(null)
  }, [])

  return { user, signIn, signOut, register, isLoading }
}

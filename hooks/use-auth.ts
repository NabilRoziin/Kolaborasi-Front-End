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
  // console.log("🔥 useAuth mounted")

  const token = localStorage.getItem("token")
  // console.log("🟦 Token found:", token)

  // if (!token) {
  //   console.log("⚠️ No token, user dianggap logout")
  //   setIsLoading(false)
  //   return
  // }

  // console.log("📡 Fetching /api/me ...")
  //   const token  = localStorage.getItem("token")
  //   if(!token) {
  //     setIsLoading(false)
  //     return
  //   }

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("🟩 /api/me response:", data)
        setUserState(data.user)
      })
      .catch(() => {
        setUserState(null)
        localStorage.removeItem("token")
      })
      .catch(err => {
        console.log("❌ Error fetching /api/me:", err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({email, password}),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      localStorage.setItem("token", data.token)

      setUserState(data.user)      
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }, [])

  const register = useCallback(async ({ name, email, password }: RegisterInput) => {
    try {
      const res = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    // Simpan token dari API
    localStorage.setItem("token", data.token)

    // Set user ke state
    setUserState(data.user)
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem("token")
    setUserState(null)
  }, [])

  return { user, signIn, signOut, register, isLoading }
}

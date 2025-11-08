"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type RoleGuardProps = {
  children: React.ReactNode
  allowedRoles?: ("customer" | "staff")[]
  allowedRole?: "customer" | "staff"
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, allowedRole, redirectTo = "/" }: RoleGuardProps) {
  const { user } = useAuth()
  const router = useRouter()

  const roles = allowedRoles || (allowedRole ? [allowedRole] : [])

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (!roles.includes(user.role)) {
      router.push(redirectTo)
    }
  }, [user, roles, redirectTo, router])

  if (!user || !roles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

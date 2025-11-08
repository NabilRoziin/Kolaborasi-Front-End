"use client"

import type { ReactNode } from "react"
import { StaffLoginForm } from "@/components/auth/staff-login-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Page(): ReactNode {
  return (
    <main className="container mx-auto min-h-[calc(100dvh-4rem)] px-4 py-8 md:py-12 flex items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="h-4 w-4" />
          Beranda
        </Link>
      </div>

      <div className="mx-auto w-full max-w-md">
        <StaffLoginForm />
      </div>
    </main>
  )
}

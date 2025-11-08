"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function Page(): ReactNode {
  const [selectedRole, setSelectedRole] = useState<"customer" | "staff" | null>(null)

  if (selectedRole === null) {
    return (
      <main className="container mx-auto min-h-[calc(100dvh-4rem)] px-4 py-10 flex items-center justify-center relative">
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

        <Card className="mx-auto w-full max-w-md p-8 md:p-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Sign In
          </Link>

          <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-balance">Buat Akun Anda</h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">Pilih jenis akun Anda</p>

          <div className="grid gap-4">
            <Button
              size="lg"
              variant="outline"
              className="h-auto py-6 flex-col gap-2 bg-transparent"
              onClick={() => setSelectedRole("customer")}
            >
              <Users className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Customer</div>
                <div className="text-xs text-muted-foreground">Jelajahi menu, pesan</div>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-auto py-6 flex-col gap-2 bg-transparent"
              onClick={() => setSelectedRole("staff")}
            >
              <Briefcase className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Staff</div>
                <div className="text-xs text-muted-foreground">Kelola pesanan, akses admin</div>
              </div>
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </main>
    )
  }

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
        <button
          onClick={() => setSelectedRole(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
        <RegisterForm role={selectedRole} />
      </div>
    </main>
  )
}

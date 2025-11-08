"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Page(): ReactNode {
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
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-balance">Sign in ke KebabNation</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">Pilih jenis akun Anda</p>

        <div className="grid gap-4">
          <Button asChild size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
            <Link href="/login/customer">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Customer</div>
                <div className="text-xs text-muted-foreground">Jelajahi menu, pesan</div>
              </div>
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
            <Link href="/login/staff">
              <Briefcase className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Staff</div>
                <div className="text-xs text-muted-foreground">Akses admin panel</div>
              </div>
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Buat satu
          </Link>
        </p>
      </Card>
    </main>
  )
}

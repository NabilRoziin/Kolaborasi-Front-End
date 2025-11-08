"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function DiscountClaimButton() {
  const [isClaimed, setIsClaimed] = useState(false)
  const { toast } = useToast()

  const handleClaimDiscount = () => {
    if (isClaimed) return

    setIsClaimed(true)
    toast({
      title: "Diskon Diklaim!",
      description: "Diskon 20% Anda telah berhasil diklaim. Gunakan kode: KEBAB20",
    })
  }

  return (
    <a
      href="#contact"
      onClick={(e) => {
        if (isClaimed) {
          e.preventDefault()
        } else {
          handleClaimDiscount()
        }
      }}
      className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium shadow-sm ml-1 transition-all ${
        isClaimed
          ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed opacity-50"
          : "bg-primary text-primary-foreground hover:opacity-90"
      }`}
    >
      {isClaimed ? "Diskon Sudah Diklaim" : "Claim Diskon"}
    </a>
  )
}

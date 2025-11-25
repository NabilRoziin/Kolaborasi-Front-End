"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/components/site/cart-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { MENU_IMAGE_MAP } from "@/components/site/image-map"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import React from "react"
import {
  isSessionEligible,
  isClaimed,
  claimWelcomeDiscount,
  getActiveDiscountPercentage,
  onDiscountChange,
  WELCOME_DISCOUNT_PERCENT,
} from "@/lib/discount"

function formatCurrency(n: number) {
  return "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function FloatingCart() {
  const { items, totalQuantity, totalPrice, addItem, decrementItem, removeItem, clear } = useCart()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const userEmail = user?.email || null

  // re-render when discount claimed
  const [, setVersion] = useState(0)
  // @ts-ignore - safe in client
  React.useEffect(() => {
    const unsub = onDiscountChange(() => setVersion((v) => v + 1))
    return () => unsub()
  }, [])

  const FREE_DELIVERY_THRESHOLD = 100000
  const SHIPPING_FEE = 5000

  const discountPct = getActiveDiscountPercentage(userEmail)
  const discountAmount = Math.floor(totalPrice * discountPct)
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - Math.max(0, totalPrice - discountAmount))
  const progressValue = Math.min(100, ((totalPrice - discountAmount) / FREE_DELIVERY_THRESHOLD) * 100)

  const handleCheckout = () => {
    if (!user) {
      // User not logged in, redirect to login
      router.push("/login/customer")
      return
    }
    setOpen(false)
    router.push("/checkout")
  }

  const canShowClaim =
    !!userEmail && isSessionEligible(userEmail) && !isClaimed(userEmail) && totalQuantity > 0 /* optional gating */
    console.log("CART ITEMS =>", items)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">Open cart</span>
          {totalQuantity > 0 && (
            <span
              aria-label={`Cart items: ${totalQuantity}`}
              className="absolute -top-2 -right-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground"
            >
              {totalQuantity}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-[100dvh] max-w-[92vw] sm:max-w-sm md:max-w-md flex-col overflow-hidden"
      >
        <SheetHeader className="space-y-1 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Your Cart</SheetTitle>
            {totalQuantity > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Review items and checkout when ready.</p>
        </SheetHeader>

        <div className="mt-4 flex-1 min-h-0 overflow-hidden">
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-lg border border-border p-6 text-center">
              <Image
                src={"/images/empty-cart.jpg"}
                alt="Keranjang belanja kosong"
                width={120}
                height={120}
                className="opacity-60"
              />
              <p className="mt-3 text-sm text-muted-foreground">Your cart is empty.</p>
              <Button className="mt-3" onClick={() => setOpen(false)}>
                Browse menu
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="h-full pr-2">
                <div className="space-y-4">                  
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variant || "no-variant"}`}
                      className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-lg bg-card ring-1 ring-border p-4 md:p-5 transition-shadow hover:ring-foreground/20"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={MENU_IMAGE_MAP[item.id] || "/images/menu/classic-chicken-kebab.jpg"}
                          alt={`${item.name} image`}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.name}</p>
                            {item.variantName && (
                              <p className="text-xs text-primary font-medium">Variant: {item.variantName}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                          </div>
                          <button
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => removeItem(item.id, item.variant)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
                          <Button
                            size="icon"
                            variant="secondary"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => decrementItem(item.id, item.variant)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="icon"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() =>
                              addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                imageQuery: item.imageQuery,
                                variant: item.variant,
                              })
                            }
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* price column */}
                      <p className="justify-self-end text-sm font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {canShowClaim && (
                <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="text-sm">
                    Selamat datang! Anda berhak mendapatkan diskon {Math.round(WELCOME_DISCOUNT_PERCENT * 100)}% untuk
                    pemesanan pertama. Klik tombol di bawah untuk klaim.
                  </p>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        claimWelcomeDiscount(userEmail)
                      }}
                    >
                      Klaim Diskon
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-lg bg-primary/5 p-3 ring-1 ring-border">
                {remaining > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Spend {formatCurrency(remaining)} more for free delivery
                      </span>
                      <span className="font-medium">{Math.round(progressValue)}%</span>
                    </div>
                    <Progress value={progressValue} className="mt-2" />
                  </>
                ) : (
                  <div className="text-xs font-medium text-foreground">You've unlocked free delivery!</div>
                )}
              </div>
            </>
          )}
        </div>

        <Separator className="my-4" />
        <div className="space-y-3 shrink-0">
          <div className="rounded-lg bg-card ring-1 ring-border p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(totalPrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Diskon</span>
                <span className="font-medium text-green-600">- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">{remaining === 0 ? "Free" : formatCurrency(SHIPPING_FEE)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {formatCurrency(totalPrice - discountAmount + (remaining === 0 ? 0 : SHIPPING_FEE))}
              </span>
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={clear} className="flex-1" disabled={items.length === 0}>
              Clear
            </Button>
            {/* {!user && (
              <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                <Link href="/login/customer">Sign in</Link>
              </Button>
            )} */}
            <Button onClick={handleCheckout} className="flex-1" disabled={items.length === 0}>
              {user ? "Checkout" : "Login & Checkout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

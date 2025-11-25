"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/site/nav-bar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Clock, XCircle, CheckCircle, X, LogIn } from "lucide-react"
import Link from "next/link"
import { useOrders } from "@/components/site/orders-provider"
import { useAuth } from "@/hooks/use-auth"

type StatusKey = "processing" | "delivered" | "cancelled" | "completed";

const statusConfig: Record<StatusKey, { label: string; icon: any; variant: "default" | "secondary" | "destructive" | "success" }> = {
  processing: {
    label: "Sedang Diproses",
    icon: Clock,
    variant: "secondary",
  },
  delivered: {
    label: "Sedang Dikirim", 
    icon: Package,
    variant: "default",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle,
    variant: "success",
  },
  cancelled: {
    label: "Dibatalkan",
    icon: XCircle,
    variant: "destructive",
  },
};

function normalizeStatus(statusText: string): StatusKey {
  const statusMap: Record<string, StatusKey> = {
    // Exact match dengan Filament
    "Menunggu Pembayaran": "processing",
    "Sedang Diproses": "processing", 
    "Dikirim": "delivered",
    "Selesai": "completed",
    "Dibatalkan": "cancelled",
    
    // Fallback untuk existing data
    "pending": "processing",
    "process": "processing", 
    "processing": "processing",
    "diproses": "processing",
    "sedang diproses": "processing",
    
    "shipping": "delivered",
    "deliver": "delivered",
    "delivered": "delivered", 
    "dikirim": "delivered",
    "sedang dikirim": "delivered",
    
    "completed": "completed",
    "complete": "completed",
    "selesai": "completed",
    
    "cancelled": "cancelled", 
    "cancel": "cancelled",
    "batal": "cancelled",
    "dibatalkan": "cancelled",
  };
  
  return statusMap[statusText] || "processing";
}

export default function NotificationsPage() {
  const { orders, cancelOrder, dismissed, dismissNotification, refresh } = useOrders()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        refresh().finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    }
  }, [refresh, user, authLoading])

  // Filter orders hanya untuk user yang login
  const userOrders = orders.filter(order => {
    // Jika backend sudah filter by user, kita bisa skip
    // Tapi untuk safety, kita filter lagi di frontend
    return true // Untuk sekarang, tampilkan semua order dari user ini
  })

  // urutkan terbaru dulu
  const list = [...userOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  const filtered = list.filter((o) => !dismissed.includes(o.id))

  // Jika belum login
  if (!user && !authLoading) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <NavBar />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label="Kembali ke halaman sebelumnya">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">Notifikasi Pesanan</h1>
              <p className="text-sm text-muted-foreground mt-1">Pantau status pesanan Anda di sini</p>
            </div>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <LogIn className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Silakan login untuk melihat notifikasi pesanan</p>
              <Button asChild>
                <Link href="/login/customer">Login Sekarang</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <NavBar />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label="Kembali ke halaman sebelumnya">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">Notifikasi Pesanan</h1>
              <p className="text-sm text-muted-foreground mt-1">Pantau status pesanan Anda di sini</p>
            </div>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Memuat notifikasi...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <NavBar />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/" aria-label="Kembali ke halaman sebelumnya">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">Notifikasi Pesanan</h1>
            <p className="text-sm text-muted-foreground mt-1">Pantau status pesanan Anda di sini</p>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada notifikasi pesanan</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((order) => {
              console.log("ORDER RAW:", JSON.parse(JSON.stringify(order)))
              const key = normalizeStatus(order.status)
              console.log(`Status Mapping: "${order.status}" -> "${key}"`)
              const { icon: StatusIcon, label, variant } = statusConfig[key]

              const orderNumber = order.id

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">Pesanan #{orderNumber}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(order.orderDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={variant as "default" | "secondary" | "destructive" | "outline"}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {label}
                        </Badge>
                        {key === "processing" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Batalkan pesanan ini?")) {
                                cancelOrder(order.id)
                              }
                            }}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Batalkan
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Hapus notifikasi"
                          title="Hapus notifikasi"
                          onClick={() => dismissNotification(order.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3">Barang yang Dipesan</h3>
                        <div className="space-y-2">                          
                          {(order.items ?? []).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name}
                                {item.variantName && (
                                  <span className="text-primary ml-1">({item.variantName})</span>
                                )}
                                x{item.quantity}
                              </span>
                              <span className="font-medium">
                                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />    

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>Rp {(order.pricing?.subtotal?? 0).toLocaleString("id-ID")}</span>
                        </div>
                        {order.pricing.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Diskon</span>
                            <span className="text-primary">-Rp {order.pricing.discount.toLocaleString("id-ID")}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Biaya Pengiriman</span>
                          <span>Rp {order.pricing.shippingFee.toLocaleString("id-ID")}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total Pembayaran</span>
                          <span className="text-primary">Rp {order.pricing.total.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
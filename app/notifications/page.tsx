"use client"

import { NavBar } from "@/components/site/nav-bar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Clock, XCircle, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { useOrders } from "@/components/site/orders-provider"

type StatusKey = "processing" | "delivered" | "cancelled"

const statusConfig: Record<StatusKey, { label: string; icon: any; variant: "default" | "secondary" | "destructive" }> =
  {
    delivered: {
      label: "Sedang Diantar",
      icon: Package,
      variant: "default",
    },
    processing: {
      label: "Sedang di proses",
      icon: Clock,
      variant: "secondary",
    },
    cancelled: {
      label: "Dibatalkan",
      icon: XCircle,
      variant: "destructive",
    },
  }

function normalizeStatus(statusText: string): StatusKey {
  const s = statusText.toLowerCase()
  if (s.includes("proses")) return "processing"
  if (s.includes("antar") || s.includes("deliver")) return "delivered"
  if (s.includes("batal") || s.includes("cancel")) return "cancelled"
  return "processing"
}

export default function NotificationsPage() {
  const { orders, cancelOrder, dismissed, dismissNotification } = useOrders()

  // urutkan terbaru dulu (OrdersProvider sudah menambahkan order baru di depan, tapi kita jaga-jaga)
  const list = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  const filtered = list.filter((o) => !dismissed.includes(o.id))

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
                <p className="text-muted-foreground">Belum ada notifikasi</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((order) => {
              const key = normalizeStatus(order.status)
              const { icon: StatusIcon, label, variant } = statusConfig[key]

              const orderNumber = order.id // bisa disingkat jika ingin

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
                        <Badge variant={variant}>
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
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name} x{item.quantity}
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
                          <span>Rp {order.pricing.subtotal.toLocaleString("id-ID")}</span>
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

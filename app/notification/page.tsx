"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useOrders, type Order } from "@/components/site/orders-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Package, MapPin, Phone, User, CreditCard, FileText } from "lucide-react"
import Link from "next/link"

export default function NotificationPage() {
  const router = useRouter()
  const { getCurrentOrder } = useOrders()
  const [orderData, setOrderData] = useState<Order | null>(null)

  useEffect(() => {
    const currentOrder = getCurrentOrder()
    if (currentOrder) {
      setOrderData(currentOrder)
    }
  }, [getCurrentOrder])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">Tidak ada data pesanan</p>
            <Link href="/">
              <Button className="w-full">Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const orderDate = new Date(orderData.orderDate)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-balance">Pesanan Berhasil!</h1>
          <p className="text-sm md:text-base text-muted-foreground px-4 text-pretty">
            Terima kasih telah memesan. Pesanan Anda sedang diproses.
          </p>
        </div>

        {/* Order Status */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm md:text-base">Status Pesanan</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {orderDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white self-start sm:self-center whitespace-nowrap">
                {orderData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <User className="h-5 w-5" />
              Informasi Pemesan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Nama Lengkap</p>
                <p className="font-medium break-words text-sm md:text-base">{orderData.customerInfo.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Nomor Telepon</p>
                <p className="font-medium break-words text-sm md:text-base">{orderData.customerInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">Alamat Pengiriman</p>
                <p className="font-medium break-words text-sm md:text-base">{orderData.customerInfo.address}</p>
              </div>
            </div>

            {orderData.customerInfo.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium break-words text-sm md:text-base">{orderData.customerInfo.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Package className="h-5 w-5" />
              Detail Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-words text-sm md:text-base">{item.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap text-sm md:text-base">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {orderData.pricing.subtotal.toLocaleString("id-ID")}</span>
                </div>

                {orderData.pricing.discount > 0 && (
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Diskon</span>
                    <span className="text-green-600">-Rp {orderData.pricing.discount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground">Biaya Pengiriman</span>
                  <span>Rp {orderData.pricing.shippingFee.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-base md:text-lg">Total</span>
                <span className="font-bold text-lg md:text-xl text-primary">
                  Rp {orderData.pricing.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CreditCard className="h-5 w-5" />
              Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-sm md:text-base">{orderData.paymentMethod}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Kembali ke Beranda
            </Button>
          </Link>
          <Button onClick={() => window.print()} className="flex-1">
            Cetak Pesanan
          </Button>
        </div>
      </div>
    </div>
  )
}

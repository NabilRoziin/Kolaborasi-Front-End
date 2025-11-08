"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/site/cart-provider"
import { useOrders } from "@/components/site/orders-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { getActiveDiscountPercentage, isClaimed } from "@/lib/discount"

const PAYMENT_METHODS = [
  { id: "dana", name: "DANA", logo: "/dana-logo.png" },
  { id: "shopeepay", name: "ShopeePay", logo: "/shopeepay-logo.jpg" },
  { id: "gopay", name: "GoPay", logo: "/generic-digital-wallet-logo.png" },
  { id: "ovo", name: "OVO", logo: "/ovo-inspired-abstract.png" },
  { id: "bca", name: "BCA", logo: "/bca-logo.png" },
  { id: "mandiri", name: "Mandiri", logo: "/mandiri-bank-logo.jpg" },
  { id: "bni", name: "BNI", logo: "/bni-bank-logo.jpg" },
  { id: "bri", name: "BRI", logo: "/bri-bank-logo.jpg" },
]

const SHIPPING_FEE = 10000
// const DISCOUNT_PERCENTAGE = 0 // remove; dynamic now

// Helper function to format size label
function getSizeLabel(size?: "small" | "medium" | "large") {
  if (!size) return ""
  return size === "small" ? "Kecil" : size === "medium" ? "Sedang" : "Besar"
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clear } = useCart()
  const { addOrder } = useOrders()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    notes: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = totalPrice
  const claimed = isClaimed(user?.email || null)
  const discountPct = claimed ? getActiveDiscountPercentage(user?.email || null) : 0
  const discount = Math.floor(subtotal * discountPct)
  const total = subtotal - discount + SHIPPING_FEE

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nama depan wajib diisi"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nama belakang wajib diisi"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi"
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Nomor telepon tidak valid"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Alamat wajib diisi"
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = "Pilih metode pembayaran"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = () => {
    if (!validateForm()) {
      return
    }

    // Prepare order data
    const orderData = {
      customerInfo: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
      },
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageQuery: item.imageQuery,
        size: item.size, // Include size in order data
      })),
      pricing: {
        subtotal,
        discount, // persist claimed discount amount
        shippingFee: SHIPPING_FEE,
        total,
      },
      paymentMethod: PAYMENT_METHODS.find((pm) => pm.id === paymentMethod)?.name || "",
      status: "Sedang di proses",
      orderDate: new Date().toISOString(),
    }

    // Store order data in localStorage
    localStorage.setItem("currentOrder", JSON.stringify(orderData))

    addOrder(orderData)
    clear()

    router.push("/notification")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Keranjang Anda kosong</p>
            <Link href="/">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-balance">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs md:text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-xs md:text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs md:text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea
                    id="address"
                    placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-xs md:text-sm text-destructive">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Contoh: Jangan pakai cabe"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <div key={method.id}>
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                          htmlFor={method.id}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-3 md:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all h-full min-h-[100px]"
                        >
                          <Image
                            src={method.logo || "/placeholder.svg"}
                            alt={method.name}
                            width={80}
                            height={40}
                            className="mb-2 object-contain h-8 md:h-10 w-auto"
                          />
                          <span className="text-xs font-medium text-center">{method.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {errors.paymentMethod && (
                  <p className="text-xs md:text-sm text-destructive mt-2">{errors.paymentMethod}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size || "no-size"}`} className="flex justify-between text-sm gap-2">
                      <span className="text-muted-foreground flex-1 min-w-0">
                        <span className="truncate block">
                          {item.name} x{item.quantity}
                        </span>
                        {item.size && (
                          <span className="text-xs text-primary font-medium">({getSizeLabel(item.size)})</span>
                        )}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diskon</span>
                      <span className="text-green-600">-Rp {discount.toLocaleString("id-ID")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Pengiriman</span>
                    <span>Rp {SHIPPING_FEE.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base md:text-lg">Total</span>
                  <span className="font-bold text-lg md:text-xl text-primary">Rp {total.toLocaleString("id-ID")}</span>
                </div>

                {/* Checkout Button */}
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Konfirmasi Pesanan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

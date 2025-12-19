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
  { id: "cash", name: "Cash", logo: "/images/money.png" },
  { id: "emoney", name: "E-Money", logo: "/images/e-payment.png" },
]

const SHIPPING_FEE = 5000
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

  async function sendOrderToAPI(orderData: any) {
    try {
      const token = localStorage.getItem("token")

      console.log("📦 Data yang dikirim ke API:", orderData)
      console.log("🎟️ Token yang dikirim:", token)

      const res = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, // <= token masuk sini
        },
        body: JSON.stringify(orderData),
      })

      console.log("📦 Data yang dikirim ke API 2:", orderData)
      console.log("🎟️ Token yang dikirim 2:", token)

      if (!res.ok) {
        throw new Error("Gagal mengirim order ke server")
      }

      return await res.json()
    } catch (error) {
      console.error("Order API error:", error)
      throw error
    }
  }

  // Tambahkan function ini setelah sendOrderToAPI function
  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal update status order");
      }

      return await res.json();
    } catch (error) {
      console.error("Update status error:", error);
      throw error;
    }
  }

  const handleCheckout = async () => {
  if (!validateForm()) return;

  const orderData = {
    business_id: 1,
    user_id: user?.id,
    status: "pending",
    total_price: total,
    details: {
      customerInfo: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
      },
      pricing: {
        subtotal,
        discount,
        shippingFee: SHIPPING_FEE,
        total,
      },
      paymentMethod: PAYMENT_METHODS.find((pm) => pm.id === paymentMethod)?.name || "",
      paymentType: paymentMethod, // ✅ TAMBAH INI untuk tahu jenis pembayaran
    },
    products: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      final_price: item.price,
      variant_name: item.variantName || null,
    }))
  };

  // ✅ LOGIC BERBEDA UNTUK CASH vs E-MONEY
  if (paymentMethod === "cash") {
    // Untuk Cash - langsung simpan order dan redirect ke notifications
    const saved = await sendOrderToAPI(orderData);
    
    // Update status jadi "processing" untuk cash
    await updateOrderStatus(saved.data.id, "Sedang diproses");
    
    // Add ke local orders
    addOrder({
      id: saved.data.id,
      status: "Sedang diproses",
      total: total,
      date: new Date().toISOString(),
    });
    
    clear();
    router.push("/notifications?status=success");
    
  } else if (paymentMethod === "emoney") {
    // Untuk E-Money - proses Midtrans seperti sebelumnya
    const saved = await sendOrderToAPI(orderData);
    
    const orderID = saved.data.id;

    // Minta snap token
    const snapRes = await fetch("http://127.0.0.1:8000/api/midtrans/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        order_id: orderID,
        total_price: total,
        user: {
          name: user?.name,
          email: user?.email,
        },
      }),
    });

    const snapJson = await snapRes.json();
    const snapToken = snapJson.token;

    window.snap.pay(snapToken, {
      onSuccess: async (result) => {
        addOrder({
          id: orderID,
          status: "success",
          total: total,
          date: new Date().toISOString(),
        });
        clear();
        router.push("/notifications?status=success")
      },
      onPending: async (result) => {
        addOrder({
          id: orderID,
          status: "pending",
          total: total,
          date: new Date().toISOString(),
        }); 
        router.push("/notifications?status=pending")
      },
      onError: () => {
        router.push("/notifications?status=failed")
      },
      onClose: () => {
        alert("Kamu nutup popup sebelum bayar 😭")
      },
    });
  }
};


  // =======================
  // FORM HANDLING
  // =======================
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

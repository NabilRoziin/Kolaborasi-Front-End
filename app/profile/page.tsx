"use client"

import { useAuth } from "@/hooks/use-auth"
import { useOrders } from "@/components/site/orders-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CustomerOnly } from "@/components/site/customer-only"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User, ShoppingBag, Settings, LogOut, Camera, ArrowLeft } from "lucide-react"

// export function CustomerOnly({ children }) {
//   const { user, isLoading } = useAuth()
//   const router = useRouter()

//   if (isLoading) return null // jangan redirect dulu

//   if (!user) {
//     router.push("/login")
//     return null
//   }

//   return children
// }

export default function ProfilePage() {
  const { user, signOut, isLoading } = useAuth()
  const { orders } = useOrders()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  if (isLoading)
  {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }


  if (!user) {
    return (      
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat profil...</p>
          </div>
        </div>      
    )
  }

  const customerOrders = orders.filter((order) => order.status !== "Dibatalkan")
  const totalOrders = customerOrders.length
  const totalDiscount = customerOrders.reduce((sum, o) => sum + (o.pricing?.discount || 0), 0)

  const handleSaveProfile = () => {
    // In a real app, this would update the user in the backend
    setIsEditing(false)
  }

  const handleLogout = () => {
    signOut()
    localStorage.clear()
    router.push("/")
  }

  return (
      <div className="min-h-screen bg-background py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 md:mb-8 flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
              className="h-9 w-9 md:h-10 md:w-10"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profil Saya</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Kelola informasi profil dan pengaturan akun Anda
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  Informasi Profil
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Data dasar akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24">
                      <AvatarImage
                        src={user.avatarUrl || "/placeholder.svg?height=96&width=96&query=user avatar"}
                        alt={user.name ?? "User"}
                      />
                      <AvatarFallback className="text-xl md:text-2xl">
                        {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-7 w-7 md:h-8 md:w-8 rounded-full"
                    >
                      <Camera className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg md:text-xl font-semibold">{user.name || "User"}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground break-all">{user.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 md:px-3 py-0.5 md:py-1 text-xs font-medium text-primary">
                        Customer
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Nama Lengkap
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleSaveProfile} className="w-full sm:w-auto text-sm">
                        Simpan Perubahan
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto text-sm"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Nama Lengkap</p>
                        <p className="text-sm md:text-base font-medium">{user.name || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                      <p className="text-sm md:text-base font-medium break-all">{user.email || "-"}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto text-sm">
                      Edit Profil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                  Riwayat Pesanan
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Statistik pesanan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs md:text-sm text-muted-foreground">Total Pesanan</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{totalOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {totalOrders === 0 ? "Belum ada pesanan" : "Pesanan berhasil"}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs md:text-sm text-muted-foreground">Total Diskon</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                      Rp {totalDiscount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Akumulasi diskon dari pesanan Anda</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/notifications")}
                    className="w-full sm:w-auto text-sm"
                  >
                    Lihat Semua Pesanan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  Pengaturan Akun
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Kelola preferensi dan keamanan akun</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                  Ubah Password
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                  Notifikasi & Preferensi
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                  Alamat Pengiriman
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                  Metode Pembayaran
                </Button>
              </CardContent>
            </Card>

            {/* Logout Card */}
            <Card className="border-destructive/50">
              <CardContent className="pt-4 md:pt-6">
                <Button variant="destructive" className="w-full gap-2 text-sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Keluar dari Akun
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

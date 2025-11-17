"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  { href: "#home", label: "Beranda" },
  { href: "#menu", label: "Menu Kami" },
  { href: "#about", label: "Tentang Kami" },
  { href: "#testimony", label: "Testimoni" },
  { href: "#contact", label: "Kontak" },
]

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [onHero, setOnHero] = useState(true)
  const { user } = useAuth()
  const [business, setBusiness] = useState<any>(null)

  const isStaff = user?.role === "staff"
  useEffect(() => {
      async function fetchBusiness() {
        try {
          const res = await fetch("http://localhost:8000/api/business/Sultan Java")
          const json = await res.json()
          setBusiness(json.data)
        } catch (err) {
          console.error("Error fetching business:", err)
        }
      }
  
      fetchBusiness()
    }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const el = document.getElementById("hero")
    if (!el) {
      setOnHero(false)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setOnHero(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (isStaff) {
    return null
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        onHero
          ? "border-b border-transparent bg-destructive text-destructive-foreground"
          : "border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between">
        <Link href="#home" className="flex items-center  flex-shrink-0">
          <Image
            src={business?.logo_url ?? "/placeholder.png"}
            alt="KebabNation logo"
            width={40}
            height={40}
            className="h-15 w-23  md:h-20 md:w-28"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "px-1 text-sm lg:text-base font-semibold tracking-wide transition-colors",
                onHero
                  ? "text-destructive-foreground/90 hover:text-destructive-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-5 flex-shrink-0">

          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "relative",
              onHero
                ? "hover:bg-destructive-foreground/10 text-destructive-foreground"
                : "hover:bg-accent text-foreground",
            )}
          >
            <Link href="/notifications" aria-label="Notifikasi">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                  <AvatarImage
                    src={user.avatarUrl || "/placeholder.svg?height=64&width=64&query=user avatar"}
                    alt={user.name ?? "User"}
                  />
                  <AvatarFallback>{(user.name || user.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.name || user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="text-xs lg:text-sm">
              <Link href="/login/customer" aria-label="Sign in">
                Sign in
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border flex-shrink-0"
        >
          <span className="sr-only">Toggle menu</span>
          {open ? (
            <X className={cn("h-4 w-4", onHero ? "text-destructive-foreground" : "text-foreground")} />
          ) : (
            <Menu className={cn("h-4 w-4", onHero ? "text-destructive-foreground" : "text-foreground")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={cn(
            "md:hidden border-t",
            onHero ? "bg-destructive text-destructive-foreground border-transparent" : "border-border",
          )}
        >
          <nav className="container mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm font-semibold tracking-wide py-2",
                  onHero
                    ? "text-destructive-foreground/90 hover:text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className={cn(
                "text-sm flex items-center gap-2 py-2",
                onHero
                  ? "text-destructive-foreground/90 hover:text-destructive-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Bell className="h-4 w-4" />
              Notifikasi
            </Link>
            {user ? (
              <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatarUrl || "/placeholder.svg?height=64&width=64&query=user avatar"}
                    alt={user.name ?? "User"}
                  />
                  <AvatarFallback>{(user.name || user.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium leading-none">{user.name || "User"}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </Link>
            ) : (
              <Button className="self-start w-full sm:w-auto" asChild>
                <Link href="/login/customer" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

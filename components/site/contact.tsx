"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function Contact() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [business, setBusiness] = useState<any>(null)

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

  if (!business) return <p>Loading...</p>

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Semua field harus diisi.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulated send
      await new Promise((r) => setTimeout(r, 700))
      setLoading(false)
      toast({ title: "Message sent", description: "We'll get back to you shortly." })
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (error) {
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-stretch break-words">
      {/* ensure both columns align height */}
      <div className="rounded-xl border border-border p-6 md:p-8 h-full overflow-hidden">
        {/* make form column a card and stretch */}
        <h2 className="text-3xl md:text-4xl font-semibold text-pretty">Contact Us</h2>
        <p className="mt-2 text-muted-foreground text-pretty break-words">
          Questions or feedback? We'd love to hear from you.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <Textarea id="message" name="message" required placeholder="How can we help?" className="min-h-28" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-border p-4 break-words">
            <div className="font-medium">Phone</div>
            <div className="text-muted-foreground">+{business?.phone}</div>
          </div>
          <div className="rounded-lg border border-border p-4 break-words">
            <div className="font-medium">Email</div>
            <div className="text-muted-foreground">{business?.email}</div>
          </div>
          <div className="rounded-lg border border-border p-4 break-words">
            <div className="font-medium">Address</div>
            <div className="text-muted-foreground">{business?.address}</div>
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-border h-full">
        {/* stretch map column */}
        {/* Optional Google Maps Embed */}
        <iframe
          title="KebabNation location map"
          src={business?.embed_map}
          className="w-full h-full min-h-[320px]" /* fill card height; responsive min height */
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}

"use client" 

import { NavBar } from "@/components/site/nav-bar"
import { Hero } from "@/components/site/hero"
import { MenuGrid } from "@/components/site/menu-grid"
import { About } from "@/components/site/about"
import { Testimonials } from "@/components/site/testimonials"
import { Contact } from "@/components/site/contact"
import { Footer } from "@/components/site/footer"
import { FloatingCart } from "@/components/site/floating-cart"
import { Instagram, Facebook, Music } from "lucide-react"
import { DiscountClaimButton } from "@/components/site/discount-claim-button"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [pageData, setPageData] = useState(null)

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch("http://localhost:8000/api/pages/discount")
        const json = await res.json()
        setPageData(json.data)
      } catch (err) {
        console.error("Error fetching page: ", err)
      }
    }

    fetchPage()
  }, [])

  if(!pageData) return null

  const discount = pageData.sections.find((s) => s.section_key === "discount")
  return (
    <main id="home" className="min-h-dvh bg-background text-foreground scroll-mt-24">
      <NavBar />
      <Hero />
      <section id="menu" className="container mx-auto px-4 py-16 md:py-24 scroll-mt-24">
        <MenuGrid />
      </section>

      <section id="about" className="scroll-mt-24">
        <About />
      </section>

      <section
        id="ingredients"
        className="w-full bg-destructive text-destructive-foreground overflow-hidden scroll-mt-24"
      >
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="mx-auto max-w-2xl text-center md:text-left">
            <div
              aria-hidden="true"
              className="mb-4 inline-flex h-9 items-center justify-center rounded-full bg-destructive-foreground/15 px-3 text-xs font-semibold tracking-wide"
            >
              Promo Spesial
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-pretty">{discount?.content?.title}</h2>
            <p className="mt-3 text-base md:text-lg/7 text-destructive-foreground/90">
              {discount?.content?.description}
            </p>

            <div
              className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4"
              aria-label="Ikuti kami di sosial media"
            >
              <a
                href="https://instagram.com/kebabnation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram KebabNation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 hover:border-white/40 transition-colors"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com/kebabnation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook KebabNation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 hover:border-white/40 transition-colors"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://tiktok.com/@kebabnation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok KebabNation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 hover:border-white/40 transition-colors"
              >
                <Music className="h-5 w-5" aria-hidden="true" />
              </a>

              <DiscountClaimButton />
            </div>
          </div>
        </div>
      </section>

      <section id="testimony" className="container mx-auto px-4 py-16 md:py-24 scroll-mt-24">
        <Testimonials />
      </section>

      <section id="contact" className="bg-card text-card-foreground scroll-mt-24">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Contact />
        </div>
      </section>

      <Footer />
      <FloatingCart />
    </main>
  )
}

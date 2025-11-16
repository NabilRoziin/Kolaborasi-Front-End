import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useEffect, useState } from "react"

const links = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Our Menu" },
  { href: "#about", label: "About" },
  { href: "#testimony", label: "Testimony" },
  { href: "#contact", label: "Contact" },
]

export function Footer() {
  const [business, setBusiness] = useState(null)

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch("http://localhost:8000/api/business/Sultan Java")
        const json = await res.json()
        setBusiness(json.data)
      } catch (error) {
        console.error("Error fetching business: ", error)
      }
    }

    fetchBusiness()
  }, [])

  if(!business) return <p>Loading...</p>
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 lg:gap-12">
          <div>
            <div className="text-lg md:text-xl font-semibold">{business?.name_company}</div>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">{business?.slogan}</p>
          </div>

          <nav className="grid grid-cols-2 gap-2 md:gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              aria-label="Facebook"
              href="https://facebook.com"
              className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
            >
              <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
            <a
              aria-label="Instagram"
              href="https://instagram.com"
              className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
            >
              <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
            <a
              aria-label="Twitter"
              href="https://x.com"
              className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
            >
              <Twitter className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 md:mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {business?.name_company}. Hak cipta dilindungi undang-undang.
        </div>
      </div>
    </footer>
  )
}

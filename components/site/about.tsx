import { Truck, Utensils, Clock } from "lucide-react"
import { BACKGROUND_IMAGES } from "@/lib/images"

export function About() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping on First Order",
      desc: "Nikmati gratis ongkir untuk pesanan pertama Anda. Cepat, aman, dan sampai tepat waktu.",
    },
    {
      icon: Utensils,
      title: "Variety of Dishes",
      desc: "Pilihan menu lengkap dari kebab klasik hingga signature bowls—semuanya segar dan lezat.",
    },
    {
      icon: Clock,
      title: "Thirty Minutes Delivery",
      desc: "Antar cepat sekitar 30 menit di area layanan—hangat sampai di meja Anda.",
    },
  ]

  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/images/About.png')` }}
      />
      {/* Overlay for readability */}
      <div className="relative bg-black/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Heading and intro copy */}
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <h2 id="about-title" className="text-3xl md:text-4xl font-semibold text-pretty">
              Tentang KebabNation
            </h2>
            <p className="mt-3 leading-relaxed opacity-90">
              KebabNation lahir dari misi sederhana: menyajikan kebab terbaik dengan bahan segar dan bumbu berani. Semua
              diracik in-house—dari marinasi hingga saus—agar setiap gigitan selalu berkesan.
            </p>
          </div>

          {/* Features strip */}
          <div className="mt-10 md:mt-12">
            <div className="rounded-xl bg-primary text-primary-foreground p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-background text-primary flex items-center justify-center shadow-sm ring-1 ring-border">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">{title}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                    <p className="mt-2 leading-relaxed/7 text-primary-foreground/85 max-w-[28ch]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

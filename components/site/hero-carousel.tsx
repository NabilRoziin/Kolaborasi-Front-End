"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function HeroCarousel() {
  const [pageData, setPageData] = useState<any>(null)
  const [carouselItems, setCarouselItems] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

    // 🔹 Fetch data dari API seperti di Hero
    useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch("http://localhost:8000/api/pages/home")
        const json = await res.json()

      // 🔹 Ambil semua section dengan key 'home'
        const homeSections = json.data.sections.filter(
          (s) => s.section_key === "home"
        )

        if (homeSections.length) {
          // map setiap section jadi satu item carousel
          const items = homeSections.map((s) => ({
            ...s.content, // ambil isi JSON content
            file_path: s.file_path ? `${s.file_path}` : null,
          }))
          setCarouselItems(items)
        }

        setPageData(json.data)
      } catch (err) {
        console.error("Error fetching page:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPage()
  }, [])

  // 🔹 Auto play
  useEffect(() => {
    if (!isAutoPlay || carouselItems.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, carouselItems])

  // 🔹 Navigasi manual
  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

  // 🔹 State loading
  if (isLoading) {
    return (
      <section
        id="hero"
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[730px] bg-gray-200 animate-pulse"
      />
    )
  }

  if (carouselItems.length === 0) return null

  // 🔹 Ambil item aktif
  const activeItem = carouselItems[currentIndex]

  return (
    <section id="hero" className="relative overflow-hidden bg-background w-full">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[730px]">
        {/* Gambar Carousel */}
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.file_path || "/placeholder.svg"}
              alt={item.file_path || "carousel image"}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Konten Teks */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16 text-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">
              {(activeItem.title1 || "")}
              <span className="text-primary">{activeItem.title2 || ""}</span>{" "}
              <span className="text-destructive">{activeItem.title3 || ""}</span>
            </h2>
            {activeItem.subtitle && (
              <p className="text-sm md:text-lg text-white/90 max-w-2xl">
                {activeItem.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Tombol Navigasi */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators
        <div className="absolute bottom-9  left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
          {CAROUSEL_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </section>
  )
}

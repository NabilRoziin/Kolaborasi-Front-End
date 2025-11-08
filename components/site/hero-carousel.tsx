"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CAROUSEL_ITEMS } from "./carousel-data"

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAutoPlay || !mounted) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, mounted])

  useEffect(() => {
    if (isAutoPlay || !mounted) return

    const timeout = setTimeout(() => {
      setIsAutoPlay(true)
    }, 8000)

    return () => clearTimeout(timeout)
  }, [isAutoPlay, mounted])

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

  return (
    <section id="hero" className="relative overflow-hidden bg-background w-full" suppressHydrationWarning>
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[730px]">
        {/* Carousel Images */}
        {CAROUSEL_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
              priority={index === 0}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Text Content - Positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white">
          <div className="container mx-auto max-w-10xl px-">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-balance mb-2 sm:mb-3">
              {mounted ? CAROUSEL_ITEMS[currentIndex].title : CAROUSEL_ITEMS[0].title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl line-clamp-2 sm:line-clamp-none">
              {mounted ? CAROUSEL_ITEMS[currentIndex].description : CAROUSEL_ITEMS[0].description}
            </p>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
          {CAROUSEL_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 md:h-3 rounded-full transition-all ${
                mounted && index === currentIndex
                  ? "bg-white w-6 sm:w-8 md:w-10"
                  : "bg-white/50 w-1.5 sm:w-2 md:w-3 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

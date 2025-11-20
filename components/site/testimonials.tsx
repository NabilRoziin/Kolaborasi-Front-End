"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

type Testimonial = {
  id: string
  name: string
  photoAlt: string
  text: string
  reviews?: string
  timeAgo?: string
  highlight?: boolean
  avatarSrc?: string
}

const DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Patricia Robert",
    photoAlt: "Patricia smiling",
    text: "Delicious food and a very nice lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore dolore magna.",
    reviews: "1 Review",
    timeAgo: "a week ago",
    highlight: true,
    avatarSrc: "/customer-portrait.jpg",
  },
  {
    id: "t2",
    name: "Linda Steven",
    photoAlt: "Linda portrait",
    text: "The best burger I have ever had elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation.",
    reviews: "2 Reviews",
    timeAgo: "2 weeks ago",
    avatarSrc: "/customer-portrait.jpg",
  },
  {
    id: "t3",
    name: "David William",
    photoAlt: "David portrait",
    text: "Very fresh food and elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    reviews: "1 Review",
    timeAgo: "3 weeks ago",
    avatarSrc: "/customer-portrait.jpg",
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="rounded-xl h-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={t.avatarSrc || "/placeholder-user.jpg"}
            alt={t.photoAlt}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="font-medium">{t.name}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.reviews}</div>
          </div>
          <div className="text-xs text-muted-foreground">{t.timeAgo}</div>
        </div>
        <Stars />
        <p>{t.text}</p>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  const [ pageData, setpageData ] = useState(null)

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch("http://localhost:8000/api/pages/feedback")
        const json = await res.json()
        setpageData(json.data)
      } catch (error) {
        console.log("Page Not Found: ", error )
      }
    }
    
    fetchPage()
  })

  if (!pageData) return <p>Loading...</p>

  const feedback = pageData.sections.find((s) => s.section_key === "feedback")
  return (
    <section className="relative isolate">
      <div aria-hidden className="absolute inset-y-0 right-[33.333%] hidden md:block w-px bg-border -z-10" />
      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* Left side - Testimonials */}
            <div className="md:col-span-2">
              <div className="relative mb-10 md:mb-12">
                <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">{feedback?.content?.title}</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-pretty">{feedback?.content?.subtitle1}</h2>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-6 right-4 text-[80px] md:text-[120px] font-serif/700 text-muted-foreground/10 select-none"
                >
                  {'"'}
                </span>
              </div>

              <div className="grid md:grid-cols-[1.1fr_1fr] gap-8">
                <article className="space-y-4 border-r border-border pr-0 md:pr-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                      <Image
                        src={DATA[0].avatarSrc || "/placeholder.svg?height=56&width=56&query=customer portrait"}
                        alt={DATA[0].photoAlt}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{DATA[0].name}</div>
                      <div className="text-xs text-muted-foreground">{DATA[0].reviews}</div>
                    </div>
                  </div>
                  <Stars />
                  <div className="text-xs text-muted-foreground">{DATA[0].timeAgo}</div>
                  <p className="text-primary text-xl md:text-2xl font-semibold leading-relaxed">{DATA[0].text}</p>
                </article>

                <div className="space-y-8">
                  {DATA.slice(1).map((t) => (
                    <article key={t.id} className="grid grid-cols-[auto_1fr] gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={t.avatarSrc || "/placeholder.svg?height=48&width=48&query=customer portrait"}
                          alt={t.photoAlt}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{t.name}</div>
                            <div className="text-xs text-muted-foreground">{t.reviews}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{t.timeAgo}</div>
                        </div>
                        <Stars />
                        <p className="text-foreground">{t.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Stars />
                    <span className="text-sm text-muted-foreground">{feedback?.content.subtitle2}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{feedback?.content.subtitle3}</div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:flex items-start justify-center min-h-[700px] lg:min-h-[950px] rounded-xl overflow-hidden border border-border shadow-lg">
              <Image
                src={feedback?.file_path || "/delicious-kebab-food.jpg"} 
                alt="images"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(min-width: 1024px) 25vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

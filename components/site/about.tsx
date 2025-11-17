"use client"
import { Truck, Utensils, Clock } from "lucide-react"
import { BACKGROUND_IMAGES } from "@/lib/images"
import { useEffect, useState } from "react"

export function About() {  
  const [pageData, setPageData] = useState(null)

  useEffect(() =>{
    async function fetchPage() {
      try {
        const res = await fetch("http://localhost:8000/api/pages/about")
        const json = await res.json()
        setPageData(json.data)
      } catch (error) {
        console.error("Error Fetching Page: ", error)
      }
    }

    fetchPage()
  }, [])

  if(!pageData) return null

  const about = pageData.sections.find((s) => s.section_key === "about")
  const features = [
    {
      icon: Truck,
      title: about?.content?.title2,
      desc: about?.content?.description2,
    },
    {
      icon: Utensils,
      title: about?.content?.title3,
      desc: about?.content?.description3,
    },
    {
      icon: Clock,
      title: about?.content?.title4,
      desc: about?.content?.description4,
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
              Tentang {about?.content?.title1}
            </h2>
            <p className="mt-3 leading-relaxed opacity-90">
              {about?.content?.description1}
            </p>
          </div>

          {/* Features strip */}
          <div className="mt-10 md:mt-12">
            <div className="rounded-xl bg-primary text-primary-foreground p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">                
                {features.map(({ icon: Icon,title, desc }) => (
                  <div key={desc} className="flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-background text-primary flex items-center justify-center shadow-sm ring-1 ring-border">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">{about?.content?.title1}</span>
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

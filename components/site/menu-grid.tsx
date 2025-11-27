"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/site/cart-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MENU_IMAGE_MAP } from "./image-map"
import { VariantSelectionDialog } from "./size-selection-dialog"

type MenuItem = {
  id: number
  name: string
  price: number
  description: string
  imageQuery: string
  quantity: number
  category_id: number
}  

function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
export type AddInputItem = {
  id: string
  name: string
  price: number
  url_png?: string | null
}

export function MenuGrid() {
  const { toast } = useToast()
  const { addItem } = useCart()
    type Section = {
    section_key: string
    content: {
      title: string
      description: string
    }
  }

  type PageData = {
    sections: Section[]
  }

  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const [dataMenu, setDataMenu] = useState<MenuItem[]>([])
  const [ pageData, setPageData ] = useState<PageData | null>(null)

  // useEffect(() => {
  //   async function fetchPage() {
  //     try {
  //       const res = await fetch("http://localhost:8000/api/pages/menu")
  //       const json = await res.json()
  //       setPageData(json.data)
  //     } catch (error) {
  //       console.error("Error fetching page: ", error)
  //     }
  //   }

  //   fetchPage()
  // }, [])
  // if(!pageData) return null
  // const menu = pageData.sections.find((s) => s.section_key === "menu")

  useEffect(() => {
    async function fetchMenu() {
      
      try {
        // 1. Ambil semua kategori
        const catRes = await fetch("http://localhost:8000/api/categories")
        const catJson = await catRes.json()
        const categories = catJson.data

        let allProducts: MenuItem[] = []

        // 2. Loop setiap kategori → fetch product kategori tersebut
        for (const cat of categories) {
          const prodRes = await fetch(`http://localhost:8000/api/products/${cat.id}`)
          const prodJson = await prodRes.json()

          const products = prodJson.data.map((p: any) => ({
            id: Number(p.id),
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            imageQuery: p.url_png,
            category_id: p.category_id,
          }))

          // console.log("API categories:", categories)
          // console.log("API products:", products)

          allProducts = [...allProducts, ...products]
        }
        console.log("🎯 Final allProducts:", allProducts)
        // 3. Masukkan ke state
        setDataMenu(allProducts)        

      } catch (error) {
        console.error("Error fetching products: ", error)
      }
    }

    fetchMenu()
  }, [])


  // 🔹 Ambil stok dari API result
  const getStock = (item: MenuItem) => item.quantity ?? 0


  // 🔹 Ketika klik barang
  const handleAddClick = (item: MenuItem) => {
    if (getStock(item) <= 0) {
      toast({
        title: "Stok habis",
        description: `${item.name} sedang tidak tersedia.`,
        variant: "destructive",
      })
      return
    }

    const isFood = item.category_id === 1

    if (isFood) {
      setSelectedItem(item)
      setSizeDialogOpen(true)
    } else {
      addToCart(item)
    }
  }

  // 🔹 Ketika memilih ukuran
  const handleVariantConfirm = (variant: Variant, finalPrice: number) => {
    if (!selectedItem) return

    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: finalPrice,
      imageQuery: selectedItem.imageQuery,
      variant: variant.id.toString(), // simpan ID variant
      variantName: variant.name, // simpan nama variant      
    })

    toast({
      title: "Ditambahkan",
      description: `${selectedItem.name} varian ${variant.name} telah ditambahkan.`,
    })

    setSelectedItem(null)
  }



  // 🔹 Untuk minuman (langsung tambahkan)
  const addToCart = (item: MenuItem) => {
    if (getStock(item) <= 0) {
      toast({
        title: "Stok habis",
        description: `${item.name} sedang tidak tersedia.`,
        variant: "destructive",
      })
      return
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageQuery: item.imageQuery,
      variant: null,
    })

    toast({
      title: "Ditambahkan",
      description: `${item.name} telah ditambahkan ke keranjang.`,
    })
  }


  const renderGrid = (list: MenuItem[]) => (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => {
        const outOfStock = getStock(item) <= 0
        return (
          <Card
            key={item.id}
            className="group overflow-hidden rounded-lg sm:rounded-xl h-full transition-shadow hover:shadow-lg relative flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-card overflow-hidden">
              <Image
                src={item.imageQuery ? `http://localhost:8000/storage/${item.imageQuery}` : "/placeholder.svg?height=400&width=600&query=menu%20item%20image"}
                alt={`${item.name} image`}
                fill
                className={`object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none ${outOfStock ? "opacity-60" : ""}`}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              {outOfStock && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-semibold">Stok Habis</span>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg text-pretty line-clamp-2">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 mt-auto">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-end justify-between gap-2">
                <p className="font-semibold text-sm sm:text-base">{formatIDR(item.price)}</p>
                <Button
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => handleAddClick(item)}
                  className="inline-flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                  disabled={outOfStock}
                  aria-disabled={outOfStock}
                  title={outOfStock ? "Stok habis" : undefined}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Sisa stok: {Math.max(0, getStock(item))}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-pretty"></h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground"></p>
      </div>

      <Tabs defaultValue="foods" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1 w-full">
          <TabsTrigger
            value="foods"
            className="rounded-md text-xs sm:text-sm data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Makanan
          </TabsTrigger>
          <TabsTrigger
            value="drinks"
            className="rounded-md text-xs sm:text-sm data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Minuman
          </TabsTrigger>
        </TabsList>
        <TabsContent value="foods" className="w-full">
          {renderGrid(dataMenu.filter(item => item.category_id === 1))}
        </TabsContent>
        <TabsContent value="drinks" className="w-full">
          {renderGrid(dataMenu.filter(item => item.category_id === 2))}
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <VariantSelectionDialog
          open={sizeDialogOpen}
          onOpenChange={setSizeDialogOpen}
          productId={selectedItem.id}
          itemName={selectedItem.name}
          basePrice={selectedItem.price}
          onConfirm={handleVariantConfirm}
        />
      )}
    </div>
  )
}

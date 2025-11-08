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
import { SizeSelectionDialog } from "./size-selection-dialog"

type MenuItem = {
  id: string
  name: string
  price: number
  description: string
  imageQuery: string
}

const FOODS: MenuItem[] = [
  {
    id: "1",
    name: "Classic Chicken Kebab",
    price: 49000,
    description: "Marinated chicken with fresh veggies and tangy sauce.",
    imageQuery: "classic%20chicken%20kebab%20wrap",
  },
  {
    id: "2",
    name: "Lamb Kofta Kebab",
    price: 59000,
    description: "Juicy lamb, herbs, and spices – a house favorite.",
    imageQuery: "lamb%20kofta%20kebab%20with%20pita",
  },
  {
    id: "3",
    name: "Falafel Wrap",
    price: 39000,
    description: "Crispy falafel, tahini, and crunchy veggies.",
    imageQuery: "falafel%20wrap%20with%20tahini",
  },
  {
    id: "4",
    name: "Mixed Grill Platter",
    price: 89000,
    description: "Chicken, lamb, and veggie skewers with sides.",
    imageQuery: "mixed%20grill%20platter%20kebab",
  },
  {
    id: "5",
    name: "Halloumi Kebab",
    price: 52000,
    description: "Grilled halloumi and vegetables with zesty sauce.",
    imageQuery: "halloumi%20kebab%20skewers",
  },
  {
    id: "6",
    name: "Kebab Bowl",
    price: 65000,
    description: "Your choice of protein over rice with salad.",
    imageQuery: "kebab%20bowl%20with%20rice%20and%20salad",
  },
]

const DRINKS: MenuItem[] = [
  {
    id: "d1",
    name: "Ayran",
    price: 15000,
    description: "Refreshing yogurt-based drink, lightly salted.",
    imageQuery: "ayran%20yogurt%20drink",
  },
  {
    id: "d2",
    name: "Turkish Tea",
    price: 12000,
    description: "Hot black tea served traditional style.",
    imageQuery: "turkish%20tea%20in%20glass",
  },
  {
    id: "d3",
    name: "Pomegranate Juice",
    price: 18000,
    description: "Fresh, tangy, and antioxidant-rich.",
    imageQuery: "pomegranate%20juice%20glass",
  },
  {
    id: "d4",
    name: "Mint Lemonade",
    price: 16000,
    description: "Zesty lemonade infused with fresh mint.",
    imageQuery: "mint%20lemonade%20glass",
  },
  {
    id: "d5",
    name: "Sparkling Water",
    price: 8000,
    description: "Crisp and bubbly refreshment.",
    imageQuery: "sparkling%20water%20bottle",
  },
  {
    id: "d6",
    name: "Bottled Water",
    price: 6000,
    description: "Pure and simple hydration.",
    imageQuery: "bottled%20water%20on%20table",
  },
]

const DEFAULT_STOCK = 10
const STOCK_KEY = "kebabnation_stock"

function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function MenuGrid() {
  const { toast } = useToast()
  const { addItem } = useCart()

  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const [stockMap, setStockMap] = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STOCK_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>
        setStockMap(parsed)
        return
      }
    } catch {
      // ignore storage errors
    }
    const initial: Record<string, number> = {}
    for (const item of [...FOODS, ...DRINKS]) {
      initial[item.id] = DEFAULT_STOCK
    }
    setStockMap(initial)
    try {
      localStorage.setItem(STOCK_KEY, JSON.stringify(initial))
      window.dispatchEvent(new Event("kebabnation:stock-updated"))
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(STOCK_KEY)
        if (raw) {
          setStockMap(JSON.parse(raw) as Record<string, number>)
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener("kebabnation:stock-updated", handler)
    return () => window.removeEventListener("kebabnation:stock-updated", handler)
  }, [])

  const getStock = (id: string) => stockMap[id] ?? 0

  const handleAddClick = (item: MenuItem) => {
    if (getStock(item.id) <= 0) {
      toast({
        title: "Stok habis",
        description: `${item.name} saat ini tidak tersedia.`,
        variant: "destructive",
      })
      return
    }
    const isFood = !item.id.startsWith("d")
    if (isFood) {
      setSelectedItem(item)
      setSizeDialogOpen(true)
    } else {
      addToCart(item)
    }
  }

  const handleSizeConfirm = (size: "small" | "medium" | "large", finalPrice: number) => {
    if (!selectedItem) return
    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: finalPrice,
      imageQuery: selectedItem.imageQuery,
      size,
    })
    const sizeLabel = size === "small" ? "Kecil" : size === "medium" ? "Sedang" : "Besar"
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${selectedItem.name} (${sizeLabel}) telah ditambahkan ke keranjang Anda.`,
    })
    setSelectedItem(null)
  }

  const addToCart = (item: MenuItem) => {
    if (getStock(item.id) <= 0) {
      toast({
        title: "Stok habis",
        description: `${item.name} saat ini tidak tersedia.`,
        variant: "destructive",
      })
      return
    }
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageQuery: item.imageQuery,
    })
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${item.name} telah ditambahkan ke keranjang Anda.`,
    })
  }

  const renderGrid = (list: MenuItem[]) => (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => {
        const outOfStock = getStock(item.id) <= 0
        return (
          <Card
            key={item.id}
            className="group overflow-hidden rounded-lg sm:rounded-xl h-full transition-shadow hover:shadow-lg relative flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-card overflow-hidden">
              <Image
                src={MENU_IMAGE_MAP[item.id] ?? "/placeholder.svg?height=400&width=600&query=menu%20item%20image"}
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
              <p className="text-xs text-muted-foreground">Sisa stok: {Math.max(0, getStock(item.id))}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-pretty">Our Menu</h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Freshly grilled and wrapped to perfection.</p>
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
          {renderGrid(FOODS)}
        </TabsContent>
        <TabsContent value="drinks" className="w-full">
          {renderGrid(DRINKS)}
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <SizeSelectionDialog
          open={sizeDialogOpen}
          onOpenChange={setSizeDialogOpen}
          itemName={selectedItem.name}
          basePrice={selectedItem.price}
          onConfirm={handleSizeConfirm}
        />
      )}
    </div>
  )
}

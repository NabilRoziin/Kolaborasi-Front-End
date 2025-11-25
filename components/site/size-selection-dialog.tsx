"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type Variant = {
  id: number
  name: string
  price: number
}

type VariantDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  itemName: string
  basePrice: number
  onConfirm: (variant: Variant, finalPrice: number) => void  
}

export function VariantSelectionDialog({ 
  open,
  onOpenChange,
  productId,
  itemName,
  basePrice,
  onConfirm,
}: VariantDialogProps) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!open) return

    const fetchVariants = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:8000/api/product-variant/${productId}`)
        const json = await res.json()

        const mapped: Variant[] = json.data.map((v: any) => ({
          id: v.id,
          name: v.name,
          price: v.price,
        }))

        setVariants(mapped)

        if (mapped.length > 0) setSelectedId(mapped[0].id)
      } catch (err) {
        console.error("Failed to fetch variants:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVariants()
  }, [open, productId])

  const handleConfirm = () => {
    const selected = variants.find(v => v.id === selectedId)
    if (!selected) return

    const finalPrice = basePrice + selected.price

    onConfirm(selected, finalPrice)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Ukuran</DialogTitle>
          <DialogDescription>Pilih ukuran untuk {itemName}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat varian...</p>
        ) : (
          <RadioGroup value={selectedId?.toString()} onValueChange={(v) => setSelectedId(Number(v))} className="gap-4">
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center space-x-3">
                <RadioGroupItem value={variant.id.toString()} id={`v-${variant.id}`} />
                <Label
                  htmlFor={`v-${variant.id}`}
                  className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-muted p-4 hover:bg-accent"
                >
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-sm text-muted-foreground">
                    + Rp {variant.price.toLocaleString("id-ID")}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            Tambahkan ke Keranjang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

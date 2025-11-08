"use client"

import { useState } from "react"
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

type Size = "small" | "medium" | "large"

type SizeOption = {
  value: Size
  label: string
  priceMultiplier: number
}

const SIZE_OPTIONS: SizeOption[] = [
  { value: "small", label: "Kecil", priceMultiplier: 0.8 },
  { value: "medium", label: "Sedang", priceMultiplier: 1.0 },
  { value: "large", label: "Besar", priceMultiplier: 1.3 },
]

type SizeSelectionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  basePrice: number
  onConfirm: (size: Size, finalPrice: number) => void
}

export function SizeSelectionDialog({ open, onOpenChange, itemName, basePrice, onConfirm }: SizeSelectionDialogProps) {
  const [selectedSize, setSelectedSize] = useState<Size>("medium")

  const handleConfirm = () => {
    const sizeOption = SIZE_OPTIONS.find((opt) => opt.value === selectedSize)
    const finalPrice = basePrice * (sizeOption?.priceMultiplier || 1.0)
    onConfirm(selectedSize, finalPrice)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Ukuran</DialogTitle>
          <DialogDescription>Pilih ukuran untuk {itemName}</DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedSize} onValueChange={(value) => setSelectedSize(value as Size)} className="gap-4">
          {SIZE_OPTIONS.map((option) => {
            const price = basePrice * option.priceMultiplier
            return (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-muted p-4 hover:bg-accent"
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-muted-foreground">Rp {price.toLocaleString("id-ID")}</span>
                </Label>
              </div>
            )
          })}
        </RadioGroup>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleConfirm}>Tambahkan ke Keranjang</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CartItem = {
  id: number
  name: string
  price: number
  imageQuery: string
  quantity: number
  size?: "small" | "medium" | "large"
}

type AddItemInput = {
  id: number
  name: string
  price: number
  imageQuery: string
  size?: "small" | "medium" | "large"
}

type CartContextValue = {
  items: CartItem[]
  addItem: (input: AddItemInput) => void
  decrementItem: (id: number, size?: "small" | "medium" | "large") => void
  removeItem: (id: number, size?: "small" | "medium" | "large") => void
  clear: () => void
  totalQuantity: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// =========================
// LOCAL STORAGE STOCK
// =========================

const STOCK_KEY = "kebabnation_stock"

function readStock(): Record<number, number> {
  try {
    const raw = localStorage.getItem(STOCK_KEY)
    return raw ? (JSON.parse(raw) as Record<number, number>) : {}
  } catch {
    return {}
  }
}

function writeStock(map: Record<number, number>) {
  try {
    localStorage.setItem(STOCK_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event("kebabnation:stock-updated"))
  } catch {}
}

function updateStock(id: number, delta: number) {
  const map = readStock()
  const nextQty = Math.max(0, (map[id] ?? 0) + delta)
  writeStock({ ...map, [id]: nextQty })
}

// =========================
// PROVIDER
// =========================

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // load cart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kebabnation_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // save to storage
  useEffect(() => {
    try {
      localStorage.setItem("kebabnation_cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const addItem = (input: AddItemInput) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === input.id && i.size === input.size)
        if (idx >= 0) {
          const next = [...prev]
          next[idx].quantity += 1
          return next
        }
        return [...prev, { ...input, quantity: 1 }]
      })

      updateStock(input.id, -1)
    }

    const decrementItem = (id: number, size?: "small" | "medium" | "large") => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0)
      )
      updateStock(id, +1)
    }

    const removeItem = (id: number, size?: "small" | "medium" | "large") => {
      const existing = items.find((i) => i.id === id && i.size === size)
      const removedQty = existing?.quantity ?? 0

      setItems((prev) =>
        prev.filter((i) => !(i.id === id && i.size === size))
      )

      if (removedQty > 0) updateStock(id, removedQty)
    }

    const clear = () => {
      const snapshot = [...items]
      setItems([])
      for (const it of snapshot) updateStock(it.id, it.quantity)
    }

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return {
      items,
      addItem,
      decrementItem,
      removeItem,
      clear,
      totalQuantity,
      totalPrice,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

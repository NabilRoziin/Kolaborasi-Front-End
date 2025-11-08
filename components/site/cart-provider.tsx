"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CartItem = {
  id: string
  name: string
  price: number // numeric price for math
  imageQuery: string
  quantity: number
  size?: "small" | "medium" | "large" // Optional: only for food items
}

type AddItemInput = {
  id: string
  name: string
  price: number
  imageQuery: string
  size?: "small" | "medium" | "large"
}

type CartContextValue = {
  items: CartItem[]
  addItem: (input: AddItemInput) => void
  decrementItem: (id: string, size?: "small" | "medium" | "large") => void
  removeItem: (id: string, size?: "small" | "medium" | "large") => void
  clear: () => void
  totalQuantity: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STOCK_KEY = "kebabnation_stock"
function readStock(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STOCK_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}
function writeStock(map: Record<string, number>) {
  try {
    localStorage.setItem(STOCK_KEY, JSON.stringify(map))
    // notify listeners within this tab
    window.dispatchEvent(new Event("kebabnation:stock-updated"))
  } catch {
    // ignore storage errors
  }
}
function updateStock(id: string, delta: number) {
  const map = readStock()
  const nextQty = Math.max(0, (map[id] ?? 0) + delta)
  writeStock({ ...map, [id]: nextQty })
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kebabnation_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore storage errors
    }
  }, [])

  // Persist to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem("kebabnation_cart", JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const addItem = (input: AddItemInput) => {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === input.id && i.size === input.size)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
          return next
        }
        return [...prev, { ...input, quantity: 1 }]
      })
      updateStock(input.id, -1)
    }

    const decrementItem = (id: string, size?: "small" | "medium" | "large") => {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id && i.size === size ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      )
      updateStock(id, +1)
    }

    const removeItem = (id: string, size?: "small" | "medium" | "large") => {
      const existing = items.find((i) => i.id === id && i.size === size)
      const removedQty = existing?.quantity ?? 0
      setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
      if (removedQty > 0) {
        updateStock(id, removedQty)
      }
    }

    const clear = () => {
      const snapshot = [...items]
      setItems([])
      for (const it of snapshot) {
        updateStock(it.id, it.quantity)
      }
    }

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return { items, addItem, decrementItem, removeItem, clear, totalQuantity, totalPrice }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

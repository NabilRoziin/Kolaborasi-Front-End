"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CartItem = {
  id: number | string
  name: string
  price: number
  imageQuery: string
  quantity: number
  variant?: string
  variantName?: string
}

type AddItemInput = {
  id: number | string
  name: string
  price: number
  imageQuery: string
  variant?: string | null
  variantName?: string 
}

type CartContextValue = {
  items: CartItem[]
  addItem: (input: AddItemInput) => void
  decrementItem: (id: number | string, variant?: string | null) => void
  removeItem: (id: number | string, variant?: string | null) => void
  clear: () => void
  totalQuantity: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

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
      setItems((prevItems) => {
        // Cari item yang sama (dengan variant yang sama juga)
        const existingIndex = prevItems.findIndex(
          item => item.id === input.id && item.variant === input.variant
        )
      
        if (existingIndex >= 0) {
          // Jika item sudah ada, tambah quantitynya saja
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + 1
          }
          return updatedItems
        } else {
          // Jika item baru, tambahkan dengan quantity 1
          return [...prevItems, { 
            ...input, 
            quantity: 1 
          }]
        }
      })
    }

    const decrementItem = (id: number | string, variant?: string | null) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.id === id && i.variant === variant
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0)
      )
    }

    const removeItem = (id: number | string, variant?: string | null) => {
      setItems((prev) =>
        prev.filter((i) => !(i.id === id && i.variant === variant))
      )
    }

    const clear = () => {
      setItems([])
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
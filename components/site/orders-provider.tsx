"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Order = {
  id: string
  customerInfo: {
    fullName: string
    phone: string
    address: string
    notes: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    imageQuery: string
  }>
  pricing: {
    subtotal: number
    discount: number
    shippingFee: number
    total: number
  }
  paymentMethod: string
  status: string
  orderDate: string
}

type OrdersContextValue = {
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => string
  getOrder: (id: string) => Order | undefined
  getCurrentOrder: () => Order | null
  updateOrderStatus: (id: string, status: string) => void
  cancelOrder: (id: string) => void
  dismissed: string[]
  dismissNotification: (id: string) => void
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kebabnation_orders")
      if (raw) {
        const parsedOrders = JSON.parse(raw)
        setOrders(Array.isArray(parsedOrders) ? parsedOrders : [])
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kebabnation_dismissed")
      if (raw) {
        const parsed = JSON.parse(raw)
        setDismissed(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("kebabnation_orders", JSON.stringify(orders))
    } catch {
      // ignore storage errors
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem("kebabnation_dismissed", JSON.stringify(dismissed))
    } catch {
      // ignore storage errors
    }
  }, [dismissed])

  const value = useMemo<OrdersContextValue>(() => {
    const addOrder = (orderData: Omit<Order, "id">): string => {
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newOrder: Order = {
        ...orderData,
        id: orderId,
      }

      setOrders((prev) => [newOrder, ...prev])

      // Also store as current order for notification page
      localStorage.setItem("currentOrder", JSON.stringify(newOrder))

      return orderId
    }

    const getOrder = (id: string): Order | undefined => {
      return orders.find((order) => order.id === id)
    }

    const getCurrentOrder = (): Order | null => {
      try {
        const raw = localStorage.getItem("currentOrder")
        if (raw) return JSON.parse(raw)
      } catch {
        // ignore storage errors
      }
      return null
    }

    const updateOrderStatus = (id: string, status: string) => {
      setOrders((prev) => {
        const next = prev.map((o) => (o.id === id ? { ...o, status } : o))
        try {
          localStorage.setItem("kebabnation_orders", JSON.stringify(next))
        } catch {}
        return next
      })

      // sync currentOrder if matches
      try {
        const raw = localStorage.getItem("currentOrder")
        if (raw) {
          const curr: Order = JSON.parse(raw)
          if (curr.id === id) {
            localStorage.setItem("currentOrder", JSON.stringify({ ...curr, status }))
          }
        }
      } catch {}
    }

    const cancelOrder = (id: string) => updateOrderStatus(id, "Dibatalkan")

    const dismissNotification = (id: string) => {
      setDismissed((prev) => (prev.includes(id) ? prev : [...prev, id]))
    }

    return {
      orders,
      addOrder,
      getOrder,
      getCurrentOrder,
      updateOrderStatus,
      cancelOrder,
      dismissed,
      dismissNotification,
    }
  }, [orders, dismissed])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}

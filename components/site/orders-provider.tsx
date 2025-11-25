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
    variantName?: string
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
  refresh: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const local = localStorage.getItem("kebabnation_orders")
      return local ? JSON.parse(local) : []
    } catch {
      return []
    }
  })
  const [dismissed, setDismissed] = useState<string[]>([])  

  function mapBackendOrder(o: any): Order {
    console.log("DATA DARI BACKEND:", o)
    
    // Hitung subtotal dari products dengan final_price
    const subtotal = o.products?.reduce((sum: number, p: any) => {
      const itemPrice = p.pivot?.final_price || p.price;
      return sum + (itemPrice * (p.pivot?.quantity || 1));
    }, 0) || 0;

    // Ambil shippingFee dari details atau default
    const shippingFee = o.details?.pricing?.shippingFee || 5000;

    return {
      id: String(o.id),
      customerInfo: {
        fullName: o.details?.customerInfo?.fullName || "",
        phone: o.details?.customerInfo?.phone || "",
        address: o.details?.customerInfo?.address || "", 
        notes: o.details?.customerInfo?.notes || "",
      },
      items: o.products?.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        price: p.pivot?.final_price || p.price,
        quantity: p.pivot?.quantity || 1,
        imageQuery: p.url_png || "",
        variantName: p.pivot?.variant_name || undefined,
      })) || [],
      pricing: {
        subtotal: subtotal,
        discount: o.details?.pricing?.discount || 0,
        shippingFee: shippingFee,
        total: o.total_price || subtotal + shippingFee,
      },
      paymentMethod: o.details?.paymentMethod || "",
      status: o.status,
      orderDate: o.created_at,
    }
  }

  useEffect(() => {
    async function loadFromBackend() {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No token found, skipping orders fetch")
      return
    }

    const res = await fetch(`http://localhost:8000/api/orders/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.warn("API fetch failed, using localStorage data")
      return
    }

        const data = await res.json()
        if (!data.orders) return

        console.log("DATA API:", data)
        const mapped = (data.orders ?? []).map(mapBackendOrder)
        setOrders(mapped)
        localStorage.setItem("kebabnation_orders", JSON.stringify(mapped))
      } catch (err) {
        console.error("Gagal fetch orders, using localStorage:", err)
      }
    }

    loadFromBackend()
  }, [])

  async function refresh() {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/me`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }, 
      })

      if (!res.ok) {
        console.warn("Refresh failed, keeping existing data")
        return
      }

      const data = await res.json()
      const mapped = data.orders.map(mapBackendOrder)

      setOrders(mapped)
      localStorage.setItem("kebabnation_orders", JSON.stringify(mapped))
    } catch (err) {
      console.error("Refresh error:", err)
    }
  }

  // dismissed load
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kebabnation_dismissed")
      if (raw) {
        const parsed = JSON.parse(raw)
        setDismissed(Array.isArray(parsed) ? parsed : [])
      }
    } catch {}
  }, [])

  // autosave orders
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("kebabnation_orders", JSON.stringify(orders))
    }
  }, [orders])

  // autosave dismissed
  useEffect(() => {
    try {
      localStorage.setItem("kebabnation_dismissed", JSON.stringify(dismissed))
    } catch {}
  }, [dismissed])

  // -------------------------
  // FUNGSI2 YANG BENAR
  // -------------------------

  const addOrder = (order: Omit<Order, "id">): string => {
    const newOrder: Order = {
      id: String(Date.now()), // generate ID sederhana
      customerInfo: order.customerInfo ?? {
        fullName: "",
        phone: "",
        address: "",
        notes: ""
      },
      items: order.items ?? [],
      pricing: {
        subtotal: order.pricing?.subtotal ?? 0,
        discount: order.pricing?.discount ?? 0,
        shippingFee: order.pricing?.shippingFee ?? 0,
        total: order.pricing?.total ?? 0,
      },
      paymentMethod: order.paymentMethod ?? "",
      status: order.status ?? "pending",
      orderDate: order.orderDate ?? new Date().toISOString(),
    }

    setOrders((prev) => { 
      const updated = [newOrder, ...prev]
      localStorage.setItem("kebabnation_orders", JSON.stringify(updated))
      return updated
    })

    localStorage.setItem("currentOrder", JSON.stringify(newOrder))
    refresh()

    return newOrder.id
  }

  const getOrder = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id)
  }

  const getCurrentOrder = (): Order | null => {
    try {
      const raw = localStorage.getItem("currentOrder")
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const updateOrderStatus = (id: string, status: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, status } : o))
      localStorage.setItem("kebabnation_orders", JSON.stringify(updated))
      return updated
    })

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

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      refresh,
      getOrder,
      getCurrentOrder,
      updateOrderStatus,
      cancelOrder,
      dismissed,
      dismissNotification,
    }),
    [orders, dismissed]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}

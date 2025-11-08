"use client"

import { RoleGuard } from "@/components/site/role-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { LayoutDashboard, Package, Users, Settings } from "lucide-react"

export default function AdminPage() {
  const { user, signOut } = useAuth()

  return (
    <RoleGuard allowedRoles={["staff"]}>
      <main className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">KebabNation Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
              <Button variant="outline" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-muted-foreground">Welcome to the staff admin panel</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-sm text-muted-foreground">Manage customer orders</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Customers</h3>
                  <p className="text-sm text-muted-foreground">View customer data</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure system</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-6">
            <h3 className="mb-2 font-semibold">Access Restrictions</h3>
            <p className="text-sm text-muted-foreground">
              As a staff member, you have access to this admin panel but cannot access customer features like checkout
              or social media links.
            </p>
          </Card>
        </div>
      </main>
    </RoleGuard>
  )
}

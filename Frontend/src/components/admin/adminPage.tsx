"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersSection } from "@/components/admin/users-section";
import { OrdersSection } from "@/components/admin/orders-section";
import { ProductsSection } from "@/components/admin/products-section";
import { Package, ShoppingCart, Users } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");



  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, orders, and products
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted p-1">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
          </TabsList>

          <div className="transition-opacity duration-300">
            <TabsContent
              value="users"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <UsersSection />
            </TabsContent>

            <TabsContent
              value="orders"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <OrdersSection />
            </TabsContent>

            <TabsContent
              value="products"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <ProductsSection />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

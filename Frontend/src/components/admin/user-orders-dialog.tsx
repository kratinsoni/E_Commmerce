"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface OrderItem {
  product: { name: string; _id: string };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  orderPrice: number;
  orderItems: OrderItem[];
  address: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

// Mock orders data
const mockOrders: Record<string, Order[]> = {
  "1": [
    {
      _id: "o1",
      orderPrice: 150,
      orderItems: [
        {
          product: { _id: "p1", name: "Wireless Headphones" },
          quantity: 1,
          priceAtPurchase: 100,
        },
        {
          product: { _id: "p2", name: "Phone Case" },
          quantity: 2,
          priceAtPurchase: 25,
        },
      ],
      address: "123 Main St, City",
      status: "DELIVERED",
      createdAt: "2024-02-01",
    },
    {
      _id: "o2",
      orderPrice: 200,
      orderItems: [
        {
          product: { _id: "p3", name: "Smart Watch" },
          quantity: 1,
          priceAtPurchase: 200,
        },
      ],
      address: "123 Main St, City",
      status: "PENDING",
      createdAt: "2024-02-10",
    },
  ],
  "3": [
    {
      _id: "o3",
      orderPrice: 75,
      orderItems: [
        {
          product: { _id: "p4", name: "USB Cable Pack" },
          quantity: 3,
          priceAtPurchase: 25,
        },
      ],
      address: "456 Oak Ave, Town",
      status: "CANCELLED",
      createdAt: "2024-01-20",
    },
  ],
};

interface UserOrdersDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function UserOrdersDialog({
  user,
  isOpen,
  onClose,
}: UserOrdersDialogProps) {
  const [orders, setOrders] = useState<Order[]>(user ? mockOrders[user._id] || [] : []);
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getUserOrders = async (userId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/user/${userId}`, {
        withCredentials: true,
      });
      console.log("User orders fetched:", response.data);
      setOrders(response.data.data);
      toast.success("User orders fetched successfully!");
    } catch (error) {
      console.log("Error fetching user orders:", error);
      toast.error("Failed to fetch user orders. Please try again.");
    }
  }

  useEffect(() => {
    if (user) {
      getUserOrders(user._id);
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders for {user?.name}
          </DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders found for this user</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      Order #{order._id}
                    </span>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order?.orderItems?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>
                          {item?.product?.name} × {item?.quantity}
                        </span>
                        <span className="text-muted-foreground">
                          ${item?.priceAtPurchase * item?.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {order?.address}
                    </span>
                    <span className="font-semibold">${order?.orderPrice}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

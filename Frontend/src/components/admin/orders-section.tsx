"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface OrderItem {
  product: { name: string; _id: string };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  orderPrice: number;
  customer: { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  address: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    _id: "o1",
    orderPrice: 150,
    customer: { _id: "1", name: "john_doe", email: "john@example.com" },
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
    status: "PENDING",
    createdAt: "2024-02-10",
  },
  {
    _id: "o2",
    orderPrice: 200,
    customer: { _id: "1", name: "john_doe", email: "john@example.com" },
    orderItems: [
      {
        product: { _id: "p3", name: "Smart Watch" },
        quantity: 1,
        priceAtPurchase: 200,
      },
    ],
    address: "123 Main St, City",
    status: "DELIVERED",
    createdAt: "2024-02-01",
  },
  {
    _id: "o3",
    orderPrice: 75,
    customer: { _id: "3", name: "bob_wilson", email: "bob@example.com" },
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
  {
    _id: "o4",
    orderPrice: 350,
    customer: { _id: "4", name: "alice_jones", email: "alice@example.com" },
    orderItems: [
      {
        product: { _id: "p5", name: "Bluetooth Speaker" },
        quantity: 1,
        priceAtPurchase: 350,
      },
    ],
    address: "789 Pine Rd, Village",
    status: "PENDING",
    createdAt: "2024-02-12",
  },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: "", address: "" });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({ status: order.status, address: order.address });
    setIsEditDialogOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    try {
      const response = await axios.patch(`${BASE_URL}/orders/update/${selectedOrder._id}`, {
        status: editForm.status,
        address: editForm.address,
      }, { withCredentials: true } );
      console.log("Order updated:", response.data); 
      toast.success("Order updated successfully!");
      getAllOrders();
    } catch (error) {
      console.log("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
      return;
    }
    setIsEditDialogOpen(false);
    setSelectedOrder(null);
  };

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

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/all`, {
        withCredentials: true,
      });
      console.log("Orders fetched:", response.data);
      setOrders(response.data.data);
      toast.success("Orders fetched successfully!");
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };
  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <>
      <Card className="border-border shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Orders</CardTitle>
              <CardDescription>
                View and manage all customer orders
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48 transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36 transition-all duration-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="transition-colors duration-150 hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      {order._id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.orderItems.length} item(s)
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.orderPrice}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(order.status)} border`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                        className="transition-all duration-150 hover:bg-accent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update the order status and shipping address
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium">Order #{selectedOrder._id}</p>
                <p className="text-muted-foreground">
                  Customer: {selectedOrder.customer.name}
                </p>
                <p className="text-muted-foreground">
                  Total: ${selectedOrder.orderPrice}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveOrder}
              className="transition-all duration-150"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

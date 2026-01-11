import { OrderedProductCard } from "@/components/ProductCard/OrderedProductCard";
import {
  User,
  Mail,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  X,
  Ban,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper to determine status badge colors
function getStatusColor(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-sage/15 text-sage";
    case "IN_TRANSIT":
      return "bg-amber-100 text-amber-700";
    case "PENDING":
    case "PROCESSING":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

interface User {
  name: string;
  email: string;
}

interface productInfo {
  name: string;
  description: string;
  price: number;
  stock: number;
  productImage: string;
}

interface OrderItem {
  product: productInfo;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  orderPrice: number;
  customer: string;
  orderItems: OrderItem[];
  address: string;
  status: "PENDING" | "CANCELLED" | "DELIVERED" | "PROCESSING" | "IN_TRANSIT";
  createdAt: string;
  updatedAt: string;
}

// --- Simple Confirmation Modal Component ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isProcessing: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 text-amber-600">
          <div className="p-3 bg-amber-100 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal">{title}</h3>
        </div>

        <p className="text-muted-foreground leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg text-charcoal hover:bg-secondary transition-colors font-medium disabled:opacity-50"
          >
            No, Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Cancelling..." : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // State for managing the cancellation modal
  const [selectedOrderToCancel, setSelectedOrderToCancel] =
    useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        withCredentials: true,
      });
      setUser({
        name: response.data.data.name,
        email: response.data.data.email,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load profile info.");
    }
  };

  const getUserOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/`, {
        withCredentials: true,
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  // --- Cancel Order Logic ---
  const handleCancelOrder = async (id: string) => {
    if (!selectedOrderToCancel) return;

    setIsCancelling(true);
    try {
      // Assuming your API accepts a PATCH request to update status
      // Adjust the endpoint URL or method (POST/PUT) based on your backend requirements
      const response = await axios.patch(
        `${BASE_URL}/orders/update/${id}`,
        { status: "CANCELLED" },
        { withCredentials: true }
      );
      console.log("Order cancelled:", response.data);
      toast.success("Order cancelled successfully");

      getUserOrders();
      // Close modal
      setSelectedOrderToCancel(null);
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to cancel order. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserOrders();
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedOrderToCancel}
        onClose={() => setSelectedOrderToCancel(null)}
        onConfirm={() => handleCancelOrder(selectedOrderToCancel?._id || "")}
        isProcessing={isCancelling}
        title="Cancel Order?"
        message={`Are you sure you want to cancel Order #${selectedOrderToCancel?._id.slice(
          -6
        )}? This action cannot be undone.`}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* User Details Section */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-charcoal mb-6">
              My Account
            </h1>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-sage">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-sage" />
                  <span className="text-lg font-medium text-charcoal">
                    {user?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-sage" />
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Orders Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-sage" />
              <h2 className="text-2xl font-bold text-charcoal">My Orders</h2>
            </div>

            <div className="space-y-6">
              {orders?.map((order, orderIndex) => (
                <div
                  key={order._id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${orderIndex * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-border bg-secondary/30">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {/* Cancel Button - Only visible if order is Pending or Processing */}
                      {(order.status === "PENDING" ||
                        order.status === "PROCESSING") && (
                        <button
                          onClick={() => setSelectedOrderToCancel(order)}
                          className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors border border-red-200 font-medium flex items-center gap-1"
                          title="Cancel this order"
                        >
                          <Ban className="w-3 h-3" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {order.orderItems.map((item, itemIndex) => (
                      <OrderedProductCard
                        key={itemIndex}
                        name={item?.product?.name}
                        description={item?.product?.description}
                        image={item?.product?.productImage}
                        quantity={item?.quantity}
                      />
                    ))}
                  </div>

                  {/* Footer Total */}
                  <div className="px-4 sm:px-6 py-3 bg-secondary/10 border-t border-border flex justify-end">
                    <p className="text-charcoal font-medium">
                      Total: ₹{order.orderPrice}
                    </p>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
                  No orders found.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

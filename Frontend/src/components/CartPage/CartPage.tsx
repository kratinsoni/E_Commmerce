"use client";

import { useEffect, useState } from "react";
import { CartItemCard } from "@/components/ProductCard/CartItemCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ---------------- TYPES ----------------

interface Item {
  _id: string;
  name: string;
  price: number;
  stock: number;
  productImage?: string;
  description?: string;
}

interface CartItem {
  _id: string;
  quantity: number;
  item: Item;
}

// ---------------- COMPONENT ----------------

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [address, setAddress] = useState("IIT KGP");

  // -------- CART ACTIONS --------

  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/users/cart/change-quantity/${id}`,
        { quantity },
        { withCredentials: true }
      );
      console.log("Update quantity response:", response.data);
      toast.success("Quantity updated!");
      getAllCartItems();
    } catch (error) {
      console.log("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/users/cart/remove/${id}`,
        { withCredentials: true }
      );
      console.log("Remove from cart response:", response.data);
      toast.success("Item removed from cart!");
      getAllCartItems();
    } catch (error) {
      console.log("Error removing from cart:", error);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address!");
      return;
    }

    setIsOrdering(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/orders/`,
        {
          address
        },
        { withCredentials: true }
      );

      console.log("Order placed:", response.data);
      toast.success("Order placed successfully!");
      setCartItems([]); // clear cart locally after order
      setAddress("");
    } catch (error) {
      console.log("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  // -------- FETCH CART --------

  const getAllCartItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/cart/items`, {
        withCredentials: true,
      });
      setCartItems(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch cart items");
    }
  };

  useEffect(() => {
    getAllCartItems();
  }, []);

  // -------- CALCULATIONS --------

  const subtotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 8.99 : 0;
  const total = subtotal + shipping;

  // ---------------- JSX ----------------

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-sage" />
            <h1 className="text-3xl font-bold">Your Cart</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {cartItems.length > 0
              ? `You have ${cartItems.reduce(
                  (s, i) => s + i.quantity,
                  0
                )} item(s)`
              : "Your cart is empty"}
          </p>
        </div>

        {/* CART CONTENT */}
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item._id}
                  {...item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-card border rounded-xl p-6 h-fit space-y-4">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* ADDRESS INPUT */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Delivery Address
                </label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm resize-none"
                  rows={3}
                  placeholder="Enter your address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={handlePlaceOrder}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // EMPTY STATE
          <div className="flex flex-col items-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <Link to="/products" className="mt-4">
              <Button>
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { Link } from "react-router-dom";
import { Home, ShoppingCart, LogOut, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface User {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export function Header() {

  const [user, setUser] = useState<User | null>(null);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        withCredentials: true,
      });
      console.log("User details fetched:", response.data);
      setUser({
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
      });
      toast.success("User details fetched successfully!");
      // You can set the user data to state here if needed
    } catch (error) {
      console.log("Error fetching user details:", error);
      toast.error("Failed to fetch user details. Please try again.");
    }
  };

  const onLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Logout successful:", response.data);
      toast.success("Logout successful!");
      window.location.reload();
    } catch (error) {
      console.log("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <header className="fixed z-50 w-full bg-card border-b border-border animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <span className="text-lg font-bold text-primary-foreground">
                E
              </span>
            </div>
            <span className="text-lg font-semibold text-charcoal hidden sm:block">
              E-COMMERCE
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {user?.role === "ADMIN" && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  className="h-10 px-3 sm:px-4 rounded-xl text-charcoal hover:bg-secondary/80 hover:text-sage transition-all duration-200 group"
                >
                  <Home className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button
                variant="ghost"
                className="h-10 px-3 sm:px-4 rounded-xl text-charcoal hover:bg-secondary/80 hover:text-sage transition-all duration-200 group"
              >
                <Home className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>

            <Link to="/products">
              <Button
                variant="ghost"
                className="h-10 px-3 sm:px-4 rounded-xl text-charcoal hover:bg-secondary/80 hover:text-sage transition-all duration-200 group"
              >
                <Zap className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Products</span>
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                variant="ghost"
                className="h-10 px-3 sm:px-4 rounded-xl text-charcoal hover:bg-secondary/80 hover:text-sage transition-all duration-200 group relative"
              >
                <ShoppingCart className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Cart</span>
                {/* Cart badge */}
              </Button>
            </Link>

            <div className="w-px h-6 bg-border mx-1 sm:mx-2" />

            <Button
              variant="ghost"
              className="h-10 px-3 sm:px-4 rounded-xl text-charcoal hover:bg-blush/20 hover:text-destructive transition-all duration-200 group hover:cursor-pointer"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 sm:mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

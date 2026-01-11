"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface productInfo {
  _id: string;
  description: string;
  name: string;
  productImage: string;
  price: number;
  stock: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsData, setProductsData] = useState<productInfo[]>([]);

  const filteredProducts = productsData?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = async (id: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/cart/add/${id}`,
        {
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Add to cart response:", response.data);
      toast.success("Product added to cart!");
    } catch (error) {
      console.log("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const handleBuyNow = async (id: string, address: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/orders/buy-now/${id}`,
        {
          quantity: 1,
          address,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Buy Now response:", response.data);
      toast.success("Buy Now successful!");
    } catch (error) {
      console.log("Error in Buy Now:", error);
      toast.error("Failed to process Buy Now. Please try again.");
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/`, {
        withCredentials: true,
      });
      console.log("Products fetched:", response.data);
      toast.success("Products fetched successfully!");
      setProductsData(response.data.data);
      // You can set the products data to state here if needed
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="space-y-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold text-charcoal">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our curated collection of handcrafted artisan goods
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 rounded-xl border-border bg-card focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 px-5 rounded-xl border-border text-charcoal hover:bg-secondary hover:text-sage transition-all duration-200 bg-transparent"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${150 + index * 50}ms` }}
            >
              <ProductCard
                {...product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-in fade-in duration-300">
            <p className="text-muted-foreground text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

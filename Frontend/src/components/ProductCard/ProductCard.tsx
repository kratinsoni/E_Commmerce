"use client";

import { ShoppingCart, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProductCardProps {
  _id: string;
  description: string;
  name: string;
  productImage: string;
  price: number;
  stock: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
  onAddToCart?: (id: string) => void;
  onBuyNow?: (id: string, address: string) => void;
}

function trimDescription(description: string, maxLength = 80): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

export function ProductCard({
  _id,
  name,
  description,
  productImage,
  price,
  stock,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const [address, setAddress] = useState("");
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-sage/10 hover:-translate-y-1 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden">
        <img
          src={productImage || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
            <span className="bg-card text-charcoal text-sm font-medium px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-charcoal text-lg leading-tight line-clamp-1 group-hover:text-sage transition-colors duration-200">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {trimDescription(description)}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-xl font-bold text-charcoal">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Package
              className={`w-4 h-4 ${
                isLowStock ? "text-amber-500" : "text-sage"
              }`}
            />
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                isOutOfStock
                  ? "text-destructive"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-muted-foreground"
              }`}
            >
              {isOutOfStock ? "Sold out" : `${stock} left`}
            </span>
          </div>
        </div>

        {/* Address Input */}
        <Input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-sage/20 focus:border-sage"
          disabled={isOutOfStock}
        />

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 h-10 px-2 text-xs sm:text-sm rounded-xl border-border text-charcoal hover:bg-secondary hover:text-sage transition-all duration-200 bg-transparent whitespace-nowrap"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(_id)}
          >
            <ShoppingCart className="w-4 h-4 mr-2 shrink-0" />
            Add to Cart
          </Button>
          <Button
            className="flex-1 h-10 px-2 text-xs sm:text-sm rounded-xl bg-sage text-primary-foreground hover:bg-sage/90 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
            disabled={isOutOfStock || !address.trim()}
            onClick={() => onBuyNow?.(_id, address)}
          >
            <Zap className="w-4 h-4 mr-2 shrink-0" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

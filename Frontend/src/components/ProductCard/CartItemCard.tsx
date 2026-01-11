"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------- TYPES ----------------

interface Item {
  _id: string;
  name: string;
  price: number;
  stock: number;
  productImage?: string;
  description?: string;
}

interface CartItemCardProps {
  _id: string;
  quantity: number;
  item: Item;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

// ---------------- COMPONENT ----------------

export function CartItemCard({
  _id,
  quantity,
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  console.log(_id)
  return (
    <div className="flex gap-4 bg-card rounded-xl border p-4">
      {/* productImage */}
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary/50">
        <img
          src={item.productImage || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1">
        <h4 className="font-semibold truncate">{item.name}</h4>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {item.description.slice(0, 60)}...
          </p>
        )}
        <p className="text-lg font-bold text-sage mt-2">
          ${item.price.toFixed(2)}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col justify-between items-end">
        <Button variant="ghost" size="icon" onClick={() => onRemove(item._id)}>
          <Trash2 className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={() => onQuantityChange(item._id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="w-6 text-center">{quantity}</span>

          <Button
            size="icon"
            onClick={() => onQuantityChange(item._id, quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

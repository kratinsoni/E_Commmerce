"use client"

import { Package } from "lucide-react"

interface OrderedProductCardProps {
  name: string
  description: string
  image: string
  quantity: number
}

function trimDescription(description: string, maxLength = 60): string {
  if (description.length <= maxLength) return description
  return description.slice(0, maxLength).trim() + "..."
}

export function OrderedProductCard({ name, description, image, quantity }: OrderedProductCardProps) {
  return (
    <div className="flex gap-4 bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:shadow-md hover:border-sage/30">
      {/* Product Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary/50">
        <img src={image || "/placeholder.svg"} alt={name} className="object-cover w-full h-full" />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h4 className="font-semibold text-charcoal text-base leading-tight truncate">{name}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{trimDescription(description)}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Package className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium text-charcoal">Qty: {quantity}</span>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { FallbackImage } from "@/components/ui/fallback-image"

interface ProductCardProps {
  id: string
  name: string
  price: number
  rating: number
  image: string
  category: string
  description?: string
  salePrice?: number
  isOnSale?: boolean
}

export default function ProductCard({
  id,
  name,
  price,
  rating,
  image,
  category,
  description,
  salePrice,
  isOnSale,
}: ProductCardProps) {
  // Create a URL-friendly slug from the product name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters first (except spaces and dashes)
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple consecutive dashes with single dash

  return (
    <Link href={`/product/${slug}`} className="group relative block overflow-hidden rounded-lg border">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <FallbackImage
          src={image || "/placeholder.svg?height=300&width=300"}
          alt={name}
          fallbackSrc="/placeholder.svg?height=300&width=300"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium">{name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            {isOnSale && salePrice ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{formatPrice(salePrice)}</p>
                <p className="text-sm text-gray-500 line-through">{formatPrice(price)}</p>
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-900">{formatPrice(price)}</p>
            )}
          </div>
          {rating > 0 && (
            <span className="text-xs font-medium text-amber-500 flex items-center">
              {Number(rating).toFixed(1)}
              <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
        {category && (
          <div className="mt-2">
            <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs">{category}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, ArrowRight } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import QuickViewModal from "./quick-view-modal"
import { FallbackImage } from "@/components/ui/fallback-image"

// Update the Product interface to include sale price information
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  description?: string
  salePrice?: number
  isOnSale?: boolean
}

interface ProductShowcaseProps {
  title: string
  subtitle: string
  badge: string
  products: Product[]
  viewAllLink: string
  viewAllText?: string
}

export default function ProductShowcase({
  title,
  subtitle,
  badge,
  products,
  viewAllLink,
  viewAllText = "View All",
}: ProductShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        duration: 2000,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      })
    }
  }

  const openQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2 w-fit mx-auto">
              <span className="font-medium">{badge}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{title}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-3xl p-6 shadow-lg border border-violet-100 overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-200 to-indigo-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

              {product.discount && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Save ${product.discount}
                </div>
              )}

              <div className="relative h-[200px] w-full mb-6 overflow-hidden rounded-xl">
                <FallbackImage
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fallbackSrc="/placeholder.svg"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-3 right-3 rounded-full bg-white/90 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3"
                  onClick={() => openQuickView(product)}
                >
                  Quick View
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 ${
                    isInWishlist(product.id) ? "text-red-500" : "text-violet-600"
                  } transition-all hover:scale-110`}
                  onClick={(e) => toggleWishlist(product, e)}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  <span className="sr-only">
                    {isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  </span>
                </Button>
              </div>

              <div className="space-y-4 relative">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  {product.isOnSale && product.salePrice ? (
                    <>
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <span className="text-green-600 text-sm font-medium">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && !product.isOnSale && (
                    <>
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="text-green-600 text-sm font-medium">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {/* In the component, add a check for the description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {product.description || `High-quality ${product.name.toLowerCase()} for your electronics projects.`}
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full border-violet-200 ${
                      isInWishlist(product.id) ? "text-red-500 border-red-200" : "text-violet-600 hover:bg-violet-50"
                    }`}
                    onClick={(e) => toggleWishlist(product, e)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    <span className="sr-only">
                      {isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
            asChild
          >
            <Link href={viewAllLink}>
              {viewAllText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {selectedProduct && (
          <QuickViewModal
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
            product={{
              id: selectedProduct.id,
              name: selectedProduct.name,
              price: selectedProduct.price,
              originalPrice: selectedProduct.originalPrice,
              image: selectedProduct.image,
              description: selectedProduct.description,
            }}
          />
        )}
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    salePrice?: number
    isOnSale?: boolean
    rating?: number
    image: string
    description?: string
    category?: string
  }
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const inWishlist = isInWishlist(product.id)

  // Add this state to track if an item was just added to cart
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  // Update the handleAddToCart function
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })

    // Show the View Cart button
    setJustAddedToCart(true)
  }

  const toggleWishlist = () => {
    if (inWishlist) {
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

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Create a URL-friendly slug from the product name
  const slug = product.name.toLowerCase().replace(/\s+/g, "-")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gray-50 p-6 flex items-center justify-center">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="max-h-[300px] object-contain"
            />
          </div>
          <div className="p-6 space-y-4">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2 text-violet-600 border-violet-200">
                  {product.category}
                </Badge>
              )}
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
              {product.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`}
                        />
                      ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
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

            <DialogDescription className="text-gray-700">
              {product.description || "No description available."}
            </DialogDescription>

            <div className="pt-4 space-y-4">
              <div className="flex items-center">
                <span className="mr-4 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={incrementQuantity}>
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    View Cart & Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${inWishlist ? "text-red-500 border-red-200" : ""}`}
                  onClick={toggleWishlist}
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                  <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
                  asChild
                >
                  <Link href={`/product/${slug}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

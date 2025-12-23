"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import ProductCarousel from "./product-carousel"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useWishlist } from "@/context/wishlist-context"

export default function FeaturedProduct() {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { isInWishlist, addItem: addWishlistItem, removeItem: removeWishlistItem } = useWishlist()

  const productImages = [
    "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=400&fit=crop&q=60",
    "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=400&fit=crop&q=40",
  ]

  const product = {
    id: "featured-1",
    name: "Arduino Starter Kit",
    price: 49.99,
    image: productImages[0],
  }

  const handleAddToCart = () => {
    addItem(product)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  const handleWishlistClick = () => {
    const inWishlist = isInWishlist(product.id)
    if (inWishlist) {
      removeWishlistItem(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        duration: 2000,
      })
    } else {
      addWishlistItem(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      })
    }
  }

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-md w-full border border-violet-100 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-200 to-indigo-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-violet-200 to-indigo-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

      <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-violet-600 to-indigo-600">New Release</Badge>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 rounded-full hover:bg-white/80 text-violet-600"
        onClick={handleWishlistClick}
      >
        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
        <span className="sr-only">Add to wishlist</span>
      </Button>

      <div className="relative h-[300px] w-full mb-6 overflow-hidden">
        <ProductCarousel images={productImages} alt="Arduino Starter Kit" />
      </div>

      <div className="space-y-4 relative">
        <h3 className="text-xl font-bold">Arduino Starter Kit</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            $49.99
          </span>
          <span className="text-sm text-gray-500 line-through">$69.99</span>
          <Badge variant="outline" className="ml-auto text-green-600 border-green-600">
            Save $20
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners
        </p>
        <div className="flex gap-3">
          <Button
            className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
            asChild
          >
            <Link href="/product/arduino-starter-kit">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

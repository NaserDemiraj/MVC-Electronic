"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight, Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

interface ProductBannerProps {
  title: string
  subtitle: string
  description: string
  image: string
  badge: string
  buttonText: string
  buttonLink: string
  product?: {
    id: string
    name: string
    price: number
    image: string
  }
}

export default function ProductBanner({
  title,
  subtitle,
  description,
  image,
  badge,
  buttonText,
  buttonLink,
  product,
}: ProductBannerProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  const inWishlist = product ? isInWishlist(product.id) : false

  // Update the handleAddToCart function to match the cart context
  const handleAddToCart = () => {
    if (product) {
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

      setJustAddedToCart(true)
      setTimeout(() => setJustAddedToCart(false), 5000)
    }
  }

  const toggleWishlist = () => {
    if (!product) return

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

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-r from-violet-50 to-indigo-50">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600">{badge}</Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">{title}</h2>
            <p className="text-xl font-medium text-violet-600">{subtitle}</p>
            <p className="text-gray-600 md:text-lg">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                asChild
              >
                <Link href={buttonLink}>
                  {buttonText}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              {product && (
                <>
                  {justAddedToCart ? (
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 rounded-full border-green-200 text-green-600 hover:bg-green-50"
                      asChild
                    >
                      <Link href="/cart">
                        <ShoppingCart className="h-4 w-4" />
                        View Cart
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    className={`gap-2 rounded-full ${
                      inWishlist
                        ? "border-red-200 text-red-500 hover:bg-red-50"
                        : "border-violet-200 text-violet-600 hover:bg-violet-50"
                    }`}
                    onClick={toggleWishlist}
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                    {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-200 to-indigo-200 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

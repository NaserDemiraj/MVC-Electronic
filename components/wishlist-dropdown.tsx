"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Trash2, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

export default function WishlistDropdown() {
  const [open, setOpen] = useState(false)
  const { items, itemCount, removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:scale-110 transition-transform"
        >
          <Heart className={`h-5 w-5 ${itemCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open wishlist</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-medium">Your Wishlist</h3>
          <p className="text-sm text-gray-500">{itemCount} items</p>
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">Your wishlist is empty</div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-auto">
              {items.map((item) => (
                <DropdownMenuItem key={item.id} className="flex p-4 focus:bg-transparent" asChild>
                  <div>
                    <div className="mr-2 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(item)
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-500"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeItem(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/wishlist">View Wishlist</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

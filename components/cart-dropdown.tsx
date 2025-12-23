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
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CartDropdown() {
  const [open, setOpen] = useState(false)
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs text-white">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-medium">Your Cart</h3>
          <p className="text-sm text-gray-500">{itemCount} items</p>
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">Your cart is empty</div>
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
                        <p className="ml-4">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              updateQuantity(item.id, (item.quantity || 1) - 1)
                            }}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity || 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              updateQuantity(item.id, (item.quantity || 1) + 1)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
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
            <div className="p-4">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

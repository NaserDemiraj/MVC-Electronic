"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, isLoaded } = useCart()

  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // Show loading while cart is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-contain rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <Link href={`/product/${item.id}`} className="font-medium hover:text-primary">
                            {item.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center border rounded-md w-32">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
                <Button variant="outline">Update Cart</Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80">
              <div className="rounded-lg border p-6 space-y-6">
                <h2 className="font-bold text-lg">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 py-6 text-lg font-medium"
                    asChild
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-gray-500">or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Checkout with PayPal
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Have a coupon?</h3>
                  <div className="flex">
                    <Input placeholder="Coupon code" className="rounded-r-none" />
                    <Button className="rounded-l-none">Apply</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-gray-500"
              >
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

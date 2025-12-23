"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, Trash2, ShoppingCart, Heart } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
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
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">Wishlist</span>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Your Wishlist</h1>

        {items.length > 0 ? (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <Link
                        href={`/product/${item.id}`}
                        className="font-medium hover:text-violet-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Heart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

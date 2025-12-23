"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function BulkDiscountPage() {
  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [minQuantity, setMinQuantity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProducts, setSelectedProducts] = useState([])

  // Mock categories
  const categories = [
    { id: "cat1", name: "Development Boards" },
    { id: "cat2", name: "Components" },
    { id: "cat3", name: "Tools" },
    { id: "cat4", name: "Kits" },
  ]

  // Mock products
  const products = [
    { id: "prod1", name: "Arduino Uno", category: "Development Boards", price: 24.99, stock: 45 },
    { id: "prod2", name: "Raspberry Pi 4", category: "Development Boards", price: 55.99, stock: 32 },
    { id: "prod3", name: "Soldering Iron", category: "Tools", price: 19.99, stock: 28 },
    { id: "prod4", name: "Breadboard Kit", category: "Components", price: 12.99, stock: 56 },
    { id: "prod5", name: "LED Pack", category: "Components", price: 8.99, stock: 120 },
    { id: "prod6", name: "Starter Kit", category: "Kits", price: 49.99, stock: 18 },
  ]

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!discountValue || !minQuantity || selectedProducts.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select at least one product.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this data to your backend
    toast({
      title: "Bulk discount created",
      description: `Created a ${discountType} discount of ${discountValue}${
        discountType === "percentage" ? "%" : "$"
      } for orders of ${minQuantity} or more items.`,
    })

    // Reset form
    setDiscountValue("")
    setMinQuantity("")
    setSelectedCategory("")
    setSelectedProducts([])
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create Bulk Discount</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Discount Settings</CardTitle>
              <CardDescription>Configure your bulk discount offer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <select
                    id="discount-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value ({discountType === "percentage" ? "%" : "$"})</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    min="0"
                    step={discountType === "percentage" ? "1" : "0.01"}
                    max={discountType === "percentage" ? "100" : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 10.00"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-quantity">Minimum Quantity</Label>
                  <Input
                    id="min-quantity"
                    type="number"
                    min="2"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    placeholder="e.g. 5"
                  />
                  <p className="text-sm text-gray-500">
                    Customers must purchase at least this many items to receive the discount
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Create Discount
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
              <CardDescription>Choose which products will be eligible for this discount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="category-filter">Filter by Category</Label>
                <select
                  id="category-filter"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={
                              filteredProducts.length > 0 &&
                              filteredProducts.every((product) => selectedProducts.includes(product.id))
                            }
                            onChange={() => {
                              if (filteredProducts.every((product) => selectedProducts.includes(product.id))) {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (id) => !filteredProducts.some((product) => product.id === id),
                                  ),
                                )
                              } else {
                                const newSelectedProducts = [...selectedProducts]
                                filteredProducts.forEach((product) => {
                                  if (!newSelectedProducts.includes(product.id)) {
                                    newSelectedProducts.push(product.id)
                                  }
                                })
                                setSelectedProducts(newSelectedProducts)
                              }
                            }}
                          />
                        </div>
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleProductSelection(product.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedProducts([])}>
                Clear Selection
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

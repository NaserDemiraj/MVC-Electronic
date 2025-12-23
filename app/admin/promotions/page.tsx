"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Search, X, Tag, Percent, DollarSign, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock products data
const mockProducts = [
  {
    id: "prod-1",
    name: "Arduino Uno R3",
    price: 24.99,
    category: "Microcontrollers",
    image: "/products/microcontroller.svg",
  },
  {
    id: "prod-2",
    name: "Raspberry Pi 4 - 4GB",
    price: 45.99,
    category: "Microcontrollers",
    image: "/products/microcontroller.svg",
  },
  {
    id: "prod-3",
    name: "Soldering Station Kit",
    price: 79.99,
    category: "Tools",
    image: "/products/tools.svg",
  },
  {
    id: "prod-4",
    name: "Ultrasonic Distance Sensor",
    price: 12.99,
    category: "Sensors",
    image: "/products/sensor.svg",
  },
  {
    id: "prod-5",
    name: "ESP32 Development Board",
    price: 8.99,
    category: "Microcontrollers",
    image: "/products/microcontroller.svg",
  },
  {
    id: "prod-6",
    name: "Temperature & Humidity Sensor",
    price: 4.99,
    category: "Sensors",
    image: "/products/sensor.svg",
  },
]

// Mock categories data
const mockCategories = [
  { id: "cat-1", name: "Microcontrollers" },
  { id: "cat-2", name: "Sensors" },
  { id: "cat-3", name: "Tools" },
  { id: "cat-4", name: "Kits" },
  { id: "cat-5", name: "Components" },
]

// Mock promotions data with product-specific discounts
const mockPromotions = [
  {
    id: "promo-1",
    name: "Summer Sale",
    type: "percentage",
    value: 20,
    code: "SUMMER20",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    usageCount: 156,
    revenue: 4350.75,
    applicationType: "storewide", // storewide, specific-products, or categories
    products: [],
    categories: [],
    productDiscounts: [], // For product-specific discount values
  },
  {
    id: "promo-2",
    name: "Welcome Discount",
    type: "percentage",
    value: 10,
    code: "WELCOME10",
    status: "active",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    usageCount: 243,
    revenue: 2890.25,
    applicationType: "storewide",
    products: [],
    categories: [],
    productDiscounts: [],
  },
  {
    id: "promo-3",
    name: "Flash Sale",
    type: "fixed",
    value: 15,
    code: "FLASH15",
    status: "scheduled",
    startDate: "2023-09-15",
    endDate: "2023-09-17",
    usageCount: 0,
    revenue: 0,
    applicationType: "specific-products",
    products: ["prod-1", "prod-3"],
    categories: [],
    productDiscounts: [
      { productId: "prod-1", value: 5 },
      { productId: "prod-3", value: 15 },
    ],
  },
  {
    id: "promo-4",
    name: "Holiday Special",
    type: "percentage",
    value: 25,
    code: "HOLIDAY25",
    status: "draft",
    startDate: "",
    endDate: "",
    usageCount: 0,
    revenue: 0,
    applicationType: "categories",
    products: [],
    categories: ["cat-1", "cat-2"],
    productDiscounts: [],
  },
  {
    id: "promo-5",
    name: "Clearance",
    type: "percentage",
    value: 50,
    code: "CLEAR50",
    status: "ended",
    startDate: "2023-02-01",
    endDate: "2023-03-01",
    usageCount: 89,
    revenue: 1250.5,
    applicationType: "specific-products",
    products: ["prod-5", "prod-6"],
    categories: [],
    productDiscounts: [
      { productId: "prod-5", value: 40 },
      { productId: "prod-6", value: 60 },
    ],
  },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [products, setProducts] = useState(mockProducts)
  const [categories, setCategories] = useState(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [productDiscounts, setProductDiscounts] = useState([])
  const [newPromo, setNewPromo] = useState({
    name: "",
    type: "percentage",
    value: "",
    code: "",
    status: "draft",
    startDate: "",
    endDate: "",
    applicationType: "storewide",
  })

  // Filter promotions based on search term and status
  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || promo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  // Handle selecting a product
  const handleSelectProduct = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId))
      setProductDiscounts(productDiscounts.filter((discount) => discount.productId !== productId))
    } else {
      setSelectedProductIds([...selectedProductIds, productId])
      // Add default discount value based on promotion type
      const defaultValue = newPromo.type === "percentage" ? 10 : 5
      setProductDiscounts([...productDiscounts, { productId, value: defaultValue }])
    }
  }

  // Handle selecting a category
  const handleSelectCategory = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId))
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    }
  }

  // Handle changing product-specific discount value
  const handleProductDiscountChange = (productId, value) => {
    setProductDiscounts(
      productDiscounts.map((discount) =>
        discount.productId === productId ? { ...discount, value: Number(value) } : discount,
      ),
    )
  }

  // Reset product and category selections when application type changes
  useEffect(() => {
    if (newPromo.applicationType === "storewide") {
      setSelectedProductIds([])
      setSelectedCategoryIds([])
      setProductDiscounts([])
    }
  }, [newPromo.applicationType])

  // Handle adding a new promotion
  const handleAddPromotion = () => {
    // Create a new promotion with a unique ID
    const promotion = {
      id: `promo-${Date.now()}`,
      ...newPromo,
      value: Number(newPromo.value),
      usageCount: 0,
      revenue: 0,
      products: selectedProductIds,
      categories: selectedCategoryIds,
      productDiscounts: productDiscounts,
    }

    // Add the new promotion to the list
    setPromotions([...promotions, promotion])

    // Reset the form
    setNewPromo({
      name: "",
      type: "percentage",
      value: "",
      code: "",
      status: "draft",
      startDate: "",
      endDate: "",
      applicationType: "storewide",
    })
    setSelectedProductIds([])
    setSelectedCategoryIds([])
    setProductDiscounts([])
    setProductSearchTerm("")

    // Close the dialog
    setIsAddPromoOpen(false)

    // Show a success message
    toast({
      title: "Promotion created",
      description: "The promotion has been created successfully.",
    })
  }

  // Handle toggling a promotion's status
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    setPromotions(
      promotions.map((promo) =>
        promo.id === id
          ? {
              ...promo,
              status: newStatus,
            }
          : promo,
      ),
    )

    toast({
      title: `Promotion ${newStatus}`,
      description: `The promotion has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  // Handle deleting a promotion
  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promo) => promo.id !== id))

    toast({
      title: "Promotion deleted",
      description: "The promotion has been deleted successfully.",
    })
  }

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Promotions Management</h1>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <div>
            <Label htmlFor="status-filter" className="sr-only">
              Filter by status
            </Label>
            <select
              id="status-filter"
              className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          <Dialog open={isAddPromoOpen} onOpenChange={setIsAddPromoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>Add a new promotion or discount code to your store.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="application">Application</TabsTrigger>
                  <TabsTrigger value="products">Product Discounts</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Promotion Name</Label>
                    <Input
                      id="name"
                      value={newPromo.name}
                      onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                      placeholder="e.g. Summer Sale"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Discount Type</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPromo.type}
                      onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Default Discount Value ({newPromo.type === "percentage" ? "%" : "$"})</Label>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      step={newPromo.type === "percentage" ? "1" : "0.01"}
                      max={newPromo.type === "percentage" ? "100" : undefined}
                      value={newPromo.value}
                      onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                      placeholder={newPromo.type === "percentage" ? "e.g. 20" : "e.g. 10.00"}
                    />
                    <p className="text-xs text-gray-500">
                      This is the default discount value. You can set different values for specific products later.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SUMMER20"
                    />
                    <p className="text-xs text-gray-500">
                      Customers will enter this code at checkout to receive the discount.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newPromo.startDate}
                        onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newPromo.endDate}
                        onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPromo.status}
                      onChange={(e) => setNewPromo({ ...newPromo, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="application" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Application Type</Label>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          newPromo.applicationType === "storewide"
                            ? "border-violet-500 bg-violet-50"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setNewPromo({ ...newPromo, applicationType: "storewide" })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-5 w-5 text-violet-600" />
                          <span className="font-medium">Storewide</span>
                        </div>
                        <p className="text-sm text-gray-500">Apply to all products in your store</p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          newPromo.applicationType === "specific-products"
                            ? "border-violet-500 bg-violet-50"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setNewPromo({ ...newPromo, applicationType: "specific-products" })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingBag className="h-5 w-5 text-violet-600" />
                          <span className="font-medium">Specific Products</span>
                        </div>
                        <p className="text-sm text-gray-500">Apply to selected products only</p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          newPromo.applicationType === "categories"
                            ? "border-violet-500 bg-violet-50"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setNewPromo({ ...newPromo, applicationType: "categories" })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Percent className="h-5 w-5 text-violet-600" />
                          <span className="font-medium">Categories</span>
                        </div>
                        <p className="text-sm text-gray-500">Apply to all products in selected categories</p>
                      </div>
                    </div>
                  </div>

                  {newPromo.applicationType === "specific-products" && (
                    <div className="space-y-4 mt-4">
                      <Label>Select Products</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search products..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedProductIds.includes(product.id)}
                                    onCheckedChange={() => handleSelectProduct(product.id)}
                                  />
                                </TableCell>
                                <TableCell className="flex items-center gap-2">
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                  <span>{product.name}</span>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            {filteredProducts.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                  No products found. Try adjusting your search.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProductIds.length > 0 ? (
                          selectedProductIds.map((productId) => (
                            <Badge key={productId} variant="outline" className="flex items-center gap-1">
                              {getProductName(productId)}
                              <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => handleSelectProduct(productId)}
                              />
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No products selected</p>
                        )}
                      </div>
                    </div>
                  )}

                  {newPromo.applicationType === "categories" && (
                    <div className="space-y-4 mt-4">
                      <Label>Select Categories</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedCategoryIds.includes(category.id)
                                ? "border-violet-500 bg-violet-50"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => handleSelectCategory(category.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedCategoryIds.includes(category.id)}
                                onCheckedChange={() => handleSelectCategory(category.id)}
                              />
                              <span>{category.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="products" className="space-y-4 py-4">
                  {newPromo.applicationType === "specific-products" && selectedProductIds.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Product-Specific Discount Values</Label>
                        <p className="text-sm text-gray-500">Set different discount values for each selected product</p>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Regular Price</TableHead>
                              <TableHead>Discount Value ({newPromo.type === "percentage" ? "%" : "$"})</TableHead>
                              <TableHead>Final Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedProductIds.map((productId) => {
                              const product = products.find((p) => p.id === productId)
                              const discount = productDiscounts.find((d) => d.productId === productId)
                              const discountValue = discount ? discount.value : 0
                              const finalPrice =
                                newPromo.type === "percentage"
                                  ? product.price * (1 - discountValue / 100)
                                  : product.price - discountValue

                              return (
                                <TableRow key={productId}>
                                  <TableCell className="flex items-center gap-2">
                                    <img
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                    <span>{product.name}</span>
                                  </TableCell>
                                  <TableCell>${product.price.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      {newPromo.type === "percentage" ? (
                                        <Percent className="h-4 w-4 mr-2 text-gray-400" />
                                      ) : (
                                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                      )}
                                      <Input
                                        type="number"
                                        min="0"
                                        step={newPromo.type === "percentage" ? "1" : "0.01"}
                                        max={newPromo.type === "percentage" ? "100" : product.price}
                                        value={discountValue}
                                        onChange={(e) => handleProductDiscountChange(productId, e.target.value)}
                                        className="w-24"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium text-green-600">
                                      ${finalPrice > 0 ? finalPrice.toFixed(2) : "0.00"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : newPromo.applicationType === "specific-products" ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Please select products in the Application tab first</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Product-specific discounts are only available when "Specific Products" is selected</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setNewPromo({ ...newPromo, applicationType: "specific-products" })}
                      >
                        Switch to Specific Products
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPromoOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPromotion}>Create Promotion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Promotions</CardTitle>
            <CardDescription>All promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{promotions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Promotions</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{promotions.filter((p) => p.status === "active").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Usage</CardTitle>
            <CardDescription>Times used</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{promotions.reduce((sum, p) => sum + p.usageCount, 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue Generated</CardTitle>
            <CardDescription>From promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${promotions.reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Application</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPromotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">{promo.name}</TableCell>
              <TableCell>
                <code className="bg-gray-100 px-2 py-1 rounded">{promo.code}</code>
              </TableCell>
              <TableCell>
                {promo.applicationType === "specific-products" && promo.productDiscounts.length > 0 ? (
                  <div className="flex items-center">
                    <span>{promo.type === "percentage" ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}</span>
                    <Badge variant="outline" className="ml-2">
                      + Custom
                    </Badge>
                  </div>
                ) : (
                  <span>{promo.type === "percentage" ? `${promo.value}%` : `$${promo.value.toFixed(2)}`}</span>
                )}
              </TableCell>
              <TableCell>
                {promo.applicationType === "storewide" ? (
                  <Badge variant="outline" className="bg-blue-50">
                    Storewide
                  </Badge>
                ) : promo.applicationType === "specific-products" ? (
                  <div>
                    <Badge variant="outline" className="bg-violet-50">
                      {promo.products.length} Products
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="h-auto p-0 ml-2">
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Products in {promo.name}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Regular Price</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Final Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {promo.products.map((productId) => {
                                const product = products.find((p) => p.id === productId)
                                if (!product) return null

                                const customDiscount = promo.productDiscounts.find((d) => d.productId === productId)
                                const discountValue = customDiscount ? customDiscount.value : promo.value
                                const finalPrice =
                                  promo.type === "percentage"
                                    ? product.price * (1 - discountValue / 100)
                                    : product.price - discountValue

                                return (
                                  <TableRow key={productId}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                      {promo.type === "percentage"
                                        ? `${discountValue}%`
                                        : `$${discountValue.toFixed(2)}`}
                                    </TableCell>
                                    <TableCell>${finalPrice > 0 ? finalPrice.toFixed(2) : "0.00"}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div>
                    <Badge variant="outline" className="bg-green-50">
                      {promo.categories.length} Categories
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="h-auto p-0 ml-2">
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Categories in {promo.name}</DialogTitle>
                        </DialogHeader>
                        <div>
                          {promo.categories.map((categoryId) => (
                            <Badge key={categoryId} variant="outline" className="m-1">
                              {getCategoryName(categoryId)}
                            </Badge>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    promo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : promo.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : promo.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {promo.startDate && promo.endDate
                  ? `${new Date(promo.startDate).toLocaleDateString()} - ${new Date(
                      promo.endDate,
                    ).toLocaleDateString()}`
                  : "Not set"}
              </TableCell>
              <TableCell>
                {promo.usageCount} uses
                {promo.revenue > 0 && ` / $${promo.revenue.toFixed(2)}`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {(promo.status === "active" || promo.status === "inactive") && (
                    <Switch
                      checked={promo.status === "active"}
                      onCheckedChange={() => handleToggleStatus(promo.id, promo.status)}
                    />
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/promotion-analytics?id=${promo.id}`}>Analytics</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the "{promo.name}" promotion? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeletePromotion(promo.id)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredPromotions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No promotions found. Try adjusting your filters or create a new promotion.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

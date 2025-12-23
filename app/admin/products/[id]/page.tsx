"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Database, Loader2, Save } from "lucide-react"
import { getProductById, updateProduct, type ProductDetail } from "@/app/actions/product-actions"
import { getCategories, type Category } from "@/app/actions/category-actions"
import { ProductDetailsForm } from "@/components/admin/product-details-form"
import { InventoryManager } from "@/components/admin/inventory-manager"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalProduct, setOriginalProduct] = useState<ProductDetail | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          getProductById(Number(params.id)),
          getCategories(),
        ])

        if (productResponse.success) {
          setProduct(productResponse.data)
          setOriginalProduct(JSON.parse(JSON.stringify(productResponse.data)))
        } else {
          toast({
            title: "Error",
            description: productResponse.error || "Failed to fetch product",
            variant: "destructive",
          })
          router.push("/admin/products")
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data)
        } else {
          toast({
            title: "Error",
            description: categoriesResponse.error || "Failed to fetch categories",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  // Check for changes in the product data
  useEffect(() => {
    if (product && originalProduct) {
      const productFields = ["name", "slug", "description", "price", "discount_price", "category_id", "brand"]
      const hasFieldChanges = productFields.some(
        (field) =>
          JSON.stringify(product[field as keyof ProductDetail]) !==
          JSON.stringify(originalProduct[field as keyof ProductDetail]),
      )
      setHasChanges(hasFieldChanges)
    }
  }, [product, originalProduct])

  const handleUpdateProduct = async () => {
    if (!product) return

    setIsSubmitting(true)
    try {
      const { images, features, specifications, ...productData } = product
      const response = await updateProduct(product.id, productData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Product updated successfully in the database",
          icon: <Database className="h-4 w-4" />,
        })
        setOriginalProduct(JSON.parse(JSON.stringify(product)))
        setHasChanges(false)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const refreshProductDetails = async () => {
    try {
      const response = await getProductById(Number(params.id))
      if (response.success) {
        setProduct(response.data)
        setOriginalProduct(JSON.parse(JSON.stringify(response.data)))
        setHasChanges(false)
      }
    } catch (error) {
      console.error("Error refreshing product details:", error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (product) {
      setProduct({ ...product, [field]: value })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading product details...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="mb-4">The product you are looking for does not exist or has been removed.</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Update the basic product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={product.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                <Input id="slug" value={product.slug} onChange={(e) => handleInputChange("slug", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={product.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_price">Discount Price ($)</Label>
                  <Input
                    id="discount_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.discount_price || ""}
                    onChange={(e) =>
                      handleInputChange("discount_price", e.target.value ? Number.parseFloat(e.target.value) : null)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={product.category_id || ""}
                  onChange={(e) =>
                    handleInputChange("category_id", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={product.brand || ""}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>

              <Button onClick={handleUpdateProduct} disabled={isSubmitting || !hasChanges} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes to Database
                  </>
                )}
              </Button>

              {hasChanges && (
                <p className="text-xs text-amber-600 text-center">
                  You have unsaved changes that haven't been saved to the database yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Update stock status and quantity</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryManager
                productId={product.id}
                inStock={product.in_stock}
                stockQuantity={product.stock_quantity}
                onUpdate={refreshProductDetails}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Manage product images, features, and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductDetailsForm product={product} onUpdate={refreshProductDetails} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

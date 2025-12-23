"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createProduct, getCategories, addProductImage } from "@/app/actions/product-actions"
import { toast } from "@/components/ui/use-toast"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("")

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brand, setBrand] = useState("")
  const [inStock, setInStock] = useState(true)
  const [stockQuantity, setStockQuantity] = useState("0")
  const [imageUrl, setImageUrl] = useState("") // New state for image URL

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories()
        if (result.success) {
          setCategories(result.data)
        } else {
          console.error("Failed to load categories:", result.error)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

    loadCategories()
  }, [])

  // Generate slug from name
  const handleNameChange = (value) => {
    setName(value)
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      )
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate form
      if (!name) {
        setError("Product name is required")
        setIsLoading(false)
        return
      }

      if (!slug) {
        setError("Product slug is required")
        setIsLoading(false)
        return
      }

      if (!price || isNaN(Number.parseFloat(price))) {
        setError("Valid price is required")
        setIsLoading(false)
        return
      }

      // Create product data object
      const productData = {
        name,
        slug,
        description,
        price: Number.parseFloat(price),
        discount_price: discountPrice ? Number.parseFloat(discountPrice) : null,
        category_id: categoryId ? Number.parseInt(categoryId) : null,
        brand: brand || null,
        in_stock: inStock,
        stock_quantity: Number.parseInt(stockQuantity),
      }

      // Submit the form
      const result = await createProduct(productData)

      if (result.success) {
        // If an image URL was provided, add it to the product
        if (imageUrl.trim()) {
          const imageResult = await addProductImage(result.data.id, imageUrl, 0)

          if (!imageResult.success) {
            toast({
              title: "Warning",
              description: `Product created but failed to add image: ${imageResult.error}`,
              variant: "destructive",
            })
          }
        }

        // Show success message
        toast({
          title: "Success",
          description: "Product created successfully",
        })

        // Redirect to products page on success
        router.push("/admin/products")
      } else {
        setError(result.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Preview the image
  const handleImagePreview = () => {
    if (!imageUrl.trim()) return null

    return (
      <div className="mt-2">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Preview"
          className="h-40 object-contain border rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=160&width=160"
            toast({
              title: "Warning",
              description: "Could not load image preview. Please check the URL.",
              variant: "destructive",
            })
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Link href="/admin/products">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back to Products</button>
        </Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Slug (URL) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Used in the URL. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          {/* New Image URL field */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Product Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">Enter a direct URL to an image (JPG, PNG, WebP, etc.)</p>
            {imageUrl.trim() && handleImagePreview()}
          </div>

          <div>
            <label className="block mb-2 font-medium">Price ($) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Discount Price ($)</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              min="0"
              step="1"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="inStock" className="font-medium">
              In Stock
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

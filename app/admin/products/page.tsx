import Link from "next/link"
import { sql } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

async function getProducts() {
  try {
    // Get products with their first image
    const products = await sql`
      SELECT p.*, 
             c.name as category_name,
             (SELECT image_url FROM product_images 
              WHERE product_id = p.id 
              ORDER BY display_order LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Add your first product to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded border overflow-hidden">
                      {/* Use next/image or a simple img without event handlers */}
                      <img
                        src={product.image_url || "/placeholder.svg?height=48&width=48"}
                        alt={product.name || "Product image"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.discount_price ? (
                      <div>
                        <span className="text-sm font-medium text-gray-900">{formatPrice(product.discount_price)}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.category_name || "Uncategorized"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.in_stock ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock ({product.stock_quantity})
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/products/${product.id}`}>
                      <span className="text-blue-600 hover:text-blue-900 mr-4">Edit</span>
                    </Link>
                    <Link href={`/product/${product.slug}`} target="_blank">
                      <span className="text-green-600 hover:text-green-900">View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

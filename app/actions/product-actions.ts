"use server"

import { sql, simpleSqlQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ProductImage = {
  id: number
  product_id: number
  image_url: string
  display_order: number
  created_at: string
}

export type ProductFeature = {
  id: number
  product_id: number
  feature: string
  created_at: string
}

export type ProductSpecification = {
  id: number
  product_id: number
  spec_name: string
  spec_value: string
  created_at: string
}

export type ProductDetail = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  discount_price: number | null
  category_id: number | null
  brand: string | null
  rating: number
  reviews_count: number
  in_stock: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  images: ProductImage[]
  features: ProductFeature[]
  specifications: ProductSpecification[]
}

export type ProductInput = {
  name: string
  slug: string
  description: string
  price: number
  discount_price: number | null
  category_id: number | null
  brand: string | null
  in_stock: boolean
  stock_quantity: number
}

// Get a product by ID
export async function getProductById(id: number): Promise<{ success: boolean; data?: ProductDetail; error?: string }> {
  try {
    // Get the product
    const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `

    if (!product || product.length === 0) {
      return { success: false, error: "Product not found" }
    }

    // Get product images
    const images = await sql`
      SELECT * FROM product_images WHERE product_id = ${id} ORDER BY display_order
    `

    // Get product features
    const features = await sql`
      SELECT * FROM product_features WHERE product_id = ${id}
    `

    // Get product specifications
    const specifications = await sql`
      SELECT * FROM product_specifications WHERE product_id = ${id}
    `

    // Combine all data
    const productDetail: ProductDetail = {
      ...product[0],
      images: images || [],
      features: features || [],
      specifications: specifications || [],
    }

    return { success: true, data: productDetail }
  } catch (error) {
    console.error("Failed to get product by ID:", error)
    return { success: false, error: `Failed to get product: ${error.message || "Unknown error"}` }
  }
}

// Update an existing product
export async function updateProduct(id: number, productData: Partial<ProductInput>) {
  try {
    console.log("Updating product:", id, productData)

    // Ensure numeric values are properly converted
    const updates: Record<string, any> = {}

    if (productData.name !== undefined) updates.name = productData.name
    if (productData.slug !== undefined) updates.slug = productData.slug
    if (productData.description !== undefined) updates.description = productData.description

    if (productData.price !== undefined) {
      updates.price = typeof productData.price === "string" ? Number.parseFloat(productData.price) : productData.price
    }

    if (productData.discount_price !== undefined) {
      updates.discount_price =
        productData.discount_price === null
          ? null
          : typeof productData.discount_price === "string"
            ? Number.parseFloat(productData.discount_price)
            : productData.discount_price
    }

    if (productData.category_id !== undefined) updates.category_id = productData.category_id
    if (productData.brand !== undefined) updates.brand = productData.brand
    if (productData.in_stock !== undefined) updates.in_stock = productData.in_stock

    if (productData.stock_quantity !== undefined) {
      updates.stock_quantity =
        typeof productData.stock_quantity === "string"
          ? Number.parseInt(productData.stock_quantity)
          : productData.stock_quantity
    }

    // Build the SET clause dynamically
    const setClause = Object.entries(updates)
      .map(([key, value]) => `${key} = ${typeof value === "string" ? `'${value}'` : value === null ? "NULL" : value}`)
      .join(", ")

    if (!setClause) {
      return { success: false, error: "No fields to update" }
    }

    // Use simpleSqlQuery for backward compatibility
    const result = await simpleSqlQuery(`
      UPDATE products 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = ${id} 
      RETURNING *
    `)

    if (!result || result.length === 0) {
      return { success: false, error: "Product not found" }
    }

    console.log("Product updated successfully:", result[0])

    revalidatePath(`/admin/products/${id}`)
    revalidatePath("/admin/products")

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update product:", error)

    // Check for duplicate slug error
    if (error.message && error.message.includes("duplicate key value")) {
      return {
        success: false,
        error: "A product with this slug already exists. Please use a different slug.",
      }
    }

    return {
      success: false,
      error: `Failed to update product: ${error.message || "Unknown error"}`,
    }
  }
}

// Create a new product
export async function createProduct(productData: ProductInput) {
  try {
    console.log("Creating product:", productData)

    // Generate slug from name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    // Ensure numeric values are properly converted
    const price = typeof productData.price === "string" ? Number.parseFloat(productData.price) : productData.price

    const discount_price = productData.discount_price
      ? typeof productData.discount_price === "string"
        ? Number.parseFloat(productData.discount_price)
        : productData.discount_price
      : null

    const stock_quantity =
      typeof productData.stock_quantity === "string"
        ? Number.parseInt(productData.stock_quantity)
        : productData.stock_quantity

    // Insert the product using tagged template literals
    const result = await sql`
      INSERT INTO products (
        name, slug, description, price, discount_price, 
        category_id, brand, in_stock, stock_quantity
      ) VALUES (
        ${productData.name}, 
        ${productData.slug}, 
        ${productData.description}, 
        ${price}, 
        ${discount_price}, 
        ${productData.category_id}, 
        ${productData.brand}, 
        ${productData.in_stock}, 
        ${stock_quantity}
      ) RETURNING *
    `

    console.log("Product created successfully:", result)

    revalidatePath("/admin/products")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create product:", error)

    // Check for duplicate slug error
    if (error.message && error.message.includes("duplicate key value")) {
      return {
        success: false,
        error: "A product with this slug already exists. Please use a different slug.",
      }
    }

    return {
      success: false,
      error: `Failed to create product: ${error.message || "Unknown error"}`,
    }
  }
}

// Get all categories for the dropdown
export async function getCategories() {
  try {
    const categories = await sql`
      SELECT * FROM categories ORDER BY name
    `

    return { success: true, data: categories }
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

// Add a new product image
export async function addProductImage(productId: number, imageUrl: string, displayOrder: number) {
  try {
    const result = await sql`
      INSERT INTO product_images (product_id, image_url, display_order)
      VALUES (${productId}, ${imageUrl}, ${displayOrder})
      RETURNING *
    `

    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to add product image:", error)
    return { success: false, error: "Failed to add product image" }
  }
}

// Delete a product image
export async function deleteProductImage(imageId: number) {
  try {
    const result = await sql`
      DELETE FROM product_images WHERE id = ${imageId} RETURNING id
    `

    if (!result.length) {
      return { success: false, error: "Image not found" }
    }

    revalidatePath(`/admin/products/[id]`)
    return { success: true, data: { id: imageId } }
  } catch (error) {
    console.error("Failed to delete product image:", error)
    return { success: false, error: "Failed to delete product image" }
  }
}

// Add a new product feature
export async function addProductFeature(productId: number, featureText: string) {
  try {
    const result = await sql`
      INSERT INTO product_features (product_id, feature)
      VALUES (${productId}, ${featureText})
      RETURNING *
    `

    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to add product feature:", error)
    return { success: false, error: "Failed to add product feature" }
  }
}

// Update an existing product feature
export async function updateProductFeature(featureId: number, featureText: string) {
  try {
    const result = await sql`
      UPDATE product_features SET feature = ${featureText} WHERE id = ${featureId} RETURNING *
    `

    if (!result.length) {
      return { success: false, error: "Feature not found" }
    }

    revalidatePath(`/admin/products/[id]`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update product feature:", error)
    return { success: false, error: "Failed to update product feature" }
  }
}

// Delete a product feature
export async function deleteProductFeature(featureId: number) {
  try {
    const result = await sql`
      DELETE FROM product_features WHERE id = ${featureId} RETURNING id
    `

    if (!result.length) {
      return { success: false, error: "Feature not found" }
    }

    revalidatePath(`/admin/products/[id]`)
    return { success: true, data: { id: featureId } }
  } catch (error) {
    console.error("Failed to delete product feature:", error)
    return { success: false, error: "Failed to delete product feature" }
  }
}

// Add a new product specification
export async function addProductSpecification(productId: number, specName: string, specValue: string) {
  try {
    const result = await sql`
      INSERT INTO product_specifications (product_id, spec_name, spec_value)
      VALUES (${productId}, ${specName}, ${specValue})
      RETURNING *
    `

    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to add product specification:", error)
    return { success: false, error: "Failed to add product specification" }
  }
}

// Update an existing product specification
export async function updateProductSpecification(specId: number, specName: string, specValue: string) {
  try {
    const result = await sql`
      UPDATE product_specifications 
      SET spec_name = ${specName}, spec_value = ${specValue} 
      WHERE id = ${specId} 
      RETURNING *
    `

    if (!result.length) {
      return { success: false, error: "Specification not found" }
    }

    revalidatePath(`/admin/products/[id]`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update product specification:", error)
    return { success: false, error: "Failed to update product specification" }
  }
}

// Delete a product specification
export async function deleteProductSpecification(specId: number) {
  try {
    const result = await sql`
      DELETE FROM product_specifications WHERE id = ${specId} RETURNING id
    `

    if (!result.length) {
      return { success: false, error: "Specification not found" }
    }

    revalidatePath(`/admin/products/[id]`)
    return { success: true, data: { id: specId } }
  } catch (error) {
    console.error("Failed to delete product specification:", error)
    return { success: false, error: "Failed to delete product specification" }
  }
}

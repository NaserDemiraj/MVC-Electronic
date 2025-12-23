"use server"

import { simpleSqlQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">

// Get all categories
export async function getCategories() {
  try {
    const categories = await simpleSqlQuery(`
      SELECT * FROM categories ORDER BY name
    `)

    return { success: true, data: categories }
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

// Get a single category by ID
export async function getCategoryById(id: number) {
  try {
    const categories = await simpleSqlQuery(`
      SELECT * FROM categories WHERE id = ${id}
    `)

    if (!categories.length) {
      return { success: false, error: "Category not found" }
    }

    return { success: true, data: categories[0] }
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return { success: false, error: "Failed to fetch category" }
  }
}

// Create a new category
export async function createCategory(categoryData: CategoryInput) {
  try {
    // Check if slug already exists
    const existingCategories = await simpleSqlQuery(`
      SELECT * FROM categories WHERE slug = '${categoryData.slug}'
    `)

    if (existingCategories.length > 0) {
      return { success: false, error: "A category with this slug already exists" }
    }

    // Insert the new category
    const result = await simpleSqlQuery(`
      INSERT INTO categories (name, slug, description)
      VALUES (
        '${categoryData.name}',
        '${categoryData.slug}',
        ${categoryData.description ? `'${categoryData.description}'` : "NULL"}
      )
      RETURNING *
    `)

    revalidatePath("/admin/categories")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

// Update an existing category
export async function updateCategory(id: number, categoryData: Partial<CategoryInput>) {
  try {
    // Generate update query
    const updateFields = []

    if (categoryData.name !== undefined) updateFields.push(`name = '${categoryData.name}'`)
    if (categoryData.slug !== undefined) updateFields.push(`slug = '${categoryData.slug}'`)
    if (categoryData.description !== undefined) {
      updateFields.push(`description = ${categoryData.description ? `'${categoryData.description}'` : "NULL"}`)
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    if (updateFields.length === 0) {
      return { success: false, error: "No fields to update" }
    }

    const result = await simpleSqlQuery(`
      UPDATE categories 
      SET ${updateFields.join(", ")} 
      WHERE id = ${id} 
      RETURNING *
    `)

    if (!result.length) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/admin/categories")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

// Delete a category
export async function deleteCategory(id: number) {
  try {
    // Check if category has products
    const products = await simpleSqlQuery(`
      SELECT COUNT(*) as count FROM products WHERE category_id = ${id}
    `)

    if (Number.parseInt(products[0]?.count || "0") > 0) {
      return {
        success: false,
        error: "Cannot delete category with associated products. Remove or reassign products first.",
      }
    }

    const result = await simpleSqlQuery(`
      DELETE FROM categories WHERE id = ${id} RETURNING id
    `)

    if (!result.length) {
      return { success: false, error: "Category not found" }
    }

    revalidatePath("/admin/categories")
    return { success: true, data: { id } }
  } catch (error) {
    console.error("Failed to delete category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

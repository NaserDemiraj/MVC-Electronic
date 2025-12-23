import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!sql) {
      throw new Error("SQL client not initialized")
    }

    // Drop all tables in the correct order (respecting foreign keys)
    try {
      await sql`DROP TABLE IF EXISTS product_specifications CASCADE;`
    } catch (e) {
      console.log("product_specifications table might not exist:", e)
    }

    try {
      await sql`DROP TABLE IF EXISTS product_features CASCADE;`
    } catch (e) {
      console.log("product_features table might not exist:", e)
    }

    try {
      await sql`DROP TABLE IF EXISTS product_images CASCADE;`
    } catch (e) {
      console.log("product_images table might not exist:", e)
    }

    try {
      await sql`DROP TABLE IF EXISTS products CASCADE;`
    } catch (e) {
      console.log("products table might not exist:", e)
    }

    try {
      await sql`DROP TABLE IF EXISTS categories CASCADE;`
    } catch (e) {
      console.log("categories table might not exist:", e)
    }

    return NextResponse.json({
      success: true,
      message: "Database cleared successfully",
    })
  } catch (error) {
    console.error("Failed to clear database:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "SQL client not initialized" }, { status: 500 })
    }

    // Check if products table exists and has data
    const products = await sql`SELECT COUNT(*) as count FROM products;`
    const productList = await sql`SELECT id, name, slug, price FROM products LIMIT 5;`

    return NextResponse.json({
      success: true,
      productCount: products[0]?.count || 0,
      products: productList,
    })
  } catch (error) {
    console.error("Error checking products:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

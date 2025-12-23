import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await sql`
      SELECT id, slug, name FROM products LIMIT 10
    `
    
    return NextResponse.json({ 
      success: true,
      count: products.length,
      products: products
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: `Failed to fetch products: ${error.message}` },
      { status: 500 }
    )
  }
}

import { sql } from "@/lib/db"

export async function GET() {
  try {
    const products = await sql.query("SELECT name, slug FROM products ORDER BY name")
    return Response.json(products || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

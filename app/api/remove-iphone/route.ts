import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Delete iPhone 15 Pro from products
    const query = `DELETE FROM products WHERE name = 'iPhone 15 Pro'`
    await sql.query(query)
    
    return Response.json({
      success: true,
      message: "iPhone 15 Pro removed from products",
    })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to remove product", details: String(error) }, { status: 500 })
  }
}

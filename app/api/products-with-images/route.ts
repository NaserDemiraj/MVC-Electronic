import { sql } from "@/lib/db"

export async function GET() {
  try {
    const products = await sql.query(`
      SELECT name, slug, image FROM products ORDER BY name
    `)
    return Response.json(products || [])
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}

import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    if (!category) {
      return Response.json({ error: "Category parameter required" }, { status: 400 })
    }

    let query = ""
    const categoryLower = category.toLowerCase()

    // Map category to product names
    if (categoryLower === "microcontrollers") {
      query = `SELECT * FROM products WHERE name LIKE '%Arduino%' OR name LIKE '%Raspberry%' OR name LIKE '%ESP%' OR name LIKE '%NodeMCU%' ORDER BY id DESC`
    } else if (categoryLower === "sensors") {
      query = `SELECT * FROM products WHERE name LIKE '%Sensor%' OR name LIKE '%DHT%' OR name LIKE '%HC-SR%' OR name LIKE '%PIR%' ORDER BY id DESC`
    } else if (categoryLower === "laptops") {
      query = `SELECT * FROM products WHERE name LIKE '%Laptop%' OR name LIKE '%Ultrabook%' ORDER BY id DESC`
    } else if (categoryLower === "kits") {
      query = `SELECT * FROM products WHERE name LIKE '%Kit%' ORDER BY id DESC`
    } else {
      query = `SELECT * FROM products ORDER BY id DESC`
    }

    const products = await sql.query(query)

    return Response.json(products || [])
  } catch (error) {
    console.error("Error fetching category products:", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

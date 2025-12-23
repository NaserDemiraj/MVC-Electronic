import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Add image column to products table if it doesn't exist
    const query = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS image VARCHAR(500);
    `
    
    await sql.query(query)
    
    return Response.json({
      success: true,
      message: "Image column added to products table",
    })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to add image column", details: String(error) }, { status: 500 })
  }
}

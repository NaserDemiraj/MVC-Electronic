import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Update products with local images from public folder
    const updates = [
      { name: "Soldering Station Kit - Digital", image: "/Soldering Station Kit - Digital.webp" },
      { name: "Ultrasonic Distance Sensor Pack", image: "/Ultrasonic Distance Sensor Pack.jpg" },
      { name: "Wireless IoT Sensor Kit", image: "/Wireless IoT Sensor Kit.jpg" },
      { name: "Breadboard Kit", image: "/Breadboard Kit.jpg" },
      { name: "Beginner Electronics Kit", image: "/Beginner Electronics Kit.webp" },
    ]

    let updatedCount = 0

    for (const product of updates) {
      try {
        const query = `UPDATE products SET image = '${product.image}' WHERE name = '${product.name}'`
        await sql.query(query)
        updatedCount++
        console.log(`Updated: ${product.name}`)
      } catch (error) {
        console.error(`Error updating ${product.name}:`, error)
      }
    }

    return Response.json({
      success: true,
      message: `Updated ${updatedCount} products with local images`,
      updated: updatedCount,
    })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to update products", details: String(error) }, { status: 500 })
  }
}

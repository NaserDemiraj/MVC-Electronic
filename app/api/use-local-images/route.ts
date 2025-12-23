import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Update products with local images from public folder
    const updates = [
      { name: "Arduino Starter Kit", image: "/Arduino Starter Kit.webp" },
      { name: "Arduino Uno R3 Microcontroller", image: "/Arduino Uno R3 Microcontroller.jpg" },
      { name: "ESP32 Development Board", image: "/ESP32 Development Board.png" },
      { name: "Raspberry Pi 4 - 4GB", image: "/Raspberry Pi 4 - 4GB.jpg" },
      { name: "Raspberry Pi 4 Model B - 4GB", image: "/Raspberry Pi 4 Model B - 4GB.png" },
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

import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Update products with all local images from public folder
    const updates = [
      { name: "Arduino Starter Kit", image: "/Arduino Starter Kit.webp" },
      { name: "Arduino Uno R3 Microcontroller", image: "/Arduino Uno R3 Microcontroller.jpg" },
      { name: "ESP32 Development Board", image: "/ESP32 Development Board.png" },
      { name: "Raspberry Pi 4 - 4GB", image: "/Raspberry Pi 4 - 4GB.jpg" },
      { name: "Raspberry Pi 4 Model B - 4GB", image: "/Raspberry Pi 4 Model B - 4GB.png" },
      { name: "Soldering Station Kit - Digital", image: "/Soldering Station Kit - Digital.webp" },
      { name: "Ultrasonic Distance Sensor Pack", image: "/Ultrasonic Distance Sensor Pack.jpg" },
      { name: "Wireless IoT Sensor Kit", image: "/Wireless IoT Sensor Kit.jpg" },
      { name: "Breadboard Kit", image: "/Breadboard Kit.jpg" },
      { name: "Beginner Electronics Kit", image: "/Beginner Electronics Kit.webp" },
      { name: "Electronics Learning Lab", image: "/Electronics Learning Lab.webp" },
      { name: "Digital Multimeter", image: "/Digital Multimeter.webp" },
      { name: "OLED Display Module", image: "/OLED Display Module.webp" },
      { name: "Servo Motor Pack", image: "/Servo Motor Pack.jpg" },
      { name: "DHT22 Temperature & Humidity Sensor", image: "/DHT22 Temperature & Humidity Sensor.webp" },
      { name: "Dell XPS 15", image: "/Dell XPS 15.webp" },
      { name: "Samsung Galaxy S23 Ultra", image: "/Samsung Galaxy S23 Ultra.webp" },
      { name: "Samsung Galaxy Watch 6", image: "/Samsung Galaxy Watch 6.webp" },
      { name: "Anker 65W GaN Charger", image: "/Anker 65W GaN Charger.webp" },
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

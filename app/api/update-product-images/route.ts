import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Update products with UNIQUE images based on their names
    const updates = [
      { name: "Arduino Starter Kit", image: "https://images.unsplash.com/photo-1589595997281-5f9e3001b942?w=500&h=500&fit=crop" },
      { name: "Raspberry Pi 4 - 4GB", image: "https://images.unsplash.com/photo-1591290619266-89da8b0f9743?w=500&h=500&fit=crop" },
      { name: "Electronics Learning Lab", image: "https://images.unsplash.com/photo-1580126579312-94651dfd596d?w=500&h=500&fit=crop" },
      { name: "Arduino Uno R3 Microcontroller", image: "https://images.unsplash.com/photo-1517433456155-76514fedab00?w=500&h=500&fit=crop" },
      { name: "Raspberry Pi 4 Model B - 4GB", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop" },
      { name: "Soldering Station Kit - Digital", image: "https://images.unsplash.com/photo-1599598427-67c1f0b86c72?w=500&h=500&fit=crop" },
      { name: "Ultrasonic Distance Sensor Pack", image: "https://images.unsplash.com/photo-1581092160562-40038f56c40d?w=500&h=500&fit=crop" },
      { name: "ESP32 Development Board", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop" },
      { name: "DHT22 Temperature & Humidity Sensor", image: "https://images.unsplash.com/photo-1581092157544-8ac2b57ba21d?w=500&h=500&fit=crop" },
      { name: "Beginner Electronics Kit", image: "https://images.unsplash.com/photo-1580126579312-94651dfd596d?w=500&h=500&fit=crop" },
      { name: "Digital Multimeter", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop" },
      { name: "OLED Display Module", image: "https://images.unsplash.com/photo-1581092160559-112debad63ca?w=500&h=500&fit=crop" },
      { name: "Servo Motor Pack", image: "https://images.unsplash.com/photo-1517433456155-76514fedab00?w=500&h=500&fit=crop" },
      { name: "Wireless IoT Sensor Kit", image: "https://images.unsplash.com/photo-1516337247406-bc89f1b96dd4?w=500&h=500&fit=crop" },
      { name: "Breadboard Kit", image: "https://images.unsplash.com/photo-1516383740770-fbdc86e2c467?w=500&h=500&fit=crop" },
      { name: "MacBook Pro 16", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop" },
      { name: "Dell XPS 15", image: "https://images.unsplash.com/photo-1593642632703-37effb0637c7?w=500&h=500&fit=crop" },
      { name: "iPhone 15 Pro", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop" },
      { name: "Samsung Galaxy S23 Ultra", image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop" },
      { name: "Apple AirPods Pro 2", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
      { name: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop" },
      { name: "Apple Watch Series 9", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop" },
      { name: "Samsung Galaxy Watch 6", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500&h=500&fit=crop" },
      { name: "Anker 65W GaN Charger", image: "https://images.unsplash.com/photo-1591291621749-101d6d4b8f60?w=500&h=500&fit=crop" },
      { name: "Belkin MagSafe 3-in-1 Wireless Charger", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop" },
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
      message: `Updated ${updatedCount} products with images`,
      updated: updatedCount,
    })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to update products" }, { status: 500 })
  }
}

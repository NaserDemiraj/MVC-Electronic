import { sql } from "@/lib/db"

export async function GET() {
  try {
    // All products that need to be in the database
    const allProducts = [
      // Laptops with real images
      {
        name: "Ultra Slim Laptop Pro",
        slug: "ultra-slim-laptop-pro",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
      },
      {
        name: "Business Laptop Elite",
        slug: "business-laptop-elite",
        price: 1499.99,
        image: "https://images.unsplash.com/photo-1588872657840-790ff3bda245?w=500&h=500&fit=crop",
      },
      {
        name: "Gaming Laptop Extreme",
        slug: "gaming-laptop-extreme",
        price: 1899.99,
        image: "https://images.unsplash.com/photo-1603642892514-e4fe3ce80a59?w=500&h=500&fit=crop",
      },
      {
        name: "Student Laptop Basic",
        slug: "student-laptop-basic",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=500&fit=crop",
      },
      {
        name: "Convertible 2-in-1 Laptop",
        slug: "convertible-2-in-1-laptop",
        price: 999.99,
        image: "https://images.unsplash.com/photo-1586657969055-d3babe78e487?w=500&h=500&fit=crop",
      },
      {
        name: "Ultrabook Pro",
        slug: "ultrabook-pro",
        price: 1199.99,
        image: "https://images.unsplash.com/photo-1588872657840-790ff3bda245?w=500&h=500&fit=crop",
      },
      // Additional Microcontroller Products
      {
        name: "Arduino Nano",
        slug: "arduino-nano",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1596994306875-60c4aeb7e7b8?w=500&h=500&fit=crop",
      },
      {
        name: "Raspberry Pi Pico",
        slug: "raspberry-pi-pico",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1581092162562-40038f56c40d?w=500&h=500&fit=crop",
      },
      {
        name: "ESP8266 NodeMCU",
        slug: "esp8266-nodemcu",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop",
      },
    ]

    let insertedCount = 0

    for (const product of allProducts) {
      try {
        // Check if product already exists
        const existingQuery = `SELECT id FROM products WHERE slug = '${product.slug}'`
        const existing = await sql.query(existingQuery)

        if (existing && existing.length > 0) {
          console.log(`Product ${product.name} already exists, skipping...`)
          continue
        }

        // Insert the product
        const insertQuery = `
          INSERT INTO products (name, slug, price, image)
          VALUES ('${product.name}', '${product.slug}', ${product.price}, '${product.image}')
        `

        await sql.query(insertQuery)
        insertedCount++
        console.log(`Inserted: ${product.name}`)
      } catch (error) {
        console.error(`Error inserting ${product.name}:`, error)
      }
    }

    return Response.json({
      success: true,
      message: `Successfully inserted ${insertedCount} products`,
      inserted: insertedCount,
    })
  } catch (error) {
    console.error("Error populating products:", error)
    return Response.json({ error: "Failed to populate products" }, { status: 500 })
  }
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!sql) {
      throw new Error("SQL not initialized")
    }

    console.log("Creating tables...")
    await sql`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL UNIQUE, description TEXT)`
    await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL UNIQUE, description TEXT, price NUMERIC, discount_price NUMERIC, category_id INTEGER, brand VARCHAR(255), in_stock BOOLEAN, stock_quantity INTEGER)`

    console.log("Inserting categories...")
    await sql`INSERT INTO categories (name, slug, description) VALUES ('Smartphones', 'smartphones', 'Latest smartphones') ON CONFLICT DO NOTHING`
    await sql`INSERT INTO categories (name, slug, description) VALUES ('Laptops', 'laptops', 'Powerful laptops') ON CONFLICT DO NOTHING`
    await sql`INSERT INTO categories (name, slug, description) VALUES ('Audio', 'audio', 'Headphones') ON CONFLICT DO NOTHING`
    await sql`INSERT INTO categories (name, slug, description) VALUES ('Wearables', 'wearables', 'Smartwatches') ON CONFLICT DO NOTHING`
    await sql`INSERT INTO categories (name, slug, description) VALUES ('Accessories', 'accessories', 'Cables') ON CONFLICT DO NOTHING`

    console.log("Inserting products...")
    const products = [
      ['Arduino Starter Kit', 'arduino-starter-kit', 'Complete kit with Arduino Uno', 49.99, 39.99, 1, 'Arduino', true, 50],
      ['Raspberry Pi 4 - 4GB', 'raspberry-pi-4---4gb', 'Powerful Raspberry Pi', 59.99, 54.99, 1, 'Raspberry Pi', true, 35],
      ['Electronics Learning Lab', 'electronics-learning-lab', 'Electronics learning kit', 89.99, 79.99, 1, 'Learning', true, 20],
      ['Arduino Uno R3', 'arduino-uno-r3-microcontroller', 'Arduino board', 24.99, 19.99, 2, 'Arduino', true, 100],
      ['Raspberry Pi 4B', 'raspberry-pi-4-model-b---4gb', 'Raspberry Pi', 45.99, 41.99, 2, 'Raspberry Pi', true, 60],
      ['Soldering Station', 'soldering-station-kit---digital', 'Soldering station', 79.99, 69.99, 3, 'Weller', true, 25],
      ['Multimeter', 'multimeter-digital---professional-grade', 'Digital multimeter', 34.99, 29.99, 3, 'Fluke', true, 40],
      ['Breadboard', 'breadboard-830-tie-points---solderless', 'Solderless breadboard', 12.99, 9.99, 4, 'Generic', true, 150],
      ['LED Kit', 'led-assortment-kit---500-pieces', 'LED assortment', 19.99, 14.99, 4, 'Generic', true, 80],
      ['Sensor Pack', 'sensor-variety-pack---37-in-1', 'Sensor collection', 29.99, 24.99, 5, 'Generic', true, 45],
      ['Jumper Wires', 'jumper-wires-kit---140-pieces', 'Jumper wires', 15.99, 12.99, 5, 'Generic', true, 120],
      ['Power Supply', 'power-supply-module-5v-3a', '5V power supply', 22.99, 18.99, 5, 'Generic', true, 55]
    ]

    for (const product of products) {
      try {
        await sql`INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity) VALUES (${product[0]}, ${product[1]}, ${product[2]}, ${product[3]}, ${product[4]}, ${product[5]}, ${product[6]}, ${product[7]}, ${product[8]}) ON CONFLICT DO NOTHING`
      } catch (e) {
        console.log(`Error inserting product ${product[0]}:`, e)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed"
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

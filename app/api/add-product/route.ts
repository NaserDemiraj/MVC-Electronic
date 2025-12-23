import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "SQL not init" })
    }

    // Just try one simple insert
    const name = "Arduino Starter Kit"
    const slug = "arduino-starter-kit"
    const desc = "Complete kit for beginners"
    const price = 49.99
    const discount = 39.99
    const brand = "Arduino"

    await sql`INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Arduino Starter Kit', 'arduino-starter-kit', 'Complete kit', 49.99, 39.99, 'Arduino', true, 100)`

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}

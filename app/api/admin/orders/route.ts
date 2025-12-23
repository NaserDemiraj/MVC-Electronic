import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET all orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    if (!sql) {
      return NextResponse.json({
        success: true,
        orders: [],
        message: "Database not configured"
      })
    }

    let orders
    
    if (status && status !== "all") {
      orders = await sql`
        SELECT * FROM orders 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    } else if (search) {
      orders = await sql`
        SELECT * FROM orders 
        WHERE order_number ILIKE ${'%' + search + '%'}
           OR customer_name ILIKE ${'%' + search + '%'}
           OR customer_email ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
      `
    } else {
      orders = await sql`
        SELECT * FROM orders 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      success: true,
      orders
    })
  } catch (error: any) {
    console.error("Get orders error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - create new order
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    // Ensure orders table exists
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        customer_id INTEGER,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        subtotal NUMERIC(10,2) NOT NULL,
        shipping_cost NUMERIC(10,2) DEFAULT 0,
        tax NUMERIC(10,2) DEFAULT 0,
        total NUMERIC(10,2) NOT NULL,
        shipping_address TEXT,
        shipping_city VARCHAR(100),
        shipping_state VARCHAR(100),
        shipping_zip VARCHAR(20),
        shipping_country VARCHAR(100),
        shipping_method VARCHAR(50),
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Ensure customers table exists
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        phone VARCHAR(50),
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(20),
        country VARCHAR(100),
        total_orders INTEGER DEFAULT 0,
        total_spent NUMERIC(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_order_at TIMESTAMP
      )
    `

    // Generate order number
    const orderNumber = `EG-${Date.now().toString().slice(-6)}`

    const result = await sql`
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, status,
        subtotal, shipping_cost, tax, total,
        shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
        shipping_method, payment_method
      ) VALUES (
        ${orderNumber}, ${data.customer_id || null}, ${data.customer_name}, ${data.customer_email}, 'pending',
        ${data.subtotal}, ${data.shipping_cost || 0}, ${data.tax || 0}, ${data.total},
        ${data.shipping_address}, ${data.shipping_city}, ${data.shipping_state}, 
        ${data.shipping_zip}, ${data.shipping_country},
        ${data.shipping_method || 'standard'}, ${data.payment_method || 'credit_card'}
      )
      RETURNING *
    `

    const newOrder = result[0]

    // Save order items if provided
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      // Ensure order_items table exists with product_slug for review verification
      await sql`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id VARCHAR(100),
          product_name VARCHAR(255) NOT NULL,
          product_slug VARCHAR(255),
          quantity INTEGER NOT NULL,
          price NUMERIC(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Add product_slug column if it doesn't exist (for existing tables)
      try {
        await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_slug VARCHAR(255)`
      } catch (e) {
        // Column might already exist
      }

      // Insert each item
      for (const item of data.items) {
        await sql`
          INSERT INTO order_items (order_id, product_id, product_name, product_slug, quantity, price)
          VALUES (${newOrder.id}, ${item.product_id}, ${item.product_name}, ${item.product_slug || null}, ${item.quantity}, ${item.price})
        `
      }
    }

    // Update customer stats
    await sql`
      INSERT INTO customers (name, email, total_orders, total_spent, last_order_at)
      VALUES (${data.customer_name}, ${data.customer_email}, 1, ${data.total}, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        total_orders = customers.total_orders + 1,
        total_spent = customers.total_spent + ${data.total},
        last_order_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({
      success: true,
      order: newOrder
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

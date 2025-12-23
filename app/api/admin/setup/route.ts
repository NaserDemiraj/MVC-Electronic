import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!sql) {
      throw new Error("SQL not initialized")
    }

    console.log("Creating admin tables...")

    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `

    // Create orders table
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

    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create customers table
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

    // Add password_hash column if it doesn't exist (for existing databases)
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='customers' AND column_name='password_hash') 
        THEN 
          ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255);
        END IF;
      END $$;
    `

    // Insert default admin user (password: admin123)
    // In production, use bcrypt to hash passwords
    const hashedPassword = "admin123" // Simple for demo - use bcrypt in production
    
    await sql`
      INSERT INTO admin_users (email, password_hash, name, role) 
      VALUES ('admin@example.com', ${hashedPassword}, 'Admin User', 'super_admin')
      ON CONFLICT (email) DO NOTHING
    `

    // Insert sample orders
    const sampleOrders = [
      {
        order_number: 'EG-100001',
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        status: 'delivered',
        subtotal: 249.99,
        shipping_cost: 0,
        tax: 20.00,
        total: 269.99,
        shipping_address: '123 Main St',
        shipping_city: 'Anytown',
        shipping_state: 'CA',
        shipping_zip: '12345',
        shipping_country: 'United States',
        shipping_method: 'standard',
        payment_method: 'credit_card'
      },
      {
        order_number: 'EG-100002',
        customer_name: 'Jane Smith',
        customer_email: 'jane.smith@example.com',
        status: 'processing',
        subtotal: 129.95,
        shipping_cost: 9.99,
        tax: 10.40,
        total: 150.34,
        shipping_address: '456 Oak Ave',
        shipping_city: 'Somewhere',
        shipping_state: 'NY',
        shipping_zip: '67890',
        shipping_country: 'United States',
        shipping_method: 'express',
        payment_method: 'paypal'
      },
      {
        order_number: 'EG-100003',
        customer_name: 'Robert Johnson',
        customer_email: 'robert.johnson@example.com',
        status: 'shipped',
        subtotal: 349.97,
        shipping_cost: 19.99,
        tax: 28.00,
        total: 397.96,
        shipping_address: '789 Pine Blvd',
        shipping_city: 'Elsewhere',
        shipping_state: 'TX',
        shipping_zip: '54321',
        shipping_country: 'United States',
        shipping_method: 'overnight',
        payment_method: 'credit_card'
      },
      {
        order_number: 'EG-100004',
        customer_name: 'Emily Davis',
        customer_email: 'emily.davis@example.com',
        status: 'pending',
        subtotal: 59.98,
        shipping_cost: 0,
        tax: 4.80,
        total: 64.78,
        shipping_address: '321 Elm St',
        shipping_city: 'Nowhere',
        shipping_state: 'FL',
        shipping_zip: '13579',
        shipping_country: 'United States',
        shipping_method: 'standard',
        payment_method: 'cash'
      }
    ]

    for (const order of sampleOrders) {
      await sql`
        INSERT INTO orders (
          order_number, customer_name, customer_email, status, 
          subtotal, shipping_cost, tax, total,
          shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
          shipping_method, payment_method
        ) VALUES (
          ${order.order_number}, ${order.customer_name}, ${order.customer_email}, ${order.status},
          ${order.subtotal}, ${order.shipping_cost}, ${order.tax}, ${order.total},
          ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}, ${order.shipping_zip}, ${order.shipping_country},
          ${order.shipping_method}, ${order.payment_method}
        )
        ON CONFLICT (order_number) DO NOTHING
      `
    }

    // Insert sample customers
    const sampleCustomers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'United States',
        total_orders: 5,
        total_spent: 549.95
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        address: '456 Oak Ave',
        city: 'Somewhere',
        state: 'NY',
        zip: '67890',
        country: 'United States',
        total_orders: 3,
        total_spent: 329.85
      },
      {
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        phone: '555-456-7890',
        address: '789 Pine Blvd',
        city: 'Elsewhere',
        state: 'TX',
        zip: '54321',
        country: 'United States',
        total_orders: 2,
        total_spent: 349.97
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '555-789-0123',
        address: '321 Elm St',
        city: 'Nowhere',
        state: 'FL',
        zip: '13579',
        country: 'United States',
        total_orders: 1,
        total_spent: 59.98
      }
    ]

    for (const customer of sampleCustomers) {
      await sql`
        INSERT INTO customers (
          name, email, phone, address, city, state, zip, country,
          total_orders, total_spent
        ) VALUES (
          ${customer.name}, ${customer.email}, ${customer.phone}, 
          ${customer.address}, ${customer.city}, ${customer.state}, ${customer.zip}, ${customer.country},
          ${customer.total_orders}, ${customer.total_spent}
        )
        ON CONFLICT (email) DO NOTHING
      `
    }

    return NextResponse.json({
      success: true,
      message: "Admin tables created and sample data inserted successfully"
    })
  } catch (error: any) {
    console.error("Admin setup error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to setup admin tables"
  })
}

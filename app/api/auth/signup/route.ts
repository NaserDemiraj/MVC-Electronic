import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone, address, city, country } = await request.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`

    // Check if database is available
    if (!sql) {
      // Demo mode - create a session without database
      const cookieStore = await cookies()
      cookieStore.set("customer_token", `demo_customer_${Date.now()}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      
      cookieStore.set("customer_logged_in", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })

      return NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: email,
          name: fullName
        },
        message: "Account created successfully (demo mode)"
      })
    }

    try {
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

      // Check if email already exists
      const existingCustomers = await sql`
        SELECT id FROM customers WHERE email = ${email}
      `

      if (existingCustomers.length > 0) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 400 }
        )
      }

      // Create new customer with all provided fields
      const result = await sql`
        INSERT INTO customers (name, email, password_hash, phone, address, city, country, created_at)
        VALUES (${fullName}, ${email}, ${password}, ${phone || null}, ${address || null}, ${city || null}, ${country || null}, CURRENT_TIMESTAMP)
        RETURNING id, name, email
      `

      const newCustomer = result[0]

      // Generate a simple token
      const token = `customer_${newCustomer.id}_${Date.now()}`

      // Set the auth cookies
      const cookieStore = await cookies()
      cookieStore.set("customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      
      // Set a non-httpOnly cookie that JavaScript can read for UI state
      cookieStore.set("customer_logged_in", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })

      return NextResponse.json({
        success: true,
        user: {
          id: newCustomer.id,
          email: newCustomer.email,
          name: newCustomer.name
        },
        message: "Account created successfully"
      })
    } catch (dbError: any) {
      console.error("Database error during signup:", dbError)
      
      // Check for unique constraint violation
      if (dbError.code === '23505') {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: "An error occurred during registration" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // ALWAYS check demo credentials first
    if (email === "demo@customer.com" && password === "demo123") {
      const cookieStore = await cookies()
      const token = `demo_customer_${Date.now()}`
      
      // Set httpOnly cookie for security
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
          id: 1,
          email: "demo@customer.com",
          name: "Demo Customer"
        }
      })
    }

    // Check if database is available
    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    try {
      // Check credentials against database
      const customers = await sql`
        SELECT id, name, email, phone, password_hash
        FROM customers 
        WHERE email = ${email}
      `

      if (customers.length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        )
      }

      const customer = customers[0]

      // Simple password comparison (use bcrypt in production)
      if (customer.password_hash !== password) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        )
      }

      // Generate a simple token
      const token = `customer_${customer.id}_${Date.now()}`
      
      // Set cookies
      const cookieStore = await cookies()
      cookieStore.set("customer_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
      })
      
      cookieStore.set("customer_logged_in", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
      })

      return NextResponse.json({
        success: true,
        user: {
          id: customer.id,
          email: customer.email,
          name: customer.name
        }
      })
    } catch (dbError) {
      console.error("Database error during customer login:", dbError)
      return NextResponse.json(
        { success: false, error: "An error occurred during login" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Customer login error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred during login" },
      { status: 500 }
    )
  }
}

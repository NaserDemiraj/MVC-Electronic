import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET all customers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    if (!sql) {
      return NextResponse.json({
        success: true,
        customers: [],
        message: "Database not configured"
      })
    }

    let customers
    
    if (search) {
      customers = await sql`
        SELECT * FROM customers 
        WHERE name ILIKE ${'%' + search + '%'}
           OR email ILIKE ${'%' + search + '%'}
           OR phone ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
      `
    } else {
      customers = await sql`
        SELECT * FROM customers 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      success: true,
      customers
    })
  } catch (error: any) {
    console.error("Get customers error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - create new customer
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const result = await sql`
      INSERT INTO customers (
        name, email, phone, address, city, state, zip, country
      ) VALUES (
        ${data.name}, ${data.email}, ${data.phone || null},
        ${data.address || null}, ${data.city || null}, ${data.state || null},
        ${data.zip || null}, ${data.country || null}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      customer: result[0]
    })
  } catch (error: any) {
    console.error("Create customer error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

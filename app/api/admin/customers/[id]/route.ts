import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET single customer
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const customers = await sql`
      SELECT * FROM customers WHERE id = ${id}
    `

    if (customers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      )
    }

    // Get customer's orders
    const orders = await sql`
      SELECT * FROM orders 
      WHERE customer_email = ${customers[0].email}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      customer: { ...customers[0], orders }
    })
  } catch (error: any) {
    console.error("Get customer error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH - update customer
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const result = await sql`
      UPDATE customers 
      SET 
        name = COALESCE(${data.name}, name),
        email = COALESCE(${data.email}, email),
        phone = COALESCE(${data.phone}, phone),
        address = COALESCE(${data.address}, address),
        city = COALESCE(${data.city}, city),
        state = COALESCE(${data.state}, state),
        zip = COALESCE(${data.zip}, zip),
        country = COALESCE(${data.country}, country)
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer: result[0]
    })
  } catch (error: any) {
    console.error("Update customer error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - delete customer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!sql) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    await sql`DELETE FROM customers WHERE id = ${id}`

    return NextResponse.json({
      success: true,
      message: "Customer deleted"
    })
  } catch (error: any) {
    console.error("Delete customer error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

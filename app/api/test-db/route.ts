import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "SQL not initialized" }, { status: 500 })
    }

    // Simple test query
    const result = await sql`SELECT NOW()`
    return NextResponse.json({ success: true, time: result })
  } catch (error) {
    console.error("Test query error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

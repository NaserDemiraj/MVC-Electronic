import { seedDatabase } from "@/app/actions/seed-database"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const result = await seedDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

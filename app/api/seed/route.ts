import { seedDatabase } from "@/app/actions/seed-database"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("Starting seed request...")
    const result = await seedDatabase()
    console.log("Seed result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}

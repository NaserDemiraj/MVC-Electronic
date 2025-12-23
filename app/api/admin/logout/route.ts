import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Delete the auth cookie
    cookieStore.delete("auth_token")

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}

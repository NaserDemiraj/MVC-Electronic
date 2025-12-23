import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Always allow demo credentials
    if (email === "admin@example.com" && password === "admin123") {
      const response = NextResponse.json({
        success: true,
        user: {
          id: 1,
          email: "admin@example.com",
          name: "Admin User",
          role: "super_admin"
        }
      })

      // Set cookie on the response
      response.cookies.set("auth_token", "demo_admin_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })

      return response
    }

    // If not demo credentials and database is available, check database
    if (sql) {
      try {
        // Check credentials against database
        const users = await sql`
          SELECT id, email, name, role, password_hash 
          FROM admin_users 
          WHERE email = ${email}
        `

        if (users.length > 0) {
          const user = users[0]

          // For demo, we do a simple comparison
          if (user.password_hash === password) {
            // Update last login
            await sql`
              UPDATE admin_users 
              SET last_login = CURRENT_TIMESTAMP 
              WHERE id = ${user.id}
            `

            // Generate a simple token
            const token = `admin_${user.id}_${Date.now()}`

            const response = NextResponse.json({
              success: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
              }
            })

            // Set cookie on the response
            response.cookies.set("auth_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7 // 1 week
            })

            return response
          }
        }
      } catch (dbError) {
        console.error("Database error during login:", dbError)
        // Continue to return invalid credentials
      }
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred during login" },
      { status: 500 }
    )
  }
}

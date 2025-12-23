import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware for demo purposes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with /admin
  if (pathname.startsWith("/admin")) {
    // Get the auth token
    const authToken = request.cookies.get("auth_token")

    // For demo purposes, we'll redirect to login if there's no auth cookie
    if (!authToken && pathname !== "/admin/login") {
      // Redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

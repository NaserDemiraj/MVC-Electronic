"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for authentication in both cookie and localStorage
    const checkAuth = () => {
      const cookieAuth = Cookies.get("auth_token")
      const localStorageAuth = localStorage.getItem("auth_token") || localStorage.getItem("cookie_auth_token")

      console.log("Auth check:", { cookieAuth, localStorageAuth })

      if (cookieAuth || localStorageAuth) {
        setIsAuthenticated(true)
      } else {
        // Redirect to login if not authenticated
        console.log("Not authenticated, redirecting to login")
        router.push("/login")
      }

      setIsLoading(false)
    }

    // Small delay to ensure client-side code runs
    setTimeout(checkAuth, 100)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return <>{children}</>
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      // Call the login API
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid email or password")
        setIsLoading(false)
        return
      }

      // Store auth token in localStorage as backup
      const token = `admin_${data.user.id}_${Date.now()}`
      localStorage.setItem("auth_token", token)
      localStorage.setItem("admin_user", JSON.stringify(data.user))

      // Also set a client-side cookie as fallback
      Cookies.set("auth_token", token, { 
        expires: 7,
        sameSite: "lax"
      })

      // Redirect to admin
      router.push("/admin")
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded">
                {error}
              </div>
            )}
            <div className="p-3 text-sm bg-blue-100 rounded text-blue-800">
              <strong>Demo Credentials:</strong>
              <br />
              Email: admin@example.com
              <br />
              Password: admin123
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              <Link href="/" className="text-blue-600 hover:underline">
                Back to store
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Are you a customer?{" "}
              <Link href="/customer-login" className="text-blue-600 hover:underline">
                Customer Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

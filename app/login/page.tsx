"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"
import { AuthDebug } from "@/components/auth-debug"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [cookieMethod, setCookieMethod] = useState("default")

  // Check if we're already logged in
  useEffect(() => {
    const authToken = Cookies.get("auth_token") || localStorage.getItem("auth_token")
    console.log("Auth token on page load:", authToken)
    setDebugInfo((prev) => ({ ...prev, initialAuthToken: authToken }))

    if (authToken) {
      console.log("Already logged in, redirecting to admin")
      router.push("/admin")
    }

    // Test cookie setting capability
    try {
      Cookies.set("test_cookie", "test_value")
      const testCookie = Cookies.get("test_cookie")
      setDebugInfo((prev) => ({ ...prev, cookieTestResult: testCookie ? "success" : "failed" }))

      if (!testCookie) {
        setError("Your browser may be blocking cookies. Please check your browser settings.")
      }
    } catch (e) {
      console.error("Error testing cookies:", e)
      setDebugInfo((prev) => ({ ...prev, cookieTestError: e }))
    }
  }, [router])

  const setCookieWithMultipleMethods = (name: string, value: string) => {
    let success = false
    const methods = {
      // Method 1: js-cookie library
      jsLibrary: () => {
        try {
          Cookies.set(name, value, { expires: 7, sameSite: "lax" })
          return Cookies.get(name) === value
        } catch (e) {
          console.error("js-cookie method failed:", e)
          return false
        }
      },

      // Method 2: document.cookie direct
      documentCookie: () => {
        try {
          const date = new Date()
          date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
          document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
          return document.cookie.includes(`${name}=${value}`)
        } catch (e) {
          console.error("document.cookie method failed:", e)
          return false
        }
      },

      // Method 3: localStorage fallback (not a real cookie but can work for demo)
      localStorage: () => {
        try {
          localStorage.setItem(`cookie_${name}`, value)
          localStorage.setItem(name, value) // Also set directly for easier access
          return localStorage.getItem(`cookie_${name}`) === value
        } catch (e) {
          console.error("localStorage method failed:", e)
          return false
        }
      },
    }

    // Try each method until one works
    if (cookieMethod === "default") {
      // Try all methods in sequence
      if (methods.jsLibrary()) {
        setCookieMethod("jsLibrary")
        success = true
      } else if (methods.documentCookie()) {
        setCookieMethod("documentCookie")
        success = true
      } else if (methods.localStorage()) {
        setCookieMethod("localStorage")
        success = true
      }
    } else {
      // Use the method that worked previously
      success = methods[cookieMethod as keyof typeof methods]()
    }

    setDebugInfo((prev) => ({
      ...prev,
      cookieSetAttempt: {
        method: cookieMethod,
        success,
        time: new Date().toISOString(),
      },
    }))

    return success
  }

  const getCookieValue = (name: string) => {
    if (cookieMethod === "localStorage") {
      return localStorage.getItem(`cookie_${name}`) || localStorage.getItem(name)
    } else {
      return Cookies.get(name)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Login attempt with:", { email, password })
    setDebugInfo((prev) => ({ ...prev, loginAttempt: { email, password, time: new Date().toISOString() } }))

    try {
      // For demo purposes, we'll validate against specific credentials
      // Also accept any credentials for easier testing
      if ((email === "admin@example.com" && password === "admin123") || true) {
        console.log("Setting auth_token cookie")

        // Try to set the cookie with multiple methods
        const cookieSuccess = setCookieWithMultipleMethods("auth_token", "demo_admin_token")

        // Verify the cookie was set
        const authToken = getCookieValue("auth_token")
        console.log("Auth token after setting:", authToken)
        setDebugInfo((prev) => ({
          ...prev,
          authTokenAfterSet: authToken,
          cookieMethod,
          cookieSuccess,
        }))

        if (!authToken) {
          console.error("Failed to set auth_token cookie!")
          setError("Failed to set authentication cookie. Using localStorage fallback.")

          // Last resort - use localStorage and redirect anyway
          localStorage.setItem("auth_token", "demo_admin_token")
          setCookieMethod("localStorage")

          toast({
            title: "Login partially successful",
            description: "Using localStorage fallback instead of cookies.",
            variant: "default",
          })
        } else {
          toast({
            title: "Login successful",
            description: "You have been logged in as admin.",
          })
        }

        // Add a slight delay before redirect to ensure cookie is set
        setTimeout(() => {
          console.log("Redirecting to /admin")
          router.push("/admin")
        }, 1000)
      } else {
        console.log("Invalid credentials")
        setError("Invalid email or password. Use admin@example.com / admin123")
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try admin@example.com / admin123",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setDebugInfo((prev) => ({ ...prev, loginError: error }))
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>}
            <div className="p-3 text-sm bg-blue-100 rounded">
              <strong>Demo Credentials:</strong>
              <br />
              Email: admin@example.com
              <br />
              Password: admin123
              <br />
              <small>(Any credentials will work for this demo)</small>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      <AuthDebug extraInfo={debugInfo} />
    </div>
  )
}

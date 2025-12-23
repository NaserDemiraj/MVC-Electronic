"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"
import { useToast } from "@/components/ui/use-toast"

interface AuthDebugProps {
  extraInfo?: Record<string, any>
}

export function AuthDebug({ extraInfo = {} }: AuthDebugProps) {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined)
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [cookieInfo, setCookieInfo] = useState<Record<string, any>>({})
  const [localStorageInfo, setLocalStorageInfo] = useState<Record<string, any>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Get all cookies for debugging
    const allCookies: Record<string, any> = {}
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=")
      if (name) allCookies[name] = value
    })

    // Get localStorage items
    const allLocalStorage: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) allLocalStorage[key] = localStorage.getItem(key)
    }

    setCookieInfo(allCookies)
    setLocalStorageInfo(allLocalStorage)
    setAuthToken(Cookies.get("auth_token"))
    setLocalStorageToken(localStorage.getItem("auth_token"))

    // Check cookie and localStorage every second to detect changes
    const interval = setInterval(() => {
      const currentToken = Cookies.get("auth_token")
      const currentLocalToken = localStorage.getItem("auth_token")

      if (currentToken !== authToken) {
        setAuthToken(currentToken)
        console.log("Auth token changed:", currentToken)
      }

      if (currentLocalToken !== localStorageToken) {
        setLocalStorageToken(currentLocalToken)
        console.log("LocalStorage token changed:", currentLocalToken)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [authToken, localStorageToken])

  const handleClearCookies = () => {
    Cookies.remove("auth_token")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("cookie_auth_token")
    setAuthToken(undefined)
    setLocalStorageToken(null)
    window.location.reload()
  }

  const handleSetDemoToken = () => {
    // Try both methods
    Cookies.set("auth_token", "demo_admin_token", { expires: 7 })
    localStorage.setItem("auth_token", "demo_admin_token")
    localStorage.setItem("cookie_auth_token", "demo_admin_token")

    setAuthToken("demo_admin_token")
    setLocalStorageToken("demo_admin_token")

    toast({
      title: "Auth token set",
      description: "Auth token has been manually set.",
    })
  }

  const handleTestRedirect = () => {
    window.location.href = "/admin"
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" size="sm" onClick={() => setShowDebug(true)}>
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 max-h-[80vh] overflow-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between">
            Authentication Debug
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowDebug(false)}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-4">
          <div className="space-y-1">
            <div>
              <strong>Cookie Auth Token:</strong> {authToken ? authToken : "Not set"}
            </div>
            <div>
              <strong>LocalStorage Auth Token:</strong> {localStorageToken ? localStorageToken : "Not set"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">All Cookies:</div>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(cookieInfo, null, 2)}</pre>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">LocalStorage:</div>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(localStorageInfo, null, 2)}</pre>
          </div>

          {Object.keys(extraInfo).length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold">Debug Info:</div>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(extraInfo, null, 2)}</pre>
            </div>
          )}

          <div className="flex space-x-2">
            <Button size="sm" variant="destructive" onClick={handleClearCookies}>
              Clear Auth
            </Button>
            <Button size="sm" variant="default" onClick={handleSetDemoToken}>
              Set Demo Token
            </Button>
            <Button size="sm" variant="outline" onClick={handleTestRedirect}>
              Test Redirect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

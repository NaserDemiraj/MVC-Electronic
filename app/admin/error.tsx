"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Database } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error("Admin panel error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900">Admin Panel Error</h2>

        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 font-medium">Error details:</p>
          <p className="text-sm text-red-700 mt-1 break-words">{error.message || "An unexpected error occurred"}</p>
          {error.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}

          <div className="mt-4 pt-3 border-t border-red-200">
            <p className="text-sm text-red-800 font-medium">Possible solutions:</p>
            <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
              <li>Check your database connection settings</li>
              <li>Ensure the DATABASE_URL environment variable is set correctly</li>
              <li>Try seeding the database to create necessary tables</li>
              <li>Check server logs for more detailed error information</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link href="/admin/products?seed=true" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Database className="w-4 h-4 mr-2" />
              Initialize Database
            </Button>
          </Link>

          <div className="text-center">
            <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

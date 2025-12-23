import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Return to home
      </Link>
    </div>
  )
}

"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"

// Mock product data for search results - using local images
const mockProducts = [
  {
    id: "1",
    name: "Arduino Uno R3 Microcontroller",
    price: 24.99,
    rating: 4.8,
    image: "/Arduino Uno R3 Microcontroller.jpg",
    category: "Microcontrollers",
    description:
      "The Arduino Uno R3 is the most used and documented board in the Arduino family, perfect for beginners and experienced makers.",
  },
  {
    id: "2",
    name: "Raspberry Pi 4 Model B - 4GB",
    price: 45.99,
    rating: 4.9,
    image: "/Raspberry Pi 4 Model B - 4GB.png",
    category: "Microcontrollers",
    description:
      "The Raspberry Pi 4 Model B with 4GB RAM offers desktop-like performance for a wide range of applications and projects.",
  },
  {
    id: "3",
    name: "Soldering Station Kit - Digital",
    price: 79.99,
    rating: 4.7,
    image: "/Soldering Station Kit - Digital.webp",
    category: "Tools",
    description:
      "Professional digital soldering station with adjustable temperature control, multiple tips, and accessories for precision work.",
  },
  {
    id: "4",
    name: "Ultrasonic Distance Sensor Pack",
    price: 12.99,
    rating: 4.6,
    image: "/Ultrasonic Distance Sensor Pack.jpg",
    category: "Sensors",
    description:
      "Pack of 5 HC-SR04 ultrasonic distance sensors for measuring distances in your robotics and automation projects.",
  },
  {
    id: "5",
    name: "ESP32 Development Board",
    price: 8.99,
    rating: 4.5,
    image: "/ESP32 Development Board.png",
    category: "Microcontrollers",
    description: "ESP32 development board with WiFi and Bluetooth capabilities, perfect for IoT projects.",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Filter products based on search query
  const results = query
    ? mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">Search Results</span>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
        <p className="text-gray-500 mb-8">{results.length} products found</p>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                rating={product.rating}
                image={product.image}
                category={product.category}
                description={product.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-gray-500"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">Try a different search term or browse our categories.</p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

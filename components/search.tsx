"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"

// Mock product data for search
const mockProducts = [
  { id: "1", name: "Arduino Uno R3 Microcontroller", category: "Microcontrollers" },
  { id: "2", name: "Raspberry Pi 4 Model B - 4GB", category: "Microcontrollers" },
  { id: "3", name: "Soldering Station Kit - Digital", category: "Tools" },
  { id: "4", name: "Ultrasonic Distance Sensor Pack", category: "Sensors" },
  { id: "5", name: "ESP32 Development Board", category: "Microcontrollers" },
  { id: "6", name: "Temperature & Humidity Sensor", category: "Sensors" },
  { id: "7", name: "Beginner Electronics Kit", category: "Kits" },
  { id: "8", name: "OLED Display Module", category: "Components" },
  { id: "9", name: "Digital Multimeter Pro", category: "Tools" },
  { id: "10", name: "Wireless IoT Sensor Kit", category: "Kits" },
]

export default function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  const handleResultClick = (id: string) => {
    const slug = mockProducts
      .find((p) => p.id === id)
      ?.name.toLowerCase()
      .replace(/\s+/g, "-")
    router.push(`/product/${slug}`)
    setIsOpen(false)
    setQuery("")
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full pl-8 rounded-full border-violet-100 focus-visible:ring-violet-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg border shadow-lg z-50">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 px-3 py-2">Search Results</h3>
            <ul className="max-h-[300px] overflow-auto">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-violet-50 rounded-md flex items-center justify-between"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <span>{result.name}</span>
                    <span className="text-xs text-gray-500">{result.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full text-violet-600 hover:bg-violet-50 hover:text-violet-700"
              onClick={handleSearch}
            >
              View all results
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

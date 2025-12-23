"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, SlidersHorizontal } from "lucide-react"
import ProductCard from "@/components/product-card"

// Mock products data - in a real app, you would fetch this based on the category
const allProducts = [
  {
    id: "1",
    name: "Ultra Slim Laptop Pro",
    price: 1299.99,
    rating: 4.8,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "Apple",
    processor: "Intel Core i7",
    ram: "16GB",
  },
  {
    id: "2",
    name: "Business Laptop Elite",
    price: 1499.99,
    rating: 4.7,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "Dell",
    processor: "Intel Core i5",
    ram: "8GB",
  },
  {
    id: "3",
    name: "Gaming Laptop Extreme",
    price: 1899.99,
    rating: 4.9,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "Asus",
    processor: "AMD Ryzen 7",
    ram: "32GB",
  },
  {
    id: "4",
    name: "Student Laptop Basic",
    price: 699.99,
    rating: 4.5,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "HP",
    processor: "Intel Core i5",
    ram: "8GB",
  },
  {
    id: "5",
    name: "Convertible 2-in-1 Laptop",
    price: 999.99,
    rating: 4.6,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "Lenovo",
    processor: "Intel Core i7",
    ram: "16GB",
  },
  {
    id: "6",
    name: "Ultrabook Pro",
    price: 1199.99,
    rating: 4.7,
    image: "/products/laptop.svg",
    category: "Laptops",
    brand: "Apple",
    processor: "Intel Core i7",
    ram: "16GB",
  },
]

// Microcontroller products
const microcontrollerProducts = [
  {
    id: "mc1",
    name: "Arduino Uno R3",
    price: 24.99,
    rating: 4.8,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Arduino",
    processor: "ATmega328P",
    ram: "2KB",
  },
  {
    id: "mc2",
    name: "Raspberry Pi 4 - 4GB",
    price: 59.99,
    rating: 4.9,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Raspberry Pi",
    processor: "Broadcom BCM2711",
    ram: "4GB",
  },
  {
    id: "mc3",
    name: "ESP32 Development Board",
    price: 8.99,
    rating: 4.7,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Espressif",
    processor: "Tensilica Xtensa LX6",
    ram: "520KB",
  },
  {
    id: "mc4",
    name: "Arduino Nano",
    price: 12.99,
    rating: 4.6,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Arduino",
    processor: "ATmega328P",
    ram: "2KB",
  },
  {
    id: "mc5",
    name: "Raspberry Pi Pico",
    price: 4.99,
    rating: 4.5,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Raspberry Pi",
    processor: "RP2040",
    ram: "264KB",
  },
  {
    id: "mc6",
    name: "ESP8266 NodeMCU",
    price: 6.99,
    rating: 4.4,
    image: "/products/microcontroller.svg",
    category: "Microcontrollers",
    brand: "Espressif",
    processor: "Tensilica L106",
    ram: "160KB",
  },
]

// Sensor products
const sensorProducts = [
  {
    id: "s1",
    name: "DHT22 Temperature & Humidity Sensor",
    price: 4.99,
    rating: 4.6,
    image: "/products/sensor.svg",
    category: "Sensors",
    brand: "Generic",
    type: "Temperature",
  },
  {
    id: "s2",
    name: "HC-SR04 Ultrasonic Distance Sensor",
    price: 2.99,
    rating: 4.5,
    image: "/products/sensor.svg",
    category: "Sensors",
    brand: "Generic",
    type: "Distance",
  },
  {
    id: "s3",
    name: "PIR Motion Sensor",
    price: 3.99,
    rating: 4.4,
    image: "/products/sensor.svg",
    category: "Sensors",
    brand: "Generic",
    type: "Motion",
  },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([])
  const [selectedRam, setSelectedRam] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [originalProducts, setOriginalProducts] = useState<any[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get the appropriate products based on category
  useEffect(() => {
    let products
    switch (params.slug.toLowerCase()) {
      case "microcontrollers":
        products = microcontrollerProducts
        break
      case "sensors":
        products = sensorProducts
        break
      default:
        products = allProducts
    }
    setOriginalProducts(products)
    setFilteredProducts(products)
  }, [params.slug])

  // Handle brand checkbox change
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Handle processor checkbox change
  const handleProcessorChange = (processor: string) => {
    if (selectedProcessors.includes(processor)) {
      setSelectedProcessors(selectedProcessors.filter((p) => p !== processor))
    } else {
      setSelectedProcessors([...selectedProcessors, processor])
    }
  }

  // Handle RAM checkbox change
  const handleRamChange = (ram: string) => {
    if (selectedRam.includes(ram)) {
      setSelectedRam(selectedRam.filter((r) => r !== ram))
    } else {
      setSelectedRam([...selectedRam, ram])
    }
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(value)
  }

  // Apply filters
  const applyFilters = (currentSortBy = sortBy) => {
    let filtered = [...originalProducts]

    // Filter by price
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
    }

    // Filter by processor
    if (selectedProcessors.length > 0) {
      filtered = filtered.filter((product) => selectedProcessors.includes(product.processor))
    }

    // Filter by RAM
    if (selectedRam.length > 0) {
      filtered = filtered.filter((product) => selectedRam.includes(product.ram))
    }

    // Sort products
    switch (currentSortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      // 'featured' is default, no sorting needed
    }

    setFilteredProducts(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 2000])
    setSelectedBrands([])
    setSelectedProcessors([])
    setSelectedRam([])
    setSortBy("featured")
    setFilteredProducts(originalProducts)
  }

  // Get unique brands for the current category
  const getUniqueBrands = () => {
    return [...new Set(originalProducts.map((product) => product.brand))]
  }

  // Get unique processors for the current category
  const getUniqueProcessors = () => {
    return [...new Set(originalProducts.map((product) => product.processor).filter(Boolean))]
  }

  // Get unique RAM options for the current category
  const getUniqueRam = () => {
    return [...new Set(originalProducts.map((product) => product.ram).filter(Boolean))]
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 shrink-0 ${isFilterOpen ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="sm" className="h-8 text-sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={2000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-20 h-8"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-20 h-8"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {getUniqueBrands().map((brand, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${index}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandChange(brand)}
                      />
                      <label
                        htmlFor={`brand-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {params.slug.toLowerCase() !== "sensors" && getUniqueProcessors().length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Processor</h3>
                  <div className="space-y-2">
                    {getUniqueProcessors().map((processor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`processor-${index}`}
                          checked={selectedProcessors.includes(processor)}
                          onCheckedChange={() => handleProcessorChange(processor)}
                        />
                        <label
                          htmlFor={`processor-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {processor}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {params.slug.toLowerCase() !== "sensors" && getUniqueRam().length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">RAM</h3>
                  <div className="space-y-2">
                    {getUniqueRam().map((ram, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ram-${index}`}
                          checked={selectedRam.includes(ram)}
                          onCheckedChange={() => handleRamChange(ram)}
                        />
                        <label
                          htmlFor={`ram-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {ram}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <Button className="w-full" onClick={() => applyFilters()}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold">{categoryName}</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </Button>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    image={product.image}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products match your filters. Try adjusting your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}

            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

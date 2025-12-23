"use client"

import { Input } from "@/components/ui/input"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, ArrowRight, ShoppingCart, Heart } from "lucide-react"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import CartDropdown from "@/components/cart-dropdown"
import WishlistDropdown from "@/components/wishlist-dropdown"
import ProductShowcase from "@/components/product-showcase"
import ProductBanner from "@/components/product-banner"
import Search from "@/components/search"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import PromotionsBanner from "@/components/promotions-banner"
import DiscountedProducts from "@/components/discounted-products"

export default function Home() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)

  const handleAddToCart = (id: string, name: string, price: number, image: string) => {
    addItem({
      id: id,
      name: name,
      price: price,
      image: image,
    })

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      duration: 2000,
    })
  }

  // Featured products data
  const featuredProducts = [
    {
      id: "featured-1",
      name: "Arduino Starter Kit",
      price: 49.99,
      originalPrice: 69.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1589595997281-5f9e3001b942?w=500&h=500&fit=crop",
      description: "Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners",
    },
    {
      id: "featured-2",
      name: "Raspberry Pi 4 - 4GB",
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1591290619266-89da8b0f9743?w=500&h=500&fit=crop",
      description: "The latest Raspberry Pi with 4GB RAM, perfect for desktop computing and IoT projects",
    },
    {
      id: "featured-3",
      name: "Electronics Learning Lab",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1580126579312-94651dfd596d?w=500&h=500&fit=crop",
      description: "Comprehensive electronics learning kit with 100+ projects and detailed instruction manual",
    },
  ]

  // Popular products data - page 1
  const popularProductsPage1 = [
    {
      id: "1",
      name: "Arduino Uno R3 Microcontroller",
      price: 24.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1596994306875-60c4aeb7e7b8?w=500&h=500&fit=crop",
      category: "Microcontrollers",
      description:
        "The Arduino Uno R3 is the most used and documented board in the Arduino family, perfect for beginners and experienced makers.",
    },
    {
      id: "2",
      name: "Raspberry Pi 4 Model B - 4GB",
      price: 45.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1581092162562-40038f56c40d?w=500&h=500&fit=crop",
      category: "Microcontrollers",
      description:
        "The Raspberry Pi 4 Model B with 4GB RAM offers desktop-like performance for a wide range of applications and projects.",
    },
    {
      id: "3",
      name: "Soldering Station Kit - Digital",
      price: 79.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1581092165854-40129fb4b04f?w=500&h=500&fit=crop",
      category: "Tools",
      description:
        "Professional digital soldering station with adjustable temperature control, multiple tips, and accessories for precision work.",
    },
    {
      id: "4",
      name: "Ultrasonic Distance Sensor Pack",
      price: 12.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1581092160562-40038f56c40d?w=500&h=500&fit=crop",
      category: "Sensors",
      description:
        "Pack of 5 HC-SR04 ultrasonic distance sensors for measuring distances in your robotics and automation projects.",
    },
  ]

  // Popular products data - page 2
  const popularProductsPage2 = [
    {
      id: "5",
      name: "ESP32 Development Board",
      price: 8.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop",
      category: "Microcontrollers",
      description: "ESP32 development board with WiFi and Bluetooth capabilities, perfect for IoT projects.",
    },
    {
      id: "6",
      name: "Temperature & Humidity Sensor",
      price: 4.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1581092157544-8ac2b57ba21d?w=500&h=500&fit=crop",
      category: "Sensors",
      description: "DHT22 temperature and humidity sensor for environmental monitoring projects.",
    },
    {
      id: "7",
      name: "Beginner Electronics Kit",
      price: 34.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1580126579312-94651dfd596d?w=500&h=500&fit=crop",
      category: "Kits",
      description: "Complete electronics starter kit with breadboard, components, and project guide.",
    },
    {
      id: "8",
      name: "Digital Multimeter",
      price: 19.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1581092165854-40129fb4b04f?w=500&h=500&fit=crop",
      category: "Tools",
      description: "Digital multimeter for measuring voltage, current, resistance, and more.",
    },
  ]

  // Popular products data - page 3
  const popularProductsPage3 = [
    {
      id: "9",
      name: "OLED Display Module",
      price: 8.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1581092160559-112debad63ca?w=500&h=500&fit=crop",
      category: "Components",
      description: "0.96-inch OLED display module with 128x64 resolution and I2C interface.",
    },
    {
      id: "10",
      name: "Servo Motor Pack",
      price: 14.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1581092165854-40129fb4b04f?w=500&h=500&fit=crop",
      category: "Components",
      description: "Pack of 5 micro servo motors for robotics and automation projects.",
    },
    {
      id: "11",
      name: "Wireless IoT Sensor Kit",
      price: 49.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1580126579312-94651dfd596d?w=500&h=500&fit=crop",
      category: "Kits",
      description: "Complete wireless IoT sensor kit with temperature, humidity, motion, and light sensors.",
    },
    {
      id: "12",
      name: "Breadboard Kit",
      price: 9.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1581092160562-40038f56c40d?w=500&h=500&fit=crop",
      category: "Components",
      description: "Breadboard kit with jumper wires and power supply module.",
    },
  ]

  // Get current page products
  const getCurrentPageProducts = () => {
    switch (currentPage) {
      case 1:
        return popularProductsPage1
      case 2:
        return popularProductsPage2
      case 3:
        return popularProductsPage3
      default:
        return popularProductsPage1
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      {/* Promotions Banner */}
      <PromotionsBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                EG
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                EG Electronics
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-10">
            <Link href="/category/microcontrollers" className="transition-colors hover:text-violet-600">
              Microcontrollers
            </Link>
            <Link href="/category/sensors" className="transition-colors hover:text-violet-600">
              Sensors
            </Link>
            <Link href="/category/kits" className="transition-colors hover:text-violet-600">
              Kits
            </Link>
            <Link href="/category/components" className="transition-colors hover:text-violet-600">
              Components
            </Link>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <div className="relative hidden md:flex items-center w-[300px] ml-4">
              <Search />
            </div>
            <WishlistDropdown />
            <CartDropdown />
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
                >
                  <Heart className="h-4 w-4" />
                  My Wishlist
                </Button>
              </Link>
              <Link href="/login">
                <Button className="hidden md:flex bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12 relative">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-4 w-fit">
                <span className="font-medium">Quality Electronics</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                    Build Your Next
                  </span>{" "}
                  Electronics Project
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Quality microcontrollers, sensors, and components for makers, hobbyists, and professionals. Free
                  shipping on orders over $50.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                  asChild
                >
                  <Link href="/category/all">Shop Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50"
                  asChild
                >
                  <Link href="/category/kits">View Kits</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg h-[400px] overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&h=600&fit=crop"
                  alt="Electronics Workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white text-xl font-bold">Professional Quality</h3>
                  <p className="text-white/80 text-sm mt-1">Components for makers and professionals alike</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discounted Products Section */}
      <DiscountedProducts />

      {/* Featured Products Section */}
      <ProductShowcase
        title="Best Sellers"
        subtitle="Our most popular products, loved by makers worldwide"
        badge="Featured Products"
        products={featuredProducts}
        viewAllLink="/category/featured"
        viewAllText="View All Featured Products"
      />

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-violet-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2 w-fit mx-auto">
                <span className="font-medium">Browse Categories</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Find What You Need</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Browse our wide selection of electronic components and tools
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
            <CategoryCard name="Microcontrollers" icon="chip" />
            <CategoryCard name="Sensors" icon="activity" />
            <CategoryCard name="Kits" icon="package" />
            <CategoryCard name="Components" icon="cpu" />
          </div>
        </div>
      </section>

      {/* Product Banner */}
      <ProductBanner
        title="Raspberry Pi 5"
        subtitle="New Release - Limited Stock"
        description="The most powerful Raspberry Pi yet. With a quad-core processor, up to 8GB RAM, and improved I/O performance, it's perfect for desktop computing, IoT projects, and more."
        image="https://images.unsplash.com/photo-1601049676869-9bf269d8dfc8?w=800&h=600&fit=crop"
        badge="New Arrival"
        buttonText="Shop Now"
        buttonLink="/product/raspberry-pi-5"
        product={{
          id: "raspberry-pi-5",
          name: "Raspberry Pi 5 - 8GB",
          price: 79.99,
          image: "https://images.unsplash.com/photo-1601049676869-9bf269d8dfc8?w=300&h=300&fit=crop",
        }}
      />

      {/* New Arrivals Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2">
                <span className="font-medium">Just Arrived</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">New Arrivals</h2>
            </div>
            <Button
              variant="outline"
              className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group hidden md:flex"
              asChild
            >
              <Link href="/category/new">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard
              id="new-1"
              name="ESP32-CAM WiFi Module"
              price={12.99}
              rating={4.7}
              image="https://images.unsplash.com/photo-1563126442-a5ef6e395f6d?w=300&h=300&fit=crop"
              category="Microcontrollers"
              description="ESP32-CAM WiFi + Bluetooth module with integrated camera, perfect for IoT projects requiring visual capabilities."
            />
            <ProductCard
              id="new-2"
              name="OLED Display Module"
              price={8.99}
              rating={4.5}
              image="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=300&h=300&fit=crop"
              category="Components"
              description="0.96-inch OLED display module with 128x64 resolution, I2C interface, and vibrant blue text display."
            />
            <ProductCard
              id="new-3"
              name="Digital Multimeter Pro"
              price={34.99}
              rating={4.8}
              image="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop"
              category="Tools"
              description="Professional digital multimeter with auto-ranging capability, measuring voltage, current, resistance, and more."
            />
            <ProductCard
              id="new-4"
              name="Wireless IoT Sensor Kit"
              price={49.99}
              rating={4.6}
              image="https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=300&h=300&fit=crop"
              category="Kits"
              description="Complete wireless IoT sensor kit with temperature, humidity, motion, and light sensors plus WiFi connectivity."
            />
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Button
              variant="outline"
              className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
              asChild
            >
              <Link href="/category/new">
                View All New Arrivals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-violet-50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2">
                <span className="font-medium">Top Picks</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Popular Products</h2>
            </div>
            <Button
              variant="outline"
              className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group hidden md:flex"
              asChild
            >
              <Link href="/category/popular">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getCurrentPageProducts().map((product) => (
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

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 ${currentPage === 1 ? "bg-violet-600" : ""}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </Button>
              <Button
                variant={currentPage === 2 ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 ${currentPage === 2 ? "bg-violet-600" : ""}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </Button>
              <Button
                variant={currentPage === 3 ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 ${currentPage === 3 ? "bg-violet-600" : ""}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${currentPage === 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => currentPage < 3 && setCurrentPage(currentPage + 1)}
                disabled={currentPage === 3}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Button
              variant="outline"
              className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
              asChild
            >
              <Link href="/category/popular">
                View All Popular Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-white">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2 w-fit mx-auto">
                <span className="font-medium">Limited Time</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Today's Deals</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Limited-time offers on top electronics
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="relative group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                -20%
              </div>
              <div className="flex justify-center p-6 pb-0">
                <img
                  src="https://images.unsplash.com/photo-1563126442-a5ef6e395f6d?w=200&h=200&fit=crop"
                  alt="ESP32 Development Board"
                  className="h-[200px] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">ESP32 Development Board</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                    $8.99
                  </span>
                  <span className="text-sm text-gray-500 line-through">$11.99</span>
                </div>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                  onClick={() =>
                    handleAddToCart(
                      "esp32",
                      "ESP32 Development Board",
                      8.99,
                      "https://images.unsplash.com/photo-1563126442-a5ef6e395f6d?w=200&h=200&fit=crop",
                    )
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                -15%
              </div>
              <div className="flex justify-center p-6 pb-0">
                <img
                  src="https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=200&h=200&fit=crop"
                  alt="Temperature & Humidity Sensor"
                  className="h-[200px] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">Temperature & Humidity Sensor</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                    $4.99
                  </span>
                  <span className="text-sm text-gray-500 line-through">$5.99</span>
                </div>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                  onClick={() =>
                    handleAddToCart(
                      "temp-sensor",
                      "Temperature & Humidity Sensor",
                      4.99,
                      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=200&h=200&fit=crop",
                    )
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                -30%
              </div>
              <div className="flex justify-center p-6 pb-0">
                <img
                  src="https://images.unsplash.com/photo-1623949556303-b0d17c371ca0?w=200&h=200&fit=crop"
                  alt="Beginner Electronics Kit"
                  className="h-[200px] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">Beginner Electronics Kit</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                    $34.99
                  </span>
                  <span className="text-sm text-gray-500 line-through">$49.99</span>
                </div>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                  onClick={() =>
                    handleAddToCart(
                      "beginner-kit",
                      "Beginner Electronics Kit",
                      34.99,
                      "https://images.unsplash.com/photo-1623949556303-b0d17c371ca0?w=200&h=200&fit=crop",
                    )
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Ideas Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2 w-fit mx-auto">
                <span className="font-medium">Get Inspired</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Project Ideas</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Check out these cool projects you can build with our components
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500&h=300&fit=crop"
                  alt="Smart Home Automation"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors">
                  Smart Home Automation
                </h3>
                <p className="text-gray-500 mb-4">
                  Build a system to control lights, temperature, and appliances using Arduino and sensors.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
                >
                  View Project
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=500&h=300&fit=crop"
                  alt="Weather Station"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors">
                  DIY Weather Station
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your own weather monitoring system with temperature, humidity, and pressure sensors.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
                >
                  View Project
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-violet-100 shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop"
                  alt="Robot Kit"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 transition-colors">
                  Line Following Robot
                </h3>
                <p className="text-gray-500 mb-4">
                  Build a robot that can follow lines using infrared sensors and motor controllers.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
                >
                  View Project
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Stay Updated</h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                Subscribe to our newsletter for the latest products, project ideas, and exclusive deals
              </p>
            </div>
            <div className="w-full space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit" className="bg-white text-violet-600 hover:bg-white/90">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs opacity-70">By subscribing, you agree to our terms and privacy policy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 md:py-24 bg-gradient-to-r from-violet-900 to-indigo-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">
                  EG
                </div>
                <span className="text-xl font-bold tracking-tight">EG Electronics</span>
              </div>
              <p className="text-sm text-white/80">
                Your one-stop shop for electronic components, microcontrollers, and maker supplies.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-white">
                  <span className="sr-only">Facebook</span>
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
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white">
                  <span className="sr-only">Twitter</span>
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white">
                  <span className="sr-only">Instagram</span>
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
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/category/microcontrollers" className="text-white/80 hover:text-white">
                    Microcontrollers
                  </Link>
                </li>
                <li>
                  <Link href="/category/sensors" className="text-white/80 hover:text-white">
                    Sensors
                  </Link>
                </li>
                <li>
                  <Link href="/category/kits" className="text-white/80 hover:text-white">
                    Kits
                  </Link>
                </li>
                <li>
                  <Link href="/category/components" className="text-white/80 hover:text-white">
                    Components
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Affiliates
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
            <p className="text-sm text-white/60">© 2024 EG Electronics. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-white/80 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-white/80 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-white/80 hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating buttons for cart and wishlist */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center gap-2 px-6"
          asChild
        >
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            View Cart & Checkout
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full shadow-lg border-violet-200 bg-white text-violet-600 hover:bg-violet-50 flex items-center gap-2 px-6"
          asChild
        >
          <Link href="/wishlist">
            <Heart className="h-5 w-5" />
            View Wishlist
          </Link>
        </Button>
      </div>
    </div>
  )
}

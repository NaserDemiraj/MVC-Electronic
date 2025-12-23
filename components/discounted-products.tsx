"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import ProductCard from "@/components/product-card"

interface DiscountedProductsProps {
  title?: string
  subtitle?: string
  badge?: string
  viewAllLink?: string
  limit?: number
}

export default function DiscountedProducts({
  title = "Special Offers",
  subtitle = "Limited time deals on our best products",
  badge = "On Sale",
  viewAllLink = "/category/sale",
  limit = 4,
}: DiscountedProductsProps) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number }>(
    {
      days: 3,
      hours: 8,
      minutes: 45,
      seconds: 30,
    },
  )

  // Mock discounted products - using local images
  const discountedProducts = [
    {
      id: "1",
      name: "Arduino Starter Kit",
      price: 49.99,
      salePrice: 39.99,
      isOnSale: true,
      rating: 4.8,
      image: "/Arduino Starter Kit.webp",
      category: "Kits",
      description: "Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners",
    },
    {
      id: "2",
      name: "Raspberry Pi 4 - 4GB",
      price: 59.99,
      salePrice: 49.99,
      isOnSale: true,
      rating: 4.9,
      image: "/Raspberry Pi 4 - 4GB.jpg",
      category: "Microcontrollers",
      description: "The latest Raspberry Pi with 4GB RAM, perfect for desktop computing and IoT projects",
    },
    {
      id: "3",
      name: "Soldering Station Kit - Digital",
      price: 79.99,
      salePrice: 64.99,
      isOnSale: true,
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
      salePrice: 9.99,
      isOnSale: true,
      rating: 4.6,
      image: "/Ultrasonic Distance Sensor Pack.jpg",
      category: "Sensors",
      description:
        "Pack of 5 HC-SR04 ultrasonic distance sensors for measuring distances in your robotics and automation projects.",
    },
  ]

  // Update countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              } else {
                // Sale ended, reset to a new time
                days = 7
                hours = 0
                minutes = 0
                seconds = 0
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-b from-violet-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-sm text-violet-600 mb-2 w-fit mx-auto">
              <span className="font-medium">{badge}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{title}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-violet-100">
            <Clock className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium">Sale ends in:</span>
            <div className="flex items-center gap-1">
              <div className="bg-violet-100 text-violet-800 rounded-md px-2 py-1 text-sm font-mono">
                {timeRemaining.days.toString().padStart(2, "0")}
              </div>
              <span className="text-gray-500">:</span>
              <div className="bg-violet-100 text-violet-800 rounded-md px-2 py-1 text-sm font-mono">
                {timeRemaining.hours.toString().padStart(2, "0")}
              </div>
              <span className="text-gray-500">:</span>
              <div className="bg-violet-100 text-violet-800 rounded-md px-2 py-1 text-sm font-mono">
                {timeRemaining.minutes.toString().padStart(2, "0")}
              </div>
              <span className="text-gray-500">:</span>
              <div className="bg-violet-100 text-violet-800 rounded-md px-2 py-1 text-sm font-mono">
                {timeRemaining.seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.slice(0, limit).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              rating={product.rating}
              image={product.image}
              category={product.category}
              description={product.description}
              salePrice={product.salePrice}
              isOnSale={product.isOnSale}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="gap-1 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 group"
            asChild
          >
            <Link href={viewAllLink}>
              View All Deals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

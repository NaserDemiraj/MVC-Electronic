"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Clock, Tag } from "lucide-react"
import { usePathname } from "next/navigation"

interface Promotion {
  id: string
  name: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  startDate: string
  endDate: string
  code?: string
  link?: string
}

interface PromotionsBannerProps {
  promotions?: Promotion[]
}

export default function PromotionsBanner({ promotions: propPromotions }: PromotionsBannerProps) {
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number } | null>(null)
  const pathname = usePathname()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const promotionsRef = useRef(propPromotions)

  // Mock promotions data if none provided
  const mockPromotions: Promotion[] = [
    {
      id: "1",
      name: "Summer Sale",
      description: "Get 20% off on all products",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2023-06-01",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      link: "/category/all",
    },
    {
      id: "2",
      name: "Flash Sale",
      description: "Limited time offer - $10 off on orders over $50",
      discountType: "fixed",
      discountValue: 10,
      startDate: "2023-07-15",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      code: "FLASH10",
    },
  ]

  useEffect(() => {
    setPromotions(propPromotions || mockPromotions)
    promotionsRef.current = propPromotions
  }, [propPromotions])

  const shouldRender = !pathname.startsWith("/admin") && !dismissed && promotions.length > 0

  // Calculate time remaining
  useEffect(() => {
    if (!shouldRender) return

    const currentPromotion = promotions[currentPromotionIndex]

    if (!currentPromotion) {
      setTimeRemaining(null)
      return
    }

    const calculateTimeRemaining = () => {
      const now = new Date()
      const endDate = new Date(currentPromotion.endDate)
      const diffTime = endDate.getTime() - now.getTime()

      if (diffTime <= 0) {
        setTimeRemaining(null)
        return
      }

      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))

      setTimeRemaining({ days, hours, minutes })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [shouldRender, currentPromotionIndex, promotions])

  // Rotate through promotions every 5 seconds
  useEffect(() => {
    if (!shouldRender || promotions.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPromotionIndex((prevIndex) => (prevIndex + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [shouldRender, promotions.length])

  if (!shouldRender) {
    return null
  }

  const currentPromotion = promotions[currentPromotionIndex]

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm md:text-base">
          <Tag className="h-4 w-4" />
          <span className="font-medium">{currentPromotion.name}:</span>
          <span>{currentPromotion.description}</span>

          {currentPromotion.code && (
            <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-sm">{currentPromotion.code}</span>
          )}

          {timeRemaining && (
            <div className="hidden md:flex items-center space-x-1 bg-white/10 rounded-full px-2 py-0.5 text-xs">
              <Clock className="h-3 w-3" />
              <span>
                {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                {timeRemaining.hours}h {timeRemaining.minutes}m remaining
              </span>
            </div>
          )}

          {currentPromotion.link && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-white text-violet-600 hover:bg-white/90 hover:text-violet-700 border-none text-xs h-7"
              asChild
            >
              <Link href={currentPromotion.link}>Shop Now</Link>
            </Button>
          )}
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Dismiss promotion"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

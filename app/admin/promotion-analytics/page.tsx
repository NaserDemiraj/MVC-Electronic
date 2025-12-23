"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function PromotionAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [selectedPromotion, setSelectedPromotion] = useState("all")

  // Mock promotions data
  const promotions = [
    { id: "promo1", name: "Summer Sale", discount: "20% off", status: "active" },
    { id: "promo2", name: "Back to School", discount: "15% off", status: "scheduled" },
    { id: "promo3", name: "Holiday Special", discount: "25% off", status: "ended" },
    { id: "promo4", name: "Flash Sale", discount: "$10 off", status: "active" },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Promotion Analytics</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Label htmlFor="time-range">Time Range</Label>
          <select
            id="time-range"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <Label htmlFor="promotion">Promotion</Label>
          <select
            id="promotion"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedPromotion}
            onChange={(e) => setSelectedPromotion(e.target.value)}
          >
            <option value="all">All Promotions</option>
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12,543.00</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+12.5% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Using promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">432</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+8.2% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>For promotion views</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">24.3%</p>
            <p className="text-sm text-red-600 flex items-center mt-1">-2.1% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg. Order Value</CardTitle>
            <CardDescription>With promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$29.03</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+4.6% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Promotion Performance</CardTitle>
            <CardDescription>Revenue by promotion</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Revenue data visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promotion Usage Over Time</CardTitle>
            <CardDescription>Number of orders using promotions</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Usage trend visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Comparison</CardTitle>
          <CardDescription>Performance metrics across all promotions</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Table placeholder</p>
            <p className="text-sm">Detailed promotion comparison data would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

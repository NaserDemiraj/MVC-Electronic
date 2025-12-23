"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="w-full md:w-1/3 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>For selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$24,685.00</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+15.2% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">856</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+10.8% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customers</CardTitle>
            <CardDescription>Unique customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">432</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+7.3% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg. Order Value</CardTitle>
            <CardDescription>Revenue per order</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$28.84</p>
            <p className="text-sm text-green-600 flex items-center mt-1">+4.1% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Daily revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Revenue trend visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Product performance visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Category distribution visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
            <CardDescription>New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart placeholder</p>
              <p className="text-sm">Customer acquisition visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

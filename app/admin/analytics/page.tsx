"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"

// Data by time range
const dataByTimeRange = {
  "7days": {
    revenue: [
      { day: "Mon", value: 1200 },
      { day: "Tue", value: 980 },
      { day: "Wed", value: 1450 },
      { day: "Thu", value: 1320 },
      { day: "Fri", value: 1680 },
      { day: "Sat", value: 2100 },
      { day: "Sun", value: 1550 },
    ],
    topProducts: [
      { name: "Arduino Starter Kit", revenue: 980, sales: 18, growth: 8.2 },
      { name: "Raspberry Pi 4 - 4GB", revenue: 850, sales: 14, growth: 5.1 },
      { name: "ESP32 Development Board", revenue: 520, sales: 58, growth: 12.3 },
      { name: "Digital Multimeter", revenue: 430, sales: 10, growth: -1.5 },
      { name: "Soldering Station Kit", revenue: 360, sales: 5, growth: 3.2 },
    ],
    categories: [
      { name: "Microcontrollers", value: 30, revenue: 1820, orders: 42, color: "bg-violet-500" },
      { name: "Development Kits", value: 26, revenue: 1580, orders: 32, color: "bg-indigo-500" },
      { name: "Sensors & Modules", value: 20, revenue: 1210, orders: 56, color: "bg-blue-500" },
      { name: "Components", value: 13, revenue: 790, orders: 68, color: "bg-cyan-500" },
      { name: "Tools & Equipment", value: 8, revenue: 485, orders: 15, color: "bg-teal-500" },
      { name: "Cables & Accessories", value: 3, revenue: 180, orders: 19, color: "bg-emerald-500" },
    ],
    customers: [
      { period: "Day 1", new: 8, returning: 22 },
      { period: "Day 2", new: 12, returning: 28 },
      { period: "Day 3", new: 6, returning: 25 },
      { period: "Day 4", new: 15, returning: 31 },
      { period: "Day 5", new: 9, returning: 27 },
      { period: "Day 6", new: 18, returning: 35 },
      { period: "Day 7", new: 11, returning: 29 },
    ],
    stats: { totalRevenue: 10280, orders: 186, customers: 98, avgOrder: 55.27, revenueGrowth: 8.5, ordersGrowth: 6.2, customersGrowth: 4.1, avgOrderGrowth: 2.2 }
  },
  "30days": {
    revenue: [
      { day: "Week 1", value: 5400 },
      { day: "Week 2", value: 6200 },
      { day: "Week 3", value: 5800 },
      { day: "Week 4", value: 7100 },
    ],
    topProducts: [
      { name: "Arduino Starter Kit", revenue: 4520, sales: 90, growth: 12.5 },
      { name: "Raspberry Pi 4 - 4GB", revenue: 3890, sales: 65, growth: 8.2 },
      { name: "ESP32 Development Board", revenue: 2340, sales: 260, growth: 15.3 },
      { name: "Digital Multimeter", revenue: 1980, sales: 45, growth: -2.1 },
      { name: "Soldering Station Kit", revenue: 1650, sales: 22, growth: 5.8 },
    ],
    categories: [
      { name: "Microcontrollers", value: 32, revenue: 8420, orders: 186, color: "bg-violet-500" },
      { name: "Development Kits", value: 24, revenue: 6350, orders: 142, color: "bg-indigo-500" },
      { name: "Sensors & Modules", value: 19, revenue: 4890, orders: 234, color: "bg-blue-500" },
      { name: "Components", value: 14, revenue: 3620, orders: 312, color: "bg-cyan-500" },
      { name: "Tools & Equipment", value: 8, revenue: 2180, orders: 67, color: "bg-teal-500" },
      { name: "Cables & Accessories", value: 3, revenue: 780, orders: 89, color: "bg-emerald-500" },
    ],
    customers: [
      { period: "Week 1", new: 45, returning: 120 },
      { period: "Week 2", new: 52, returning: 135 },
      { period: "Week 3", new: 48, returning: 142 },
      { period: "Week 4", new: 55, returning: 165 },
    ],
    stats: { totalRevenue: 24685, orders: 856, customers: 432, avgOrder: 28.84, revenueGrowth: 15.2, ordersGrowth: 10.8, customersGrowth: 7.3, avgOrderGrowth: 4.1 }
  },
  "90days": {
    revenue: [
      { day: "Month 1", value: 18500 },
      { day: "Month 2", value: 22300 },
      { day: "Month 3", value: 26800 },
    ],
    topProducts: [
      { name: "Arduino Starter Kit", revenue: 12850, sales: 256, growth: 18.2 },
      { name: "Raspberry Pi 4 - 4GB", revenue: 10920, sales: 182, growth: 14.5 },
      { name: "ESP32 Development Board", revenue: 7560, sales: 840, growth: 22.1 },
      { name: "Digital Multimeter", revenue: 5430, sales: 124, growth: 3.8 },
      { name: "Soldering Station Kit", revenue: 4680, sales: 62, growth: 9.4 },
    ],
    categories: [
      { name: "Microcontrollers", value: 34, revenue: 22980, orders: 508, color: "bg-violet-500" },
      { name: "Development Kits", value: 25, revenue: 16890, orders: 378, color: "bg-indigo-500" },
      { name: "Sensors & Modules", value: 18, revenue: 12160, orders: 582, color: "bg-blue-500" },
      { name: "Components", value: 13, revenue: 8780, orders: 756, color: "bg-cyan-500" },
      { name: "Tools & Equipment", value: 7, revenue: 4730, orders: 145, color: "bg-teal-500" },
      { name: "Cables & Accessories", value: 3, revenue: 2060, orders: 198, color: "bg-emerald-500" },
    ],
    customers: [
      { period: "Month 1", new: 142, returning: 385 },
      { period: "Month 2", new: 168, returning: 442 },
      { period: "Month 3", new: 195, returning: 510 },
    ],
    stats: { totalRevenue: 67600, orders: 2340, customers: 1180, avgOrder: 28.89, revenueGrowth: 22.4, ordersGrowth: 18.6, customersGrowth: 15.2, avgOrderGrowth: 3.2 }
  },
  "year": {
    revenue: [
      { day: "Jan", value: 15200 },
      { day: "Feb", value: 13800 },
      { day: "Mar", value: 18500 },
      { day: "Apr", value: 16900 },
      { day: "May", value: 21200 },
      { day: "Jun", value: 19800 },
      { day: "Jul", value: 24500 },
      { day: "Aug", value: 22100 },
      { day: "Sep", value: 26800 },
      { day: "Oct", value: 28500 },
      { day: "Nov", value: 32100 },
      { day: "Dec", value: 35600 },
    ],
    topProducts: [
      { name: "Arduino Starter Kit", revenue: 48520, sales: 970, growth: 28.5 },
      { name: "Raspberry Pi 4 - 4GB", revenue: 42890, sales: 715, growth: 22.8 },
      { name: "ESP32 Development Board", revenue: 31240, sales: 3470, growth: 35.2 },
      { name: "Digital Multimeter", revenue: 21980, sales: 502, growth: 12.4 },
      { name: "Soldering Station Kit", revenue: 18650, sales: 248, growth: 15.6 },
    ],
    categories: [
      { name: "Microcontrollers", value: 35, revenue: 91420, orders: 2018, color: "bg-violet-500" },
      { name: "Development Kits", value: 26, revenue: 67860, orders: 1518, color: "bg-indigo-500" },
      { name: "Sensors & Modules", value: 17, revenue: 44380, orders: 2124, color: "bg-blue-500" },
      { name: "Components", value: 12, revenue: 31320, orders: 2698, color: "bg-cyan-500" },
      { name: "Tools & Equipment", value: 7, revenue: 18280, orders: 556, color: "bg-teal-500" },
      { name: "Cables & Accessories", value: 3, revenue: 7840, orders: 712, color: "bg-emerald-500" },
    ],
    customers: [
      { period: "Q1", new: 420, returning: 1150 },
      { period: "Q2", new: 485, returning: 1320 },
      { period: "Q3", new: 552, returning: 1480 },
      { period: "Q4", new: 628, returning: 1650 },
    ],
    stats: { totalRevenue: 275000, orders: 9520, customers: 4820, avgOrder: 28.89, revenueGrowth: 32.5, ordersGrowth: 28.2, customersGrowth: 24.8, avgOrderGrowth: 3.4 }
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  const currentData = useMemo(() => dataByTimeRange[timeRange as keyof typeof dataByTimeRange], [timeRange])
  const maxRevenue = Math.max(...currentData.revenue.map(d => d.value))
  const maxCustomer = Math.max(...currentData.customers.map(d => d.new + d.returning))

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
            <p className="text-3xl font-bold">${currentData.stats.totalRevenue.toLocaleString()}</p>
            <p className={`text-sm flex items-center mt-1 ${currentData.stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentData.stats.revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {currentData.stats.revenueGrowth >= 0 ? '+' : ''}{currentData.stats.revenueGrowth}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentData.stats.orders.toLocaleString()}</p>
            <p className={`text-sm flex items-center mt-1 ${currentData.stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentData.stats.ordersGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {currentData.stats.ordersGrowth >= 0 ? '+' : ''}{currentData.stats.ordersGrowth}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customers</CardTitle>
            <CardDescription>Unique customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentData.stats.customers.toLocaleString()}</p>
            <p className={`text-sm flex items-center mt-1 ${currentData.stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentData.stats.customersGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {currentData.stats.customersGrowth >= 0 ? '+' : ''}{currentData.stats.customersGrowth}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg. Order Value</CardTitle>
            <CardDescription>Revenue per order</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${currentData.stats.avgOrder.toFixed(2)}</p>
            <p className={`text-sm flex items-center mt-1 ${currentData.stats.avgOrderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentData.stats.avgOrderGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {currentData.stats.avgOrderGrowth >= 0 ? '+' : ''}{currentData.stats.avgOrderGrowth}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {currentData.revenue.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">${(item.value / 1000).toFixed(1)}k</span>
                    <div 
                      className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md transition-all hover:from-violet-700 hover:to-violet-500"
                      style={{ height: `${(item.value / maxRevenue) * 180}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-5">{index + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                    <p className={`text-xs flex items-center justify-end ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.categories.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{item.orders} orders</span>
                      <span className="text-sm font-semibold">${item.revenue.toLocaleString()}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.value}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-bold">${currentData.categories.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
            <CardDescription>New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-sm">New Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-300" />
                <span className="text-sm">Returning Customers</span>
              </div>
            </div>
            <div className="h-52 flex items-end justify-between gap-3">
              {currentData.customers.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-300 rounded-t-sm"
                      style={{ height: `${(item.returning / maxCustomer) * 160}px` }}
                    />
                    <div 
                      className="w-full bg-violet-500"
                      style={{ height: `${(item.new / maxCustomer) * 160}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.period}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

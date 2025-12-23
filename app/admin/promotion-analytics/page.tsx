"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, TrendingUp, TrendingDown, Tag, Percent, ShoppingCart, DollarSign } from "lucide-react"

// Data by time range
const promotionDataByTimeRange = {
  "7days": {
    promotions: [
      { id: "promo1", name: "Summer Sale", discount: "20% off", status: "active", revenue: 1250, orders: 42, conversion: 24.8 },
      { id: "promo2", name: "Back to School", discount: "15% off", status: "scheduled", revenue: 0, orders: 0, conversion: 0 },
      { id: "promo3", name: "Holiday Special", discount: "25% off", status: "ended", revenue: 0, orders: 0, conversion: 0 },
      { id: "promo4", name: "Flash Sale", discount: "$10 off", status: "active", revenue: 485, orders: 18, conversion: 16.2 },
      { id: "promo5", name: "Weekend Deal", discount: "30% off", status: "active", revenue: 892, orders: 31, conversion: 22.1 },
    ],
    usage: [
      { period: "Mon", orders: 8 },
      { period: "Tue", orders: 12 },
      { period: "Wed", orders: 9 },
      { period: "Thu", orders: 14 },
      { period: "Fri", orders: 11 },
      { period: "Sat", orders: 22 },
      { period: "Sun", orders: 18 },
    ],
    stats: { totalRevenue: 2627, orders: 91, conversion: 21.5, avgOrder: 28.87, revenueGrowth: 5.2, ordersGrowth: 3.8, conversionGrowth: -1.2, avgOrderGrowth: 1.4 }
  },
  "30days": {
    promotions: [
      { id: "promo1", name: "Summer Sale", discount: "20% off", status: "active", revenue: 5840, orders: 186, conversion: 31.2 },
      { id: "promo2", name: "Back to School", discount: "15% off", status: "scheduled", revenue: 0, orders: 0, conversion: 0 },
      { id: "promo3", name: "Holiday Special", discount: "25% off", status: "ended", revenue: 4120, orders: 142, conversion: 27.8 },
      { id: "promo4", name: "Flash Sale", discount: "$10 off", status: "active", revenue: 2350, orders: 78, conversion: 18.5 },
      { id: "promo5", name: "Weekend Deal", discount: "30% off", status: "active", revenue: 3680, orders: 124, conversion: 25.4 },
    ],
    usage: [
      { period: "Week 1", orders: 95 },
      { period: "Week 2", orders: 128 },
      { period: "Week 3", orders: 142 },
      { period: "Week 4", orders: 165 },
    ],
    stats: { totalRevenue: 15990, orders: 530, conversion: 25.7, avgOrder: 30.17, revenueGrowth: 12.5, ordersGrowth: 8.2, conversionGrowth: -2.1, avgOrderGrowth: 4.6 }
  },
  "90days": {
    promotions: [
      { id: "promo1", name: "Summer Sale", discount: "20% off", status: "active", revenue: 18450, orders: 585, conversion: 33.6 },
      { id: "promo2", name: "Back to School", discount: "15% off", status: "scheduled", revenue: 6820, orders: 248, conversion: 24.2 },
      { id: "promo3", name: "Holiday Special", discount: "25% off", status: "ended", revenue: 12680, orders: 412, conversion: 29.4 },
      { id: "promo4", name: "Flash Sale", discount: "$10 off", status: "active", revenue: 7240, orders: 238, conversion: 20.8 },
      { id: "promo5", name: "Weekend Deal", discount: "30% off", status: "active", revenue: 9890, orders: 342, conversion: 26.9 },
    ],
    usage: [
      { period: "Month 1", orders: 485 },
      { period: "Month 2", orders: 612 },
      { period: "Month 3", orders: 728 },
    ],
    stats: { totalRevenue: 55080, orders: 1825, conversion: 26.8, avgOrder: 30.18, revenueGrowth: 18.4, ordersGrowth: 15.2, conversionGrowth: 1.8, avgOrderGrowth: 2.8 }
  },
  "year": {
    promotions: [
      { id: "promo1", name: "Summer Sale", discount: "20% off", status: "active", revenue: 72450, orders: 2285, conversion: 35.2 },
      { id: "promo2", name: "Back to School", discount: "15% off", status: "scheduled", revenue: 38920, orders: 1456, conversion: 26.8 },
      { id: "promo3", name: "Holiday Special", discount: "25% off", status: "ended", revenue: 58640, orders: 1892, conversion: 31.5 },
      { id: "promo4", name: "Flash Sale", discount: "$10 off", status: "active", revenue: 28750, orders: 945, conversion: 22.1 },
      { id: "promo5", name: "Weekend Deal", discount: "30% off", status: "active", revenue: 42180, orders: 1428, conversion: 28.4 },
    ],
    usage: [
      { period: "Q1", orders: 1645 },
      { period: "Q2", orders: 1920 },
      { period: "Q3", orders: 2180 },
      { period: "Q4", orders: 2561 },
    ],
    stats: { totalRevenue: 240940, orders: 8006, conversion: 28.5, avgOrder: 30.09, revenueGrowth: 28.6, ordersGrowth: 24.8, conversionGrowth: 4.2, avgOrderGrowth: 3.1 }
  }
}

export default function PromotionAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [selectedPromotion, setSelectedPromotion] = useState("all")

  const currentData = useMemo(() => promotionDataByTimeRange[timeRange as keyof typeof promotionDataByTimeRange], [timeRange])
  
  // Filter promotions based on selection
  const filteredPromotions = useMemo(() => {
    if (selectedPromotion === "all") return currentData.promotions
    return currentData.promotions.filter(p => p.id === selectedPromotion)
  }, [currentData.promotions, selectedPromotion])

  // Calculate stats based on filtered promotions
  const displayStats = useMemo(() => {
    if (selectedPromotion === "all") return currentData.stats
    const promo = currentData.promotions.find(p => p.id === selectedPromotion)
    if (!promo) return currentData.stats
    return {
      totalRevenue: promo.revenue,
      orders: promo.orders,
      conversion: promo.conversion,
      avgOrder: promo.orders > 0 ? promo.revenue / promo.orders : 0,
      revenueGrowth: currentData.stats.revenueGrowth * (promo.revenue > 0 ? 1 : 0),
      ordersGrowth: currentData.stats.ordersGrowth * (promo.orders > 0 ? 1 : 0),
      conversionGrowth: currentData.stats.conversionGrowth,
      avgOrderGrowth: currentData.stats.avgOrderGrowth
    }
  }, [currentData, selectedPromotion])

  const maxOrders = Math.max(...currentData.usage.map(d => d.orders))
  const maxRevenue = Math.max(...filteredPromotions.filter(p => p.revenue > 0).map(p => p.revenue), 1)

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/promotions">
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
            {currentData.promotions.map((promo) => (
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
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Revenue
            </CardTitle>
            <CardDescription>From promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${displayStats.totalRevenue.toLocaleString()}</p>
            <p className={`text-sm flex items-center mt-1 ${displayStats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayStats.revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {displayStats.revenueGrowth >= 0 ? '+' : ''}{displayStats.revenueGrowth.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Orders
            </CardTitle>
            <CardDescription>Using promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayStats.orders.toLocaleString()}</p>
            <p className={`text-sm flex items-center mt-1 ${displayStats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayStats.ordersGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {displayStats.ordersGrowth >= 0 ? '+' : ''}{displayStats.ordersGrowth.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-violet-600" />
              Conversion Rate
            </CardTitle>
            <CardDescription>For promotion views</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayStats.conversion.toFixed(1)}%</p>
            <p className={`text-sm flex items-center mt-1 ${displayStats.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayStats.conversionGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {displayStats.conversionGrowth >= 0 ? '+' : ''}{displayStats.conversionGrowth.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-600" />
              Avg. Order Value
            </CardTitle>
            <CardDescription>With promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${displayStats.avgOrder.toFixed(2)}</p>
            <p className={`text-sm flex items-center mt-1 ${displayStats.avgOrderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayStats.avgOrderGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {displayStats.avgOrderGrowth >= 0 ? '+' : ''}{displayStats.avgOrderGrowth.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Promotion Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Promotion Performance</CardTitle>
            <CardDescription>Revenue by promotion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPromotions.filter(p => p.revenue > 0).length === 0 ? (
                <p className="text-center text-gray-500 py-8">No revenue data for selected promotion</p>
              ) : (
                filteredPromotions.filter(p => p.revenue > 0).map((promo, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{promo.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          promo.status === 'active' ? 'bg-green-100 text-green-700' : 
                          promo.status === 'ended' ? 'bg-gray-100 text-gray-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {promo.status}
                        </span>
                      </div>
                      <span className="font-semibold">${promo.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${(promo.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{promo.orders} orders</span>
                      <span>{promo.conversion}% conversion</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Promotion Usage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Promotion Usage Over Time</CardTitle>
            <CardDescription>Number of orders using promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-3 pt-4">
              {currentData.usage.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{item.orders}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all hover:from-indigo-700 hover:to-indigo-500"
                      style={{ height: `${(item.orders / maxOrders) * 180}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.period}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotion Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Comparison</CardTitle>
          <CardDescription>Performance metrics across all promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Promotion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Discount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Orders</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((promo, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{promo.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded text-sm">
                        {promo.discount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        promo.status === 'active' ? 'bg-green-100 text-green-700' : 
                        promo.status === 'ended' ? 'bg-gray-100 text-gray-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${promo.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">{promo.orders}</td>
                    <td className="py-3 px-4 text-right">
                      {promo.conversion > 0 ? `${promo.conversion}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

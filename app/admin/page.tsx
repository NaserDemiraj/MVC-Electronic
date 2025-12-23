"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for dashboard
  const dashboardData = {
    totalOrders: 79,
    pendingOrders: 12,
    totalRevenue: 8749.95,
    lowStockProducts: 5,
    totalCustomers: 245,
    newCustomers: 18,
  }

  // Mock data for recent orders
  const recentOrders = [
    { id: "ORD-1234", customer: "John Doe", date: "2023-04-15", total: 249.99, status: "Delivered" },
    { id: "ORD-1235", customer: "Jane Smith", date: "2023-04-16", total: 129.95, status: "Processing" },
    { id: "ORD-1236", customer: "Robert Johnson", date: "2023-04-17", total: 349.97, status: "Shipped" },
    { id: "ORD-1237", customer: "Emily Davis", date: "2023-04-18", total: 59.98, status: "Pending" },
  ]

  // Mock data for low stock products
  const lowStockProducts = [
    { id: 1, name: "Raspberry Pi 4", stock: 5, threshold: 10 },
    { id: 2, name: "Oscilloscope", stock: 3, threshold: 5 },
    { id: 3, name: "3D Printer", stock: 2, threshold: 5 },
    { id: 4, name: "Arduino Mega", stock: 4, threshold: 10 },
    { id: 5, name: "Soldering Iron", stock: 6, threshold: 10 },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0" asChild>
              <Link href="/admin/orders">View all orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${dashboardData.totalRevenue.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0" asChild>
              <Link href="/admin/analytics">View analytics</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalCustomers}</p>
            <p className="text-sm text-gray-500">+{dashboardData.newCustomers} new this month</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="p-0" asChild>
              <Link href="/admin/customers">View all customers</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/products">Manage Products</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/orders">Manage Orders</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/customers">Manage Customers</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/categories">Manage Categories</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/promotions">Manage Promotions</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/settings">Store Settings</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="p-4 align-middle font-medium">{order.id}</td>
                            <td className="p-4 align-middle">{order.customer}</td>
                            <td className="p-4 align-middle">{order.date}</td>
                            <td className="p-4 align-middle">${order.total.toFixed(2)}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "Processing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/orders">View All Orders</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Sales performance for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Sales Chart Visualization</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/analytics">View Detailed Analytics</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Products</CardTitle>
                  <CardDescription>Products that need to be restocked soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Current Stock</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Threshold</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4 align-middle font-medium">{product.name}</td>
                            <td className="p-4 align-middle">{product.stock}</td>
                            <td className="p-4 align-middle">{product.threshold}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  product.stock <= product.threshold / 2
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {product.stock <= product.threshold / 2 ? "Critical" : "Low Stock"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/products">Manage Inventory</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Overview of your current inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold">128</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Low Stock</p>
                      <p className="text-2xl font-bold">{lowStockProducts.length}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/products">View All Products</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

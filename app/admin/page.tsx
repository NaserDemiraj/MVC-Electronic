"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, RefreshCw } from "lucide-react"
import Cookies from "js-cookie"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalCustomers: number
  newCustomersThisMonth: number
  lowStockProducts: number
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  created_at: string
  total: number
  status: string
}

interface LowStockProduct {
  id: number
  name: string
  stock_quantity: number
  threshold: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    lowStockProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Get admin user from localStorage
    const userStr = localStorage.getItem("admin_user")
    if (userStr) {
      setAdminUser(JSON.parse(userStr))
    }
    
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
        setLowStockProducts(data.lowStockProducts || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    
    // Clear local storage and cookies
    localStorage.removeItem("auth_token")
    localStorage.removeItem("admin_user")
    Cookies.remove("auth_token")
    
    router.push("/login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {adminUser && (
            <p className="text-sm text-gray-500">
              Welcome, {adminUser.name} ({adminUser.role})
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <p className="text-sm text-yellow-600">{stats.pendingOrders} pending</p>
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
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
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
            <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            <p className="text-sm text-green-600">+{stats.newCustomersThisMonth} new this month</p>
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
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders yet. Orders will appear here when customers make purchases.
                    </div>
                  ) : (
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
                              <td className="p-4 align-middle font-medium">{order.order_number}</td>
                              <td className="p-4 align-middle">{order.customer_name}</td>
                              <td className="p-4 align-middle">{formatDate(order.created_at)}</td>
                              <td className="p-4 align-middle">${Number(order.total).toFixed(2)}</td>
                              <td className="p-4 align-middle">
                                <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/orders">View All Orders</Link>
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
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : lowStockProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      All products are well stocked!
                    </div>
                  ) : (
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
                              <td className="p-4 align-middle">{product.stock_quantity}</td>
                              <td className="p-4 align-middle">{product.threshold}</td>
                              <td className="p-4 align-middle">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    product.stock_quantity <= product.threshold / 2
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {product.stock_quantity <= product.threshold / 2 ? "Critical" : "Low Stock"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/admin/products">Manage Inventory</Link>
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

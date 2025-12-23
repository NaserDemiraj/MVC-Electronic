"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  created_at: string
  total: number
  subtotal: number
  shipping_cost: number
  tax: number
  status: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_country: string
  shipping_method: string
  payment_method: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle updating an order status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setOrders(orders.map(order => 
          order.id === id ? { ...order, status: newStatus } : order
        ))
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
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
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>
        <div className="flex gap-4">
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending</CardTitle>
            <CardDescription>Orders awaiting processing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter(o => o.status === "pending").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Processing</CardTitle>
            <CardDescription>Orders being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter(o => o.status === "processing").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Shipped</CardTitle>
            <CardDescription>Orders shipped</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter(o => o.status === "shipped").length}</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all customer orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedOrder && selectedOrder.id === order.id && (
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {selectedOrder.order_number}</DialogTitle>
                          <DialogDescription>View and manage order details.</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                            <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                            <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                            <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                            <p>{selectedOrder.shipping_address}</p>
                            <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                            <p>{selectedOrder.shipping_country}</p>
                            <p className="mt-2"><strong>Method:</strong> {selectedOrder.shipping_method}</p>
                            <p><strong>Payment:</strong> {selectedOrder.payment_method}</p>
                          </div>
                        </div>

                        <div className="py-4">
                          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>${Number(selectedOrder.shipping_cost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>${Number(selectedOrder.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2">
                              <span>Total:</span>
                              <span>${Number(selectedOrder.total).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="py-4">
                          <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                          <div className="flex flex-wrap gap-2">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <Button
                                key={status}
                                variant={selectedOrder.status === status ? "default" : "outline"}
                                onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                                className="capitalize"
                              >
                                {status}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

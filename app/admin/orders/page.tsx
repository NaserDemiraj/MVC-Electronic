"use client"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-1234",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2023-04-15",
    total: 249.99,
    status: "Delivered",
    items: [
      { id: "prod-1", name: "Raspberry Pi 4 Model B", quantity: 1, price: 55.99 },
      { id: "prod-3", name: "Soldering Iron Kit", quantity: 1, price: 34.95 },
      { id: "prod-5", name: "Breadboard Kit", quantity: 2, price: 12.95 },
    ],
    shipping: {
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
  },
  {
    id: "ORD-1235",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    date: "2023-04-16",
    total: 129.95,
    status: "Processing",
    items: [
      { id: "prod-2", name: "Arduino Uno Rev3", quantity: 1, price: 23.0 },
      { id: "prod-5", name: "Breadboard Kit", quantity: 1, price: 12.95 },
    ],
    shipping: {
      address: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zip: "67890",
      country: "USA",
    },
  },
  {
    id: "ORD-1236",
    customer: "Robert Johnson",
    email: "robert.johnson@example.com",
    date: "2023-04-17",
    total: 349.97,
    status: "Shipped",
    items: [
      { id: "prod-4", name: "Digital Multimeter", quantity: 1, price: 49.99 },
      { id: "prod-1", name: "Raspberry Pi 4 Model B", quantity: 2, price: 55.99 },
    ],
    shipping: {
      address: "789 Pine Blvd",
      city: "Elsewhere",
      state: "TX",
      zip: "54321",
      country: "USA",
    },
  },
  {
    id: "ORD-1237",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    date: "2023-04-18",
    total: 59.98,
    status: "Pending",
    items: [
      { id: "prod-5", name: "Breadboard Kit", quantity: 2, price: 12.95 },
      { id: "prod-3", name: "Soldering Iron Kit", quantity: 1, price: 34.95 },
    ],
    shipping: {
      address: "321 Elm St",
      city: "Nowhere",
      state: "FL",
      zip: "13579",
      country: "USA",
    },
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle updating an order status
  const handleUpdateStatus = (id, newStatus) => {
    // Update the order in the list
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))

    // Show a success message
    toast({
      title: "Order updated",
      description: `Order ${id} status changed to ${newStatus}.`,
    })
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
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
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
            <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Pending").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Processing</CardTitle>
            <CardDescription>Orders being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Processing").length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Shipped</CardTitle>
            <CardDescription>Orders shipped to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Shipped").length}</p>
          </CardContent>
        </Card>
      </div>

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
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedOrder && (
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
                          <DialogDescription>View and manage order details.</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                            <p>
                              <strong>Name:</strong> {selectedOrder.customer}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedOrder.email}
                            </p>
                            <p>
                              <strong>Date:</strong> {selectedOrder.date}
                            </p>
                            <p>
                              <strong>Status:</strong> {selectedOrder.status}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                            <p>{selectedOrder.shipping.address}</p>
                            <p>
                              {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zip}
                            </p>
                            <p>{selectedOrder.shipping.country}</p>
                          </div>
                        </div>

                        <div className="py-4">
                          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedOrder.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.price.toFixed(2)}</TableCell>
                                  <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-semibold">
                                  Total:
                                </TableCell>
                                <TableCell className="font-semibold">${selectedOrder.total.toFixed(2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        <div className="py-4">
                          <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                          <div className="flex gap-2">
                            <Button
                              variant={selectedOrder.status === "Pending" ? "default" : "outline"}
                              onClick={() => handleUpdateStatus(selectedOrder.id, "Pending")}
                            >
                              Pending
                            </Button>
                            <Button
                              variant={selectedOrder.status === "Processing" ? "default" : "outline"}
                              onClick={() => handleUpdateStatus(selectedOrder.id, "Processing")}
                            >
                              Processing
                            </Button>
                            <Button
                              variant={selectedOrder.status === "Shipped" ? "default" : "outline"}
                              onClick={() => handleUpdateStatus(selectedOrder.id, "Shipped")}
                            >
                              Shipped
                            </Button>
                            <Button
                              variant={selectedOrder.status === "Delivered" ? "default" : "outline"}
                              onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                            >
                              Delivered
                            </Button>
                            <Button
                              variant={selectedOrder.status === "Cancelled" ? "destructive" : "outline"}
                              onClick={() => handleUpdateStatus(selectedOrder.id, "Cancelled")}
                            >
                              Cancelled
                            </Button>
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

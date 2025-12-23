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
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

// Mock data for customers
const mockCustomers = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    orders: 5,
    totalSpent: 549.95,
    lastOrder: "2023-04-15",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    orders: 3,
    totalSpent: 329.85,
    lastOrder: "2023-04-16",
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zip: "67890",
      country: "USA",
    },
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    orders: 2,
    totalSpent: 349.97,
    lastOrder: "2023-04-17",
    address: {
      street: "789 Pine Blvd",
      city: "Elsewhere",
      state: "TX",
      zip: "54321",
      country: "USA",
    },
  },
  {
    id: "cust-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    orders: 1,
    totalSpent: 59.98,
    lastOrder: "2023-04-18",
    address: {
      street: "321 Elm St",
      city: "Nowhere",
      state: "FL",
      zip: "13579",
      country: "USA",
    },
  },
  {
    id: "cust-5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "555-321-6547",
    orders: 4,
    totalSpent: 429.92,
    lastOrder: "2023-04-14",
    address: {
      street: "654 Maple Dr",
      city: "Anyplace",
      state: "WA",
      zip: "97531",
      country: "USA",
    },
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const { toast } = useToast()

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
  })

  // Handle updating a customer
  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return

    // Update the customer in the list
    setCustomers(customers.map((customer) => (customer.id === selectedCustomer.id ? selectedCustomer : customer)))

    // Reset the selected customer
    setSelectedCustomer(null)

    // Show a success message
    toast({
      title: "Customer updated",
      description: "The customer information has been updated successfully.",
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
          <h1 className="text-2xl font-bold">Customers Management</h1>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>All registered customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customers.reduce((sum, customer) => sum + customer.orders, 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From all customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableCaption>A list of all registered customers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
              <TableCell>{customer.lastOrder}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedCustomer && (
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                          <DialogDescription>View and edit customer information.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={selectedCustomer.name}
                              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={selectedCustomer.email}
                              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                              id="edit-phone"
                              value={selectedCustomer.phone}
                              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                              placeholder="Street"
                              value={selectedCustomer.address.street}
                              onChange={(e) =>
                                setSelectedCustomer({
                                  ...selectedCustomer,
                                  address: { ...selectedCustomer.address, street: e.target.value },
                                })
                              }
                              className="mb-2"
                            />
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <Input
                                placeholder="City"
                                value={selectedCustomer.address.city}
                                onChange={(e) =>
                                  setSelectedCustomer({
                                    ...selectedCustomer,
                                    address: { ...selectedCustomer.address, city: e.target.value },
                                  })
                                }
                              />
                              <Input
                                placeholder="State"
                                value={selectedCustomer.address.state}
                                onChange={(e) =>
                                  setSelectedCustomer({
                                    ...selectedCustomer,
                                    address: { ...selectedCustomer.address, state: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="ZIP Code"
                                value={selectedCustomer.address.zip}
                                onChange={(e) =>
                                  setSelectedCustomer({
                                    ...selectedCustomer,
                                    address: { ...selectedCustomer.address, zip: e.target.value },
                                  })
                                }
                              />
                              <Input
                                placeholder="Country"
                                value={selectedCustomer.address.country}
                                onChange={(e) =>
                                  setSelectedCustomer({
                                    ...selectedCustomer,
                                    address: { ...selectedCustomer.address, country: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Order History</Label>
                            <div className="bg-gray-100 p-3 rounded-md">
                              <p>
                                <strong>Total Orders:</strong> {selectedCustomer.orders}
                              </p>
                              <p>
                                <strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}
                              </p>
                              <p>
                                <strong>Last Order:</strong> {selectedCustomer.lastOrder}
                              </p>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateCustomer}>Save Changes</Button>
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

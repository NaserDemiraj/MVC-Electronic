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
import { Label } from "@/components/ui/label"
import { ArrowLeft, RefreshCw, UserPlus } from "lucide-react"

interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  total_orders: number
  total_spent: number
  created_at: string
  last_order_at: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Customer>>({})

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/customers")
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    )
  })

  // Handle updating a customer
  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return

    try {
      const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setCustomers(customers.map(c => 
          c.id === selectedCustomer.id ? { ...c, ...editForm } : c
        ))
        setIsEditing(false)
        setSelectedCustomer({ ...selectedCustomer, ...editForm } as Customer)
      }
    } catch (error) {
      console.error("Failed to update customer:", error)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    try {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE"
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCustomers(customers.filter(c => c.id !== id))
        setSelectedCustomer(null)
      }
    } catch (error) {
      console.error("Failed to delete customer:", error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const startEditing = (customer: Customer) => {
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      zip: customer.zip || "",
      country: customer.country || ""
    })
    setIsEditing(true)
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
          <Button variant="outline" onClick={fetchCustomers} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
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
            <CardDescription>Combined orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {customers.reduce((sum, c) => sum + c.total_orders, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Combined spending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${customers.reduce((sum, c) => sum + Number(c.total_spent), 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No customers found.</p>
        </div>
      ) : (
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
                <TableCell>{customer.phone || "-"}</TableCell>
                <TableCell>{customer.total_orders}</TableCell>
                <TableCell>${Number(customer.total_spent).toFixed(2)}</TableCell>
                <TableCell>{formatDate(customer.last_order_at)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setIsEditing(false)
                        }}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    {selectedCustomer && selectedCustomer.id === customer.id && (
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {isEditing ? "Edit Customer" : "Customer Details"}
                          </DialogTitle>
                          <DialogDescription>
                            {isEditing ? "Update customer information" : "View and manage customer details."}
                          </DialogDescription>
                        </DialogHeader>

                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input 
                                value={editForm.name || ""} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input 
                                value={editForm.email || ""} 
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input 
                                value={editForm.phone || ""} 
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Input 
                                value={editForm.address || ""} 
                                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input 
                                value={editForm.city || ""} 
                                onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input 
                                value={editForm.state || ""} 
                                onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>ZIP</Label>
                              <Input 
                                value={editForm.zip || ""} 
                                onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Country</Label>
                              <Input 
                                value={editForm.country || ""} 
                                onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6 py-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                              <p><strong>Name:</strong> {selectedCustomer.name}</p>
                              <p><strong>Email:</strong> {selectedCustomer.email}</p>
                              <p><strong>Phone:</strong> {selectedCustomer.phone || "-"}</p>
                              <p><strong>Member Since:</strong> {formatDate(selectedCustomer.created_at)}</p>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-2">Address</h3>
                              <p>{selectedCustomer.address || "-"}</p>
                              <p>
                                {selectedCustomer.city && selectedCustomer.state 
                                  ? `${selectedCustomer.city}, ${selectedCustomer.state} ${selectedCustomer.zip || ""}` 
                                  : "-"}
                              </p>
                              <p>{selectedCustomer.country || "-"}</p>
                            </div>

                            <div className="col-span-2">
                              <h3 className="text-lg font-semibold mb-2">Order Statistics</h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                  <p className="text-2xl font-bold">{selectedCustomer.total_orders}</p>
                                  <p className="text-sm text-gray-500">Total Orders</p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                  <p className="text-2xl font-bold">${Number(selectedCustomer.total_spent).toFixed(2)}</p>
                                  <p className="text-sm text-gray-500">Total Spent</p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                  <p className="text-2xl font-bold">{formatDate(selectedCustomer.last_order_at)}</p>
                                  <p className="text-sm text-gray-500">Last Order</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <DialogFooter className="gap-2">
                          {isEditing ? (
                            <>
                              <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateCustomer}>
                                Save Changes
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                              >
                                Delete
                              </Button>
                              <Button variant="outline" onClick={() => startEditing(selectedCustomer)}>
                                Edit
                              </Button>
                              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                                Close
                              </Button>
                            </>
                          )}
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

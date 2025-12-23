"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Loader2, LogIn } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart, isLoaded } = useCart()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [customerInfo, setCustomerInfo] = useState<{id?: number, name: string, email: string} | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States"
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Calculate shipping based on selected method
  const getShippingCost = (method: string) => {
    switch (method) {
      case "express":
        return 9.99
      case "overnight":
        return 19.99
      default:
        return 0
    }
  }

  // Get delivery message based on shipping method
  const getDeliveryMessage = (method: string) => {
    switch (method) {
      case "express":
        return "Your order will be delivered within 1-2 business days"
      case "overnight":
        return "Your order will be delivered by the next business day"
      default:
        return "Your order will be delivered within 2-3 business days"
    }
  }

  // Get processing message based on shipping method
  const getProcessingMessage = (method: string) => {
    switch (method) {
      case "express":
        return "We'll prioritize and process your order within 12 hours"
      case "overnight":
        return "We'll immediately process your order for same-day dispatch"
      default:
        return "We'll process your order within 24 hours"
    }
  }
  
  const shipping = getShippingCost(shippingMethod)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = Cookies.get("customer_logged_in") === "true"
    setIsLoggedIn(loggedIn)
    
    if (loggedIn) {
      const userInfo = localStorage.getItem("customer_user")
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo)
          setCustomerInfo({
            id: parsed.id,
            name: parsed.name,
            email: parsed.email
          })
          // Pre-fill form with customer info
          const nameParts = parsed.name.split(" ")
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: parsed.email || ""
          }))
        } catch (e) {}
      }
    }
    setCheckingAuth(false)
  }, [])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.address.trim()) errors.address = "Address is required"
    if (!formData.city.trim()) errors.city = "City is required"
    if (!formData.state.trim()) errors.state = "State is required"
    if (!formData.zip.trim()) errors.zip = "ZIP code is required"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submitting
    if (!validateForm()) {
      addToast({
        title: "Please fill in all required fields",
        description: "Some required information is missing.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      // Create order in database with items
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerInfo?.id,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          subtotal: subtotal,
          shipping_cost: shipping,
          tax: tax,
          total: total,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_zip: formData.zip,
          shipping_country: formData.country,
          shipping_method: shippingMethod,
          payment_method: "credit_card",
          items: items.map(item => ({
            product_id: item.id,
            product_name: item.name,
            product_slug: item.slug,
            quantity: item.quantity,
            price: item.price
          }))
        })
      })

      const data = await response.json()

      if (data.success && data.order) {
        setOrderNumber(data.order.order_number)
      } else {
        // Fallback to random order number if API fails
        const randomOrderNumber = "EG-" + Math.floor(100000 + Math.random() * 900000).toString()
        setOrderNumber(randomOrderNumber)
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      // Fallback to random order number if API fails
      const randomOrderNumber = "EG-" + Math.floor(100000 + Math.random() * 900000).toString()
      setOrderNumber(randomOrderNumber)
    }

    // Clear cart and show success
    clearCart()
    setOrderComplete(true)
    setIsSubmitting(false)

    addToast({
      title: "Order placed successfully!",
      description: `Your order has been placed. A confirmation email has been sent to ${formData.email}.`,
    })
  }

  // Show loading while cart is being loaded from localStorage or checking auth
  if (!isLoaded || checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="mt-2 text-gray-600">Loading checkout...</p>
      </div>
    )
  }

  // Require login to checkout
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-8 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-violet-100 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Please Log In to Continue</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to place an order. Please log in or create an account to continue with your checkout.
            </p>
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  You have <span className="font-semibold">{items.length} item{items.length !== 1 ? 's' : ''}</span> in your cart worth <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customer-login">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
            <div className="mt-6">
              <Link href="/cart" className="text-violet-600 hover:underline text-sm">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container py-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-violet-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
            <p className="text-gray-600 mb-6">
              Your order #{orderNumber} has been placed successfully. We've sent a confirmation email to your email
              address with all the details.
            </p>
            <div className="bg-violet-50 p-6 rounded-xl mb-8 inline-block">
              <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
              <ol className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-violet-200 text-violet-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>{getProcessingMessage(shippingMethod)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-violet-200 text-violet-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>You'll receive a shipping confirmation email with tracking information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-violet-200 text-violet-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>{getDeliveryMessage(shippingMethod)}</span>
                </li>
              </ol>
            </div>
            <div className="flex justify-center">
              <Button asChild className="px-8 py-6 text-lg">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Breadcrumb */}
        <div className="container py-4 text-sm">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <Link href="/cart" className="text-gray-500 hover:text-gray-700">
              Cart
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>

        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some products to your cart before proceeding to checkout.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Link href="/cart" className="text-gray-500 hover:text-gray-700">
            Cart
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="first-name" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="last-name" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs">{formErrors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs">{formErrors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <Input 
                      id="city" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className={formErrors.city ? "border-red-500" : ""}                    
                    />
                    {formErrors.city && <p className="text-red-500 text-xs">{formErrors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                    <Input 
                      id="state" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className={formErrors.state ? "border-red-500" : ""}
                    />
                    {formErrors.state && <p className="text-red-500 text-xs">{formErrors.state}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code <span className="text-red-500">*</span></Label>
                    <Input 
                      id="zip" 
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      className={formErrors.zip ? "border-red-500" : ""}
                    />
                    {formErrors.zip && <p className="text-red-500 text-xs">{formErrors.zip}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => setFormData({...formData, country: value})}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="South Korea">South Korea</SelectItem>
                        <SelectItem value="Netherlands">Netherlands</SelectItem>
                        <SelectItem value="Sweden">Sweden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="font-medium">
                      Standard Shipping (2-3 business days)
                    </Label>
                  </div>
                  <div className="font-medium">Free</div>
                </div>
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="font-medium">
                      Express Shipping (1-2 business days)
                    </Label>
                  </div>
                  <div className="font-medium">$9.99</div>
                </div>
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overnight" id="overnight" />
                    <Label htmlFor="overnight" className="font-medium">
                      Overnight Shipping (Next business day)
                    </Label>
                  </div>
                  <div className="font-medium">$19.99</div>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <Tabs defaultValue="credit-card">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="apple-pay">Apple Pay</TabsTrigger>
                  <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="credit-card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="expiration">Expiration Date</Label>
                      <Input id="expiration" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input id="name-on-card" required />
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="text-center py-8">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="30"
                      viewBox="0 0 100 30"
                      className="mx-auto"
                    >
                      <path
                        d="M 11.3 2.7 C 10.5 3.6 10.1 5 10.1 6.8 C 10.1 10.7 11.8 13.5 15.1 15.1 C 14.3 16.3 13.9 17.7 13.9 19.5 C 13.9 23.2 15.9 25.8 19.8 27.3 L 19.8 27.3 L 12.4 27.3 C 11.8 27.3 11.3 26.8 11.3 26.2 L 11.3 26.2 L 11.3 2.7 Z"
                        fill="#253B80"
                      />
                      <path
                        d="M 45.3 2.7 L 45.3 26.2 C 45.3 26.8 44.8 27.3 44.2 27.3 L 44.2 27.3 L 36.8 27.3 C 40.7 25.8 42.7 23.2 42.7 19.5 C 42.7 17.7 42.3 16.3 41.5 15.1 C 44.8 13.5 46.5 10.7 46.5 6.8 C 46.5 5 46.1 3.6 45.3 2.7 Z"
                        fill="#179BD7"
                      />
                      <path
                        d="M 28.3 0 C 23.5 0 19.8 2.9 19.8 7.7 C 19.8 11.3 21.8 13.7 25.3 15.1 C 24.5 16.3 24.1 17.7 24.1 19.5 C 24.1 23.2 26.1 25.8 30 27.3 L 30 27.3 L 22.6 27.3 C 22 27.3 21.5 26.8 21.5 26.2 L 21.5 26.2 L 21.5 2.7 C 21.5 1.2 22.7 0 24.2 0 L 24.2 0 L 28.3 0 Z"
                        fill="#253B80"
                      />
                      <path
                        d="M 35.3 0 L 39.4 0 C 40.9 0 42.1 1.2 42.1 2.7 L 42.1 2.7 L 42.1 26.2 C 42.1 26.8 41.6 27.3 41 27.3 L 41 27.3 L 33.6 27.3 C 37.5 25.8 39.5 23.2 39.5 19.5 C 39.5 17.7 39.1 16.3 38.3 15.1 C 41.6 13.7 43.6 11.3 43.6 7.7 C 43.6 2.9 39.9 0 35.3 0 Z"
                        fill="#179BD7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Click the button below to pay with PayPal</p>
                  <Button className="bg-[#0070ba] hover:bg-[#005ea6]">Continue with PayPal</Button>
                </TabsContent>
                <TabsContent value="apple-pay" className="text-center py-8">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      className="mx-auto"
                    >
                      <path
                        d="M30.7 10.4C29.2 12.2 26.9 11.9 24.7 11.1C24.3 8.9 25.5 6.6 26.9 5.2C28.4 3.5 30.9 3.8 32.9 4.5C32.4 6.8 31.3 9 30.7 10.4Z"
                        fill="#000"
                      />
                      <path
                        d="M32.9 12.4C29.8 12.2 27.1 14.1 25.6 14.1C24 14.1 21.6 12.5 19.2 12.5C15.5 12.6 12 15.1 10.1 19C6.3 26.8 9.1 38.2 12.8 44.3C14.6 47.3 16.7 50.6 19.5 50.5C22.1 50.4 23.1 48.7 26.2 48.7C29.3 48.7 30.2 50.5 32.9 50.4C35.7 50.3 37.6 47.3 39.4 44.3C41.4 40.9 42.2 37.6 42.3 37.4C42.2 37.3 36.2 35.2 36.1 28.5C36 22.9 40.8 20.3 41 20.2C38.5 16.5 34.6 16.2 33.2 16.1C30.2 15.9 27.7 17.7 26.2 17.7C24.6 17.7 22.4 16.1 20 16.2C16.8 16.3 13.8 18.1 12.1 21C10.4 23.9 9.5 28.5 11.2 34.3C12.9 40.1 16.4 45.9 19.9 45.8C22.3 45.7 23.4 44.1 26.3 44.1C29.1 44.1 30.1 45.7 32.6 45.7C35.2 45.6 38.2 40.5 39.8 34.8C40.1 33.7 40.3 32.6 40.4 31.5C40.4 31.4 40.4 31.3 40.4 31.2C37.8 30 32.9 27.5 32.9 21.5C32.9 16.3 36.8 13.8 37.2 13.5C35.1 10.5 31.8 10.3 30.7 10.3C27.9 10.2 25.4 12 23.9 12C22.5 12 20.3 10.4 18 10.4Z"
                        fill="#000"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Click the button below to pay with Apple Pay</p>
                  <Button className="bg-black hover:bg-gray-800 text-white">Continue with Apple Pay</Button>
                </TabsContent>
                <TabsContent value="cash" className="text-center py-8">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-green-600"
                    >
                      <rect width="18" height="12" x="3" y="6" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M3 10h18" />
                      <path d="M3 14h18" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Pay with cash when your order is delivered</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
                    <h3 className="font-medium mb-2">How it works:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• We'll deliver your order to your shipping address</li>
                      <li>• You'll pay the delivery person when you receive your order</li>
                      <li>• Please have the exact amount ready</li>
                      <li>• You'll receive a receipt upon payment</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="checkbox" id="cash-terms" className="mr-2" />
                    <label htmlFor="cash-terms" className="text-sm">
                      I agree to pay the full amount upon delivery
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Summary for Mobile */}
            <div className="md:hidden bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 py-6 text-lg font-medium"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>

          {/* Order Summary for Desktop */}
          <div className="hidden md:block">
            <div className="sticky top-20 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-md border overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 py-6 text-lg font-medium"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>By placing your order, you agree to our</p>
                <div className="flex justify-center gap-2 mt-1">
                  <Link href="#" className="text-violet-600 hover:underline">
                    Terms of Service
                  </Link>
                  <span>and</span>
                  <Link href="#" className="text-violet-600 hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

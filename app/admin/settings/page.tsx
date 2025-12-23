"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  // Mock store settings
  const [storeSettings, setStoreSettings] = useState({
    name: "ElectroShop",
    description: "Your one-stop shop for electronics and components",
    email: "contact@electroshop.com",
    phone: "555-123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94043",
    logo: "/placeholder.svg?height=100&width=100",
    currency: "USD",
    taxRate: 8.5,
  })

  // Mock shipping settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50,
    domesticShippingRate: 5.99,
    internationalShippingRate: 15.99,
    shippingOrigin: "United States",
    estimatedDeliveryDays: 3,
  })

  // Mock payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptedPaymentMethods: ["Credit Card", "PayPal", "Apple Pay", "Google Pay"],
    stripeEnabled: true,
    paypalEnabled: true,
    applePayEnabled: true,
    googlePayEnabled: true,
  })

  // Handle saving general settings
  const handleSaveGeneralSettings = () => {
    // In a real app, you would make an API call to save the settings
    toast({
      title: "Settings saved",
      description: "Your general settings have been saved successfully.",
    })
  }

  // Handle saving shipping settings
  const handleSaveShippingSettings = () => {
    // In a real app, you would make an API call to save the settings
    toast({
      title: "Settings saved",
      description: "Your shipping settings have been saved successfully.",
    })
  }

  // Handle saving payment settings
  const handleSavePaymentSettings = () => {
    // In a real app, you would make an API call to save the settings
    toast({
      title: "Settings saved",
      description: "Your payment settings have been saved successfully.",
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Store Settings</h1>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your store's general information and appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  rows={3}
                  value={storeSettings.description}
                  onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-email">Contact Email</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-phone">Contact Phone</Label>
                  <Input
                    id="store-phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Input
                  id="store-address"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-logo">Store Logo URL</Label>
                <Input
                  id="store-logo"
                  value={storeSettings.logo}
                  onChange={(e) => setStoreSettings({ ...storeSettings, logo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-currency">Currency</Label>
                  <select
                    id="store-currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={storeSettings.taxRate}
                    onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>Configure your store's shipping options and rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="free-shipping-threshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="free-shipping-threshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      freeShippingThreshold: Number.parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  Orders above this amount will qualify for free shipping. Set to 0 to disable.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domestic-shipping-rate">Domestic Shipping Rate ($)</Label>
                  <Input
                    id="domestic-shipping-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingSettings.domesticShippingRate}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        domesticShippingRate: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="international-shipping-rate">International Shipping Rate ($)</Label>
                  <Input
                    id="international-shipping-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingSettings.internationalShippingRate}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        internationalShippingRate: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping-origin">Shipping Origin</Label>
                <Input
                  id="shipping-origin"
                  value={shippingSettings.shippingOrigin}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, shippingOrigin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated-delivery-days">Estimated Delivery Days (Domestic)</Label>
                <Input
                  id="estimated-delivery-days"
                  type="number"
                  min="1"
                  value={shippingSettings.estimatedDeliveryDays}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      estimatedDeliveryDays: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveShippingSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure your store's payment methods and options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Accepted Payment Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="credit-card"
                      checked={paymentSettings.acceptedPaymentMethods.includes("Credit Card")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.acceptedPaymentMethods, "Credit Card"]
                          : paymentSettings.acceptedPaymentMethods.filter((m) => m !== "Credit Card")
                        setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="credit-card">Credit Card</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="paypal"
                      checked={paymentSettings.acceptedPaymentMethods.includes("PayPal")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.acceptedPaymentMethods, "PayPal"]
                          : paymentSettings.acceptedPaymentMethods.filter((m) => m !== "PayPal")
                        setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="apple-pay"
                      checked={paymentSettings.acceptedPaymentMethods.includes("Apple Pay")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.acceptedPaymentMethods, "Apple Pay"]
                          : paymentSettings.acceptedPaymentMethods.filter((m) => m !== "Apple Pay")
                        setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="apple-pay">Apple Pay</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="google-pay"
                      checked={paymentSettings.acceptedPaymentMethods.includes("Google Pay")}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...paymentSettings.acceptedPaymentMethods, "Google Pay"]
                          : paymentSettings.acceptedPaymentMethods.filter((m) => m !== "Google Pay")
                        setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="google-pay">Google Pay</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Gateways</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-gray-500">Accept credit card payments via Stripe</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="stripe-enabled"
                        checked={paymentSettings.stripeEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="stripe-enabled" className="ml-2">
                        Enabled
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-gray-500">Accept payments via PayPal</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="paypal-enabled"
                        checked={paymentSettings.paypalEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="paypal-enabled" className="ml-2">
                        Enabled
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Apple Pay</h3>
                      <p className="text-sm text-gray-500">Accept Apple Pay payments</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="apple-pay-enabled"
                        checked={paymentSettings.applePayEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, applePayEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="apple-pay-enabled" className="ml-2">
                        Enabled
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Google Pay</h3>
                      <p className="text-sm text-gray-500">Accept Google Pay payments</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="google-pay-enabled"
                        checked={paymentSettings.googlePayEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, googlePayEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="google-pay-enabled" className="ml-2">
                        Enabled
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

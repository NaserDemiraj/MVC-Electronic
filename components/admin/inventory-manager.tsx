"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MinusCircle, PlusCircle, Save } from "lucide-react"
import { updateProduct } from "@/app/actions/product-actions"

interface InventoryManagerProps {
  productId: number
  inStock: boolean
  stockQuantity: number
  onUpdate: () => void
}

export function InventoryManager({ productId, inStock, stockQuantity, onUpdate }: InventoryManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [quantity, setQuantity] = useState(stockQuantity)
  const [available, setAvailable] = useState(inStock)
  const [hasChanges, setHasChanges] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(0, value)
    setQuantity(newValue)
    setHasChanges(newValue !== stockQuantity || available !== inStock)
  }

  const handleAvailabilityChange = (value: boolean) => {
    setAvailable(value)
    setHasChanges(quantity !== stockQuantity || value !== inStock)
  }

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      const response = await updateProduct(productId, {
        stock_quantity: quantity,
        in_stock: available,
      })

      if (response.success) {
        toast({
          title: "Inventory Updated",
          description: "Product inventory has been successfully updated in the database.",
        })
        setHasChanges(false)
        onUpdate()
      } else {
        toast({
          title: "Update Failed",
          description: response.error || "Failed to update inventory",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating inventory:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="stock-status">Stock Status</Label>
        <div className="flex items-center space-x-4">
          <Button
            variant={available ? "default" : "outline"}
            onClick={() => handleAvailabilityChange(true)}
            className="flex-1"
          >
            In Stock
          </Button>
          <Button
            variant={!available ? "default" : "outline"}
            onClick={() => handleAvailabilityChange(false)}
            className="flex-1"
          >
            Out of Stock
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock-quantity">Stock Quantity</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 0}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Input
            id="stock-quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 0)}
            className="text-center"
          />
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} disabled={isUpdating || !hasChanges} className="w-full">
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Database...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save to Database
            </>
          )}
        </Button>
        {hasChanges && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            You have unsaved changes that haven't been saved to the database yet.
          </p>
        )}
      </div>
    </div>
  )
}

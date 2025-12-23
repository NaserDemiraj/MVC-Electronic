"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MinusCircle, PlusCircle, Save } from "lucide-react"
import { updateProduct } from "@/app/actions/product-actions"

interface QuickInventoryUpdateProps {
  productId: number
  stockQuantity: number
  onUpdate: () => void
}

export function QuickInventoryUpdate({ productId, stockQuantity, onUpdate }: QuickInventoryUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [quantity, setQuantity] = useState(stockQuantity)
  const [hasChanges, setHasChanges] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(0, value)
    setQuantity(newValue)
    setHasChanges(newValue !== stockQuantity)
  }

  const handleSave = async () => {
    setIsUpdating(true)
    try {
      const response = await updateProduct(productId, {
        stock_quantity: quantity,
        in_stock: quantity > 0,
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
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={quantity <= 0 || isUpdating}
      >
        <MinusCircle className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 0)}
        className="w-16 text-center"
        disabled={isUpdating}
      />
      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)} disabled={isUpdating}>
        <PlusCircle className="h-4 w-4" />
      </Button>
      {hasChanges && (
        <Button onClick={handleSave} disabled={isUpdating} size="sm" className="ml-2">
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}

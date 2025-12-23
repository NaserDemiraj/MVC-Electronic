"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, X } from "lucide-react"
import {
  addProductImage,
  deleteProductImage,
  addProductFeature,
  updateProductFeature,
  deleteProductFeature,
  addProductSpecification,
  updateProductSpecification,
  deleteProductSpecification,
  type ProductDetail,
  type ProductImage,
  type ProductFeature,
  type ProductSpecification,
} from "@/app/actions/product-actions"

interface ProductDetailsFormProps {
  product: ProductDetail
  onUpdate: () => void
}

export function ProductDetailsForm({ product, onUpdate }: ProductDetailsFormProps) {
  const [activeTab, setActiveTab] = useState("images")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Images state
  const [images, setImages] = useState<ProductImage[]>(product.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")

  // Features state
  const [features, setFeatures] = useState<ProductFeature[]>(product.features || [])
  const [newFeature, setNewFeature] = useState("")

  // Specifications state
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(product.specifications || [])
  const [newSpecName, setNewSpecName] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  // Handle adding a new image
  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const displayOrder = images.length > 0 ? Math.max(...images.map((img) => img.display_order)) + 1 : 0
      const response = await addProductImage(product.id, newImageUrl, displayOrder)

      if (response.success) {
        setImages([...images, response.data])
        setNewImageUrl("")
        toast({
          title: "Success",
          description: "Image added successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting an image
  const handleDeleteImage = async (imageId: number) => {
    setIsSubmitting(true)
    try {
      const response = await deleteProductImage(imageId)

      if (response.success) {
        setImages(images.filter((img) => img.id !== imageId))
        toast({
          title: "Success",
          description: "Image deleted successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding a new feature
  const handleAddFeature = async () => {
    if (!newFeature.trim()) {
      toast({
        title: "Error",
        description: "Please enter a feature",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await addProductFeature(product.id, newFeature)

      if (response.success) {
        setFeatures([...features, response.data])
        setNewFeature("")
        toast({
          title: "Success",
          description: "Feature added successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add feature",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding feature:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle updating a feature
  const handleUpdateFeature = async (featureId: number, featureText: string) => {
    setIsSubmitting(true)
    try {
      const response = await updateProductFeature(featureId, featureText)

      if (response.success) {
        setFeatures(features.map((f) => (f.id === featureId ? response.data : f)))
        toast({
          title: "Success",
          description: "Feature updated successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update feature",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating feature:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a feature
  const handleDeleteFeature = async (featureId: number) => {
    setIsSubmitting(true)
    try {
      const response = await deleteProductFeature(featureId)

      if (response.success) {
        setFeatures(features.filter((f) => f.id !== featureId))
        toast({
          title: "Success",
          description: "Feature deleted successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete feature",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting feature:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding a new specification
  const handleAddSpecification = async () => {
    if (!newSpecName.trim() || !newSpecValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter both specification name and value",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await addProductSpecification(product.id, newSpecName, newSpecValue)

      if (response.success) {
        setSpecifications([...specifications, response.data])
        setNewSpecName("")
        setNewSpecValue("")
        toast({
          title: "Success",
          description: "Specification added successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add specification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding specification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle updating a specification
  const handleUpdateSpecification = async (specId: number, specName: string, specValue: string) => {
    setIsSubmitting(true)
    try {
      const response = await updateProductSpecification(specId, specName, specValue)

      if (response.success) {
        setSpecifications(specifications.map((s) => (s.id === specId ? response.data : s)))
        toast({
          title: "Success",
          description: "Specification updated successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update specification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating specification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a specification
  const handleDeleteSpecification = async (specId: number) => {
    setIsSubmitting(true)
    try {
      const response = await deleteProductSpecification(specId)

      if (response.success) {
        setSpecifications(specifications.filter((s) => s.id !== specId))
        toast({
          title: "Success",
          description: "Specification deleted successfully",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete specification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting specification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
      </TabsList>

      {/* Images Tab */}
      <TabsContent value="images" className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="Enter image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAddImage} disabled={isSubmitting || !newImageUrl.trim()}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="relative border rounded-md overflow-hidden group">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Product image ${image.id}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="p-2 bg-gray-50">
                  <p className="text-xs truncate">{image.image_url}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">No images added yet. Add your first image above.</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Features Tab */}
      <TabsContent value="features" className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="feature">Feature</Label>
            <Input
              id="feature"
              placeholder="Enter product feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
            />
          </div>
          <Button onClick={handleAddFeature} disabled={isSubmitting || !newFeature.trim()}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Feature
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          {features.length > 0 ? (
            features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-2 p-3 border rounded-md group">
                <div className="flex-1">
                  <Input
                    value={feature.feature}
                    onChange={(e) => handleUpdateFeature(feature.id, e.target.value)}
                    className="border-0 focus-visible:ring-0 p-0 h-auto"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteFeature(feature.id)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">No features added yet. Add your first feature above.</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="spec-name">Specification Name</Label>
            <Input
              id="spec-name"
              placeholder="e.g. Display, Processor, Battery"
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spec-value">Specification Value</Label>
            <Input
              id="spec-value"
              placeholder="e.g. 6.1-inch OLED, A16 Bionic"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button
              onClick={handleAddSpecification}
              disabled={isSubmitting || !newSpecName.trim() || !newSpecValue.trim()}
              className="w-full"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Specification
            </Button>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          {specifications.length > 0 ? (
            specifications.map((spec) => (
              <div key={spec.id} className="grid grid-cols-2 gap-2 p-3 border rounded-md group">
                <div className="space-y-1">
                  <Label htmlFor={`spec-name-${spec.id}`} className="text-xs">
                    Name
                  </Label>
                  <Input
                    id={`spec-name-${spec.id}`}
                    value={spec.spec_name}
                    onChange={(e) => handleUpdateSpecification(spec.id, e.target.value, spec.spec_value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1 relative">
                  <Label htmlFor={`spec-value-${spec.id}`} className="text-xs">
                    Value
                  </Label>
                  <Input
                    id={`spec-value-${spec.id}`}
                    value={spec.spec_value}
                    onChange={(e) => handleUpdateSpecification(spec.id, spec.spec_name, e.target.value)}
                    className="h-8 pr-8"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteSpecification(spec.id)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">No specifications added yet. Add your first specification above.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

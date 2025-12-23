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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CategoryInput,
} from "@/app/actions/category-actions"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCategory, setNewCategory] = useState<CategoryInput>({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const response = await getCategories()

        if (response.success) {
          setCategories(response.data)
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to fetch categories",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Handle adding a new category
  const handleAddCategory = async () => {
    setIsSubmitting(true)
    try {
      const response = await createCategory(newCategory)

      if (response.success) {
        // Add the new category to the list
        setCategories([...categories, response.data])

        // Reset the form
        setNewCategory({
          name: "",
          slug: "",
          description: "",
          image_url: "",
        })

        // Close the dialog
        setIsAddCategoryOpen(false)

        // Show a success message
        toast({
          title: "Category added",
          description: "The category has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle updating a category
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)
    try {
      const response = await updateCategory(selectedCategory.id, selectedCategory)

      if (response.success) {
        // Update the category in the list
        setCategories(categories.map((category) => (category.id === selectedCategory.id ? response.data : category)))

        // Reset the selected category
        setSelectedCategory(null)

        // Show a success message
        toast({
          title: "Category updated",
          description: "The category has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a category
  const handleDeleteCategory = async (id: number) => {
    setIsSubmitting(true)
    try {
      const response = await deleteCategory(id)

      if (response.success) {
        // Remove the category from the list
        setCategories(categories.filter((category) => category.id !== id))

        // Show a success message
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Categories Management</h1>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Fill in the details to add a new product category.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="e.g. microcontrollers (leave empty to generate automatically)"
                  />
                  <p className="text-xs text-gray-500">Leave empty to generate automatically from the category name</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={newCategory.description || ""}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newCategory.image_url || ""}
                    onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                    placeholder="e.g. /images/categories/microcontrollers.jpg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Categories</CardTitle>
            <CardDescription>All categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {categories.reduce((sum, category) => sum + (category.product_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading categories...</span>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all product categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "No description"}</TableCell>
                  <TableCell>{category.product_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCategory(category)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        {selectedCategory && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>Make changes to the category details.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input
                                  id="edit-name"
                                  value={selectedCategory.name}
                                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-slug">Slug (URL-friendly name)</Label>
                                <Input
                                  id="edit-slug"
                                  value={selectedCategory.slug}
                                  onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  rows={3}
                                  value={selectedCategory.description || ""}
                                  onChange={(e) =>
                                    setSelectedCategory({ ...selectedCategory, description: e.target.value })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-image">Image URL</Label>
                                <Input
                                  id="edit-image"
                                  value={selectedCategory.image_url || ""}
                                  onChange={(e) =>
                                    setSelectedCategory({ ...selectedCategory, image_url: e.target.value })
                                  }
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedCategory(null)}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete {category.name}? This action cannot be undone.
                              {category.product_count > 0 && (
                                <p className="mt-2 text-red-500">
                                  Warning: This category contains {category.product_count} products. Deleting it will
                                  remove the category association from these products.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchTerm ? (
                    <p className="text-gray-500">No categories match your search. Try adjusting your search term.</p>
                  ) : (
                    <p className="text-gray-500">No categories found. Add your first category to get started.</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

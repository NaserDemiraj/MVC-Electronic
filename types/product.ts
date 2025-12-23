export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  stockQuantity: number // Added stock quantity field
  features?: string[]
  specifications?: Record<string, string>
  relatedProducts?: string[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  discountPrice?: number
  image: string
  quantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
}

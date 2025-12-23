"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import ProductCarousel from "@/components/product-carousel"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { getProductBySlug } from "@/app/actions/product-actions"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        // Try to fetch from database first
        const response = await fetch(`/api/products?slug=${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const productData = data[0]
            const price = parseFloat(productData.price) || 0
            const discountPrice = productData.discount_price ? parseFloat(productData.discount_price) : null
            
            setProduct({
              id: productData.id.toString(),
              name: productData.name,
              slug: productData.slug,
              price: discountPrice || price,
              originalPrice: price,
              salePrice: discountPrice,
              isOnSale: !!discountPrice && discountPrice < price,
              rating: productData.rating || 4.5,
              description: productData.description,
              images: [
                "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=600&fit=crop",
              ],
              inStock: productData.in_stock,
              reviews: productData.reviews_count || 0,
              stock_quantity: productData.stock_quantity || 0,
              specs: [],
              components: [],
            })
          }
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Could not load product")
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })

    setJustAddedToCart(true)
    setTimeout(() => setJustAddedToCart(false), 5000)
  }

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        duration: 2000,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      })
    }
  }

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })

    router.push("/checkout")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Link href="/category/kits" className="text-gray-500 hover:text-gray-700">
            Kits
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white h-[400px]">
              <ProductCarousel images={product.images} alt={product.name} />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`}
                      />
                    ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {product.isOnSale && product.salePrice !== null && product.salePrice !== undefined ? (
                <>
                  <span className="text-3xl font-bold text-violet-600">${Number(product.salePrice).toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through">${Number(product.originalPrice).toFixed(2)}</span>
                  <span className="text-green-600 font-medium">
                    {Math.round(((Number(product.originalPrice) - Number(product.salePrice)) / Number(product.originalPrice)) * 100)}% off
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <>
                      <span className="text-lg text-gray-500 line-through">${Number(product.originalPrice).toFixed(2)}</span>
                      <span className="text-green-600 font-medium">
                        Save ${(Number(product.originalPrice) - Number(product.price)).toFixed(2)}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {justAddedToCart ? (
                <Button
                  size="lg"
                  className="sm:flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full"
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    View Cart & Checkout
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="sm:flex-1 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              )}
              <Button variant="outline" size="lg" className="sm:flex-1 rounded-full" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${inWishlist ? "text-red-500 border-red-200" : ""}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                <span className="sr-only">{inWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-b py-4 grid gap-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Free shipping</p>
                  <p className="text-sm text-gray-500">Delivery in 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">1-Year Warranty</p>
                  <p className="text-sm text-gray-500">Full coverage for peace of mind</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm text-gray-500">Hassle-free return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Product Details Tabs */}
      <div className="container py-12">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="specifications"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="components"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
            >
              What's Included
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                <div className="space-y-2">
                  {product.specs && product.specs.length > 0 ? (
                    product.specs.map((spec, index) => (
                      <div key={index} className="grid grid-cols-2 py-2 border-b last:border-0">
                        <span className="text-gray-500">{spec.name}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No specifications available</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Project Examples</h3>
                <p className="text-gray-700 mb-4">
                  This starter kit includes a project book with 15 different projects, ranging from simple LED blinking
                  to more complex sensor-based applications. Perfect for beginners and intermediate users alike.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&h=150&fit=crop"
                      alt="LED Project"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=200&h=150&fit=crop"
                      alt="Sensor Project"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="components" className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">What's in the Box</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.components && product.components.length > 0 ? (
                    product.components.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No components information available</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Kit Overview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1623949556303-b0d17c371ca0?w=400&h=300&fit=crop"
                    alt="Kit Contents"
                    className="w-full h-auto"
                  />
                </div>
                <p className="mt-4 text-gray-700">
                  All components come neatly organized in a sturdy storage box, making it easy to keep track of all
                  parts and transport your kit.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold">{product.rating}</div>
                  <div className="flex text-amber-500 justify-center mt-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"}`}
                        />
                      ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{product.reviews} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">5★</span>
                    <div className="h-2 bg-gray-200 rounded-full flex-1">
                      <div className="h-2 bg-amber-500 rounded-full w-[85%]"></div>
                    </div>
                    <span className="text-sm w-8">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">4★</span>
                    <div className="h-2 bg-gray-200 rounded-full flex-1">
                      <div className="h-2 bg-amber-500 rounded-full w-[10%]"></div>
                    </div>
                    <span className="text-sm w-8">10%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">3★</span>
                    <div className="h-2 bg-gray-200 rounded-full flex-1">
                      <div className="h-2 bg-amber-500 rounded-full w-[3%]"></div>
                    </div>
                    <span className="text-sm w-8">3%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">2★</span>
                    <div className="h-2 bg-gray-200 rounded-full flex-1">
                      <div className="h-2 bg-amber-500 rounded-full w-[1%]"></div>
                    </div>
                    <span className="text-sm w-8">1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">1★</span>
                    <div className="h-2 bg-gray-200 rounded-full flex-1">
                      <div className="h-2 bg-amber-500 rounded-full w-[1%]"></div>
                    </div>
                    <span className="text-sm w-8">1%</span>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                Write a Review
              </Button>

              <div className="space-y-6">
                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <span className="text-gray-500 text-sm">2 weeks ago</span>
                  </div>
                  <div className="flex text-amber-500 mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                  </div>
                  <p className="text-gray-700">
                    Perfect starter kit for beginners! The instructions are clear and the projects are fun to build. My
                    12-year-old son was able to follow along with minimal help from me.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Michael Chen</h4>
                    <span className="text-gray-500 text-sm">1 month ago</span>
                  </div>
                  <div className="flex text-amber-500 mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : "fill-none"}`} />
                      ))}
                  </div>
                  <p className="text-gray-700">
                    Great value for the price. The components are good quality and the Arduino board works perfectly. I
                    would have liked more advanced projects in the guide, but it's a solid starting point.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Emily Rodriguez</h4>
                    <span className="text-gray-500 text-sm">2 months ago</span>
                  </div>
                  <div className="flex text-amber-500 mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 5 ? "fill-current" : "fill-none"}`} />
                      ))}
                  </div>
                  <p className="text-gray-700">
                    I'm using this kit in my classroom to teach basic electronics and programming. The students love it
                    and the components have held up well to repeated use. Highly recommended for educators!
                  </p>
                </div>
              </div>

              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="container py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601049676869-9bf269d8dfc8?w=300&h=300&fit=crop"
                alt="Related product"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="p-4">
              <h3 className="font-medium group-hover:text-primary transition-colors">Raspberry Pi 4 Starter Kit</h3>
              <div className="mt-1 font-bold">$79.99</div>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1597713420028-a8ccd9a55eaa?w=300&h=300&fit=crop"
                alt="Related product"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="p-4">
              <h3 className="font-medium group-hover:text-primary transition-colors">Soldering Starter Kit</h3>
              <div className="mt-1 font-bold">$39.99</div>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=300&h=300&fit=crop"
                alt="Related product"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="p-4">
              <h3 className="font-medium group-hover:text-primary transition-colors">Sensor Variety Pack</h3>
              <div className="mt-1 font-bold">$24.99</div>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden group relative">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1623949556303-b0d17c371ca0?w=300&h=300&fit=crop"
                alt="Related product"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="p-4">
              <h3 className="font-medium group-hover:text-primary transition-colors">Arduino Projects Book</h3>
              <div className="mt-1 font-bold">$19.99</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

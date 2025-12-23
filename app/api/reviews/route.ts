import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Create reviews table if it doesn't exist
async function ensureReviewsTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_slug VARCHAR(255) NOT NULL,
      customer_id INTEGER,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255),
      comment TEXT NOT NULL,
      verified_purchase BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// GET reviews for a product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productSlug = searchParams.get("product_slug")
    
    if (!productSlug) {
      return NextResponse.json({ error: "Product slug is required" }, { status: 400 })
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ reviews: [], message: "Database not configured" })
    }

    const sql = neon(databaseUrl)
    await ensureReviewsTable(sql)
    
    const reviews = await sql`
      SELECT id, product_slug, customer_name, rating, title, comment, verified_purchase, created_at
      FROM reviews
      WHERE product_slug = ${productSlug}
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ reviews: [], error: "Failed to fetch reviews" })
  }
}

// POST a new review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_slug, customer_name, customer_email, rating, title, comment, customer_id } = body

    // Validate required fields
    if (!product_slug || !customer_name || !customer_email || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields: product_slug, customer_name, customer_email, rating, comment" },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)
    await ensureReviewsTable(sql)

    // Check if customer has already reviewed this product
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE product_slug = ${product_slug} AND customer_email = ${customer_email}
    `

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    // Check if this is a verified purchase (customer has ordered this product)
    let verifiedPurchase = false
    if (customer_id) {
      try {
        const orderCheck = await sql`
          SELECT o.id FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          WHERE o.customer_id = ${customer_id} AND oi.product_slug = ${product_slug}
          LIMIT 1
        `
        verifiedPurchase = orderCheck.length > 0
      } catch (e) {
        // Tables might not exist yet, that's okay
      }
    }

    // Insert the review
    const result = await sql`
      INSERT INTO reviews (product_slug, customer_id, customer_name, customer_email, rating, title, comment, verified_purchase)
      VALUES (${product_slug}, ${customer_id || null}, ${customer_name}, ${customer_email}, ${rating}, ${title || null}, ${comment}, ${verifiedPurchase})
      RETURNING id, created_at
    `

    return NextResponse.json({
      success: true,
      review: {
        id: result[0].id,
        product_slug,
        customer_name,
        rating,
        title,
        comment,
        verified_purchase: verifiedPurchase,
        created_at: result[0].created_at
      }
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

// GET dashboard stats
export async function GET() {
  try {
    if (!sql) {
      // Return mock data if database is not configured
      return NextResponse.json({
        success: true,
        stats: {
          totalOrders: 0,
          pendingOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          newCustomersThisMonth: 0,
          lowStockProducts: 0
        },
        recentOrders: [],
        lowStockProducts: []
      })
    }

    // Get order stats
    const orderStats = await sql`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COALESCE(SUM(total), 0) as total_revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `

    // Get customer stats
    const customerStats = await sql`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_customers
      FROM customers
    `

    // Get low stock products
    const lowStockProducts = await sql`
      SELECT id, name, stock_quantity, 10 as threshold
      FROM products
      WHERE stock_quantity < 10 AND in_stock = true
      ORDER BY stock_quantity ASC
      LIMIT 5
    `

    // Get recent orders
    const recentOrders = await sql`
      SELECT id, order_number, customer_name, created_at, total, status
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: parseInt(orderStats[0]?.total_orders || '0'),
        pendingOrders: parseInt(orderStats[0]?.pending_orders || '0'),
        totalRevenue: parseFloat(orderStats[0]?.total_revenue || '0'),
        totalCustomers: parseInt(customerStats[0]?.total_customers || '0'),
        newCustomersThisMonth: parseInt(customerStats[0]?.new_customers || '0'),
        lowStockProducts: lowStockProducts.length
      },
      recentOrders,
      lowStockProducts
    })
  } catch (error: any) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

import { sql } from '@/lib/db'

export async function GET() {
  try {
    if (!sql) {
      throw new Error('Database connection not available')
    }

    const result = await sql`
      INSERT INTO products (name, price, rating, image, slug, description)
      VALUES ('ESP32-CAM WiFi Module', 34.99, 4.7, '/ESP32 Development Board.png', 'esp32-cam-wifi-module', 'ESP32-CAM is a tiny camera module with WiFi capabilities. It comes with OV2640 camera, WiFi, classic Bluetooth, Dual-mode Bluetooth, and more features.')
      RETURNING *
    `

    return Response.json({
      success: true,
      message: 'ESP32-CAM product added successfully',
      product: result[0]
    })
  } catch (error: any) {
    console.error('Error adding ESP32-CAM:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

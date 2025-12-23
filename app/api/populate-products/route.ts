import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({ error: "SQL not init" })
    }

    // Simple inserts one by one
    const queries = [
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Arduino Starter Kit', 'arduino-starter-kit', 'Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners', 49.99, 39.99, 'Arduino', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Raspberry Pi 4 - 4GB', 'raspberry-pi-4-4gb', 'The latest Raspberry Pi with 4GB RAM, perfect for desktop computing and IoT projects', 59.99, 54.99, 'Raspberry Pi', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Electronics Learning Lab', 'electronics-learning-lab', 'Comprehensive electronics learning kit with 100+ projects and detailed instruction manual', 89.99, 79.99, 'Learning', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Arduino Uno R3 Microcontroller', 'arduino-uno-r3-microcontroller', 'The Arduino Uno R3 is the most used and documented board in the Arduino family', 24.99, NULL, 'Arduino', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Raspberry Pi 4 Model B - 4GB', 'raspberry-pi-4-model-b-4gb', 'The Raspberry Pi 4 Model B with 4GB RAM offers desktop-like performance', 45.99, NULL, 'Raspberry Pi', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Soldering Station Kit - Digital', 'soldering-station-kit-digital', 'Professional digital soldering station with adjustable temperature control', 79.99, NULL, 'Weller', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Ultrasonic Distance Sensor Pack', 'ultrasonic-distance-sensor-pack', 'Pack of 5 HC-SR04 ultrasonic distance sensors', 12.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('ESP32 Development Board', 'esp32-development-board', 'ESP32 development board with WiFi and Bluetooth capabilities', 8.99, NULL, 'Espressif', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('DHT22 Temperature & Humidity Sensor', 'dht22-temperature-humidity-sensor', 'DHT22 temperature and humidity sensor for environmental monitoring', 4.99, NULL, 'DHT', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Beginner Electronics Kit', 'beginner-electronics-kit', 'Complete electronics starter kit with breadboard and components', 34.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Digital Multimeter', 'digital-multimeter', 'Digital multimeter for measuring voltage, current, resistance', 19.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('OLED Display Module', 'oled-display-module', '0.96-inch OLED display module with 128x64 resolution', 8.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Servo Motor Pack', 'servo-motor-pack', 'Pack of 5 micro servo motors for robotics and automation', 14.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Wireless IoT Sensor Kit', 'wireless-iot-sensor-kit', 'Complete wireless IoT sensor kit with multiple sensors', 49.99, NULL, 'Generic', true, 100)`,
      `INSERT INTO products (name, slug, description, price, discount_price, brand, in_stock, stock_quantity) VALUES ('Breadboard Kit', 'breadboard-kit', 'Breadboard kit with jumper wires and power supply module', 9.99, NULL, 'Generic', true, 100)`,
    ]

    let count = 0
    for (const qry of queries) {
      try {
        await sql.query(qry)
        count++
      } catch (e) {
        // Skip duplicates
      }
    }

    return NextResponse.json({ success: true, inserted: count })
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}

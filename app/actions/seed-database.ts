"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding process...")

    if (!sql) {
      throw new Error("Database client not initialized")
    }

    // Create tables
    await createTables()

    // Seed categories
    await seedCategories()

    // Seed products
    await seedProducts()

    console.log("Database seeding completed successfully!")
    revalidatePath("/admin/products")

    return {
      success: true,
      message: "Database seeded successfully with sample data!",
    }
  } catch (error) {
    console.error("Failed to seed database:", error)
    return {
      success: false,
      error: `Failed to seed database: ${error.message || "Unknown error"}`,
    }
  }
}

async function createTables() {
  // Create categories table
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  // Create products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      discount_price DECIMAL(10, 2),
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      brand VARCHAR(255),
      rating DECIMAL(3, 2) DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      in_stock BOOLEAN DEFAULT TRUE,
      stock_quantity INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  // Create product_images table
  await sql`
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  // Create product_features table
  await sql`
    CREATE TABLE IF NOT EXISTS product_features (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      feature TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  // Create product_specifications table
  await sql`
    CREATE TABLE IF NOT EXISTS product_specifications (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      spec_name VARCHAR(255) NOT NULL,
      spec_value TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  console.log("Tables created successfully")
}

async function seedCategories() {
  // Seed categories
  await sql`
    INSERT INTO categories (name, slug, description)
    VALUES 
      ('Smartphones', 'smartphones', 'Latest smartphones from top brands'),
      ('Laptops', 'laptops', 'Powerful laptops for work and play'),
      ('Audio', 'audio', 'Headphones, earbuds, and speakers'),
      ('Wearables', 'wearables', 'Smartwatches and fitness trackers'),
      ('Accessories', 'accessories', 'Cables, chargers, and cases')
    ON CONFLICT (slug) DO NOTHING;
  `

  console.log("Categories seeded successfully")
}

async function seedProducts() {
  // Seed products for electronics/tech store
  await sql`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('Arduino Starter Kit', 'arduino-starter-kit', 'Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners', 49.99, 39.99, 
        (SELECT id FROM categories WHERE slug = 'smartphones'), 'Arduino', true, 50),
      ('Raspberry Pi 4 - 4GB', 'raspberry-pi-4---4gb', 'The latest Raspberry Pi with 4GB RAM, perfect for desktop computing and IoT projects', 59.99, 54.99, 
        (SELECT id FROM categories WHERE slug = 'smartphones'), 'Raspberry Pi', true, 35),
      ('Electronics Learning Lab', 'electronics-learning-lab', 'Comprehensive electronics learning kit with 100+ projects and detailed instruction manual', 89.99, 79.99, 
        (SELECT id FROM categories WHERE slug = 'smartphones'), 'Learning', true, 20),
      ('Arduino Uno R3 Microcontroller', 'arduino-uno-r3-microcontroller', 'The most used and documented board in the Arduino family, perfect for beginners and experienced makers', 24.99, 19.99, 
        (SELECT id FROM categories WHERE slug = 'laptops'), 'Arduino', true, 100),
      ('Raspberry Pi 4 Model B - 4GB', 'raspberry-pi-4-model-b---4gb', 'The Raspberry Pi 4 Model B with 4GB RAM offers desktop-like performance for a wide range of applications', 45.99, 41.99, 
        (SELECT id FROM categories WHERE slug = 'laptops'), 'Raspberry Pi', true, 60),
      ('Soldering Station Kit - Digital', 'soldering-station-kit---digital', 'Professional-grade soldering station with digital temperature control and adjustable tip temperature', 79.99, 69.99, 
        (SELECT id FROM categories WHERE slug = 'audio'), 'Weller', true, 25),
      ('Multimeter Digital - Professional Grade', 'multimeter-digital---professional-grade', 'High-precision digital multimeter with auto-ranging and backlit display for accurate measurements', 34.99, 29.99, 
        (SELECT id FROM categories WHERE slug = 'audio'), 'Fluke', true, 40),
      ('Breadboard 830 Tie Points - Solderless', 'breadboard-830-tie-points---solderless', 'Durable solderless breadboard perfect for prototyping circuits and electronics projects', 12.99, 9.99, 
        (SELECT id FROM categories WHERE slug = 'wearables'), 'Generic', true, 150),
      ('LED Assortment Kit - 500 Pieces', 'led-assortment-kit---500-pieces', 'Complete assortment of LEDs in various colors and brightness levels for all your electronics projects', 19.99, 14.99, 
        (SELECT id FROM categories WHERE slug = 'wearables'), 'Generic', true, 80),
      ('Sensor Variety Pack - 37 in 1', 'sensor-variety-pack---37-in-1', 'Comprehensive collection of sensors including temperature, motion, light, and more for IoT projects', 29.99, 24.99, 
        (SELECT id FROM categories WHERE slug = 'accessories'), 'Generic', true, 45),
      ('Jumper Wires Kit - 140 Pieces', 'jumper-wires-kit---140-pieces', 'Premium quality jumper wires in various lengths and colors for reliable circuit connections', 15.99, 12.99, 
        (SELECT id FROM categories WHERE slug = 'accessories'), 'Generic', true, 120),
      ('Power Supply Module 5V 3A', 'power-supply-module-5v-3a', 'Stable and reliable 5V 3A power supply module for powering Arduino and Raspberry Pi projects', 22.99, 18.99, 
        (SELECT id FROM categories WHERE slug = 'accessories'), 'Generic', true, 55)
    ON CONFLICT (slug) DO NOTHING;
  `

  // Add product images
  await sql`
    INSERT INTO product_images (product_id, image_url, display_order)
    SELECT id, 'https://placehold.co/600x400?text=' || REPLACE(name, ' ', '+'), 0
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images);
  `

  // Add product features
  await sql`
    INSERT INTO product_features (product_id, feature)
    SELECT id, '1-year warranty included'
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_features);
  `

  // Add product specifications
  await sql`
    INSERT INTO product_specifications (product_id, spec_name, spec_value)
    SELECT id, 'Brand', brand
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_specifications);
  `

  console.log("Products seeded successfully")
}

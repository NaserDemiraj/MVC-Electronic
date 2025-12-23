"use server"

import { simpleSqlQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding process...")

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
  await simpleSqlQuery(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Create products table
  await simpleSqlQuery(`
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
  `)

  // Create product_images table
  await simpleSqlQuery(`
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Create product_features table
  await simpleSqlQuery(`
    CREATE TABLE IF NOT EXISTS product_features (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      feature TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Create product_specifications table
  await simpleSqlQuery(`
    CREATE TABLE IF NOT EXISTS product_specifications (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      spec_name VARCHAR(255) NOT NULL,
      spec_value TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `)

  console.log("Tables created successfully")
}

async function seedCategories() {
  // Seed categories
  await simpleSqlQuery(`
    INSERT INTO categories (name, slug, description)
    VALUES 
      ('Smartphones', 'smartphones', 'Latest smartphones from top brands'),
      ('Laptops', 'laptops', 'Powerful laptops for work and play'),
      ('Audio', 'audio', 'Headphones, earbuds, and speakers'),
      ('Wearables', 'wearables', 'Smartwatches and fitness trackers'),
      ('Accessories', 'accessories', 'Cables, chargers, and cases')
    ON CONFLICT (slug) DO NOTHING;
  `)

  console.log("Categories seeded successfully")
}

async function seedProducts() {
  // Get category IDs
  const categories = await simpleSqlQuery(`SELECT id, slug FROM categories;`)

  // Seed smartphones
  await simpleSqlQuery(`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('iPhone 15 Pro', 'iphone-15-pro', 'Apple''s latest flagship smartphone with advanced camera system and A17 Pro chip.', 999.99, 949.99, 
        (SELECT id FROM categories WHERE slug = 'smartphones'), 'Apple', true, 50),
      ('Samsung Galaxy S23 Ultra', 'samsung-galaxy-s23-ultra', 'Premium Android smartphone with S Pen support and powerful camera system.', 1199.99, null, 
        (SELECT id FROM categories WHERE slug = 'smartphones'), 'Samsung', true, 35)
    ON CONFLICT (slug) DO NOTHING;
  `)

  // Seed laptops
  await simpleSqlQuery(`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('MacBook Pro 16', 'macbook-pro-16', 'Powerful laptop for professionals with M2 Pro/Max chip and stunning display.', 2499.99, 2299.99, 
        (SELECT id FROM categories WHERE slug = 'laptops'), 'Apple', true, 20),
      ('Dell XPS 15', 'dell-xps-15', 'Premium Windows laptop with InfinityEdge display and powerful performance.', 1799.99, null, 
        (SELECT id FROM categories WHERE slug = 'laptops'), 'Dell', true, 15)
    ON CONFLICT (slug) DO NOTHING;
  `)

  // Seed audio products
  await simpleSqlQuery(`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancelling headphones with exceptional sound quality.', 399.99, 349.99, 
        (SELECT id FROM categories WHERE slug = 'audio'), 'Sony', true, 40),
      ('Apple AirPods Pro 2', 'airpods-pro-2', 'Wireless earbuds with active noise cancellation and spatial audio.', 249.99, null, 
        (SELECT id FROM categories WHERE slug = 'audio'), 'Apple', true, 30)
    ON CONFLICT (slug) DO NOTHING;
  `)

  // Seed wearables
  await simpleSqlQuery(`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('Apple Watch Series 9', 'apple-watch-series-9', 'Advanced health and fitness companion with always-on Retina display.', 399.99, 379.99, 
        (SELECT id FROM categories WHERE slug = 'wearables'), 'Apple', true, 25),
      ('Samsung Galaxy Watch 6', 'samsung-galaxy-watch-6', 'Comprehensive health tracking and smart features for Android users.', 299.99, null, 
        (SELECT id FROM categories WHERE slug = 'wearables'), 'Samsung', false, 0)
    ON CONFLICT (slug) DO NOTHING;
  `)

  // Seed accessories
  await simpleSqlQuery(`
    INSERT INTO products (name, slug, description, price, discount_price, category_id, brand, in_stock, stock_quantity)
    VALUES 
      ('Anker 65W GaN Charger', 'anker-65w-gan-charger', 'Compact fast charger with multiple ports for all your devices.', 59.99, 49.99, 
        (SELECT id FROM categories WHERE slug = 'accessories'), 'Anker', true, 100),
      ('Belkin MagSafe 3-in-1 Wireless Charger', 'belkin-magsafe-3-in-1-wireless-charger', 'Charge your iPhone, Apple Watch, and AirPods simultaneously.', 149.99, 129.99, 
        (SELECT id FROM categories WHERE slug = 'accessories'), 'Belkin', true, 45)
    ON CONFLICT (slug) DO NOTHING;
  `)

  // Add product images
  await simpleSqlQuery(`
    INSERT INTO product_images (product_id, image_url, display_order)
    SELECT id, 'https://placehold.co/600x400?text=' || REPLACE(name, ' ', '+'), 0
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images);
  `)

  // Add product features
  await simpleSqlQuery(`
    INSERT INTO product_features (product_id, feature)
    SELECT id, '1-year warranty included'
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_features);
  `)

  // Add product specifications
  await simpleSqlQuery(`
    INSERT INTO product_specifications (product_id, spec_name, spec_value)
    SELECT id, 'Brand', brand
    FROM products
    WHERE id NOT IN (SELECT DISTINCT product_id FROM product_specifications);
  `)

  console.log("Products seeded successfully")
}

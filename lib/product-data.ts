// Centralized product data for fallback when database is not available
// This ensures products can be viewed even without database connection

export interface MockProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  salePrice?: number
  isOnSale?: boolean
  discount?: number
  rating: number
  image: string
  images: string[]
  category: string
  description: string
  inStock: boolean
  stockQuantity: number
  brand?: string
  features?: string[]
  specifications?: Record<string, string>
}

// Helper function to generate slug from product name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// All products with complete data
export const allMockProducts: MockProduct[] = [
  // Featured Products
  {
    id: "featured-1",
    name: "Arduino Starter Kit",
    slug: "arduino-starter-kit",
    price: 49.99,
    originalPrice: 69.99,
    discount: 20,
    rating: 4.8,
    image: "/Arduino Starter Kit.webp",
    images: ["/Arduino Starter Kit.webp"],
    category: "Kits",
    description: "Complete kit with Arduino Uno, breadboard, components, and detailed tutorials for beginners. This comprehensive starter kit includes everything you need to begin your electronics journey, including LEDs, resistors, sensors, and a step-by-step project guide.",
    inStock: true,
    stockQuantity: 50,
    brand: "Arduino",
    features: [
      "Arduino Uno R3 board included",
      "Breadboard and jumper wires",
      "LED, resistor, and sensor assortment",
      "Step-by-step project guide",
      "Online tutorials and support"
    ],
    specifications: {
      "Board": "Arduino Uno R3",
      "Components": "200+ pieces",
      "Projects": "15+ beginner projects",
      "Power": "USB or 9V battery"
    }
  },
  {
    id: "featured-2",
    name: "Raspberry Pi 4 - 4GB",
    slug: "raspberry-pi-4-4gb",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.9,
    image: "/Raspberry Pi 4 - 4GB.jpg",
    images: ["/Raspberry Pi 4 - 4GB.jpg"],
    category: "Microcontrollers",
    description: "The latest Raspberry Pi with 4GB RAM, perfect for desktop computing and IoT projects. Features a quad-core processor, dual 4K HDMI output, and USB 3.0 ports.",
    inStock: true,
    stockQuantity: 35,
    brand: "Raspberry Pi",
    features: [
      "4GB LPDDR4 RAM",
      "Quad-core Cortex-A72 processor",
      "Dual 4K HDMI output",
      "USB 3.0 and USB 2.0 ports",
      "Gigabit Ethernet"
    ],
    specifications: {
      "Processor": "Broadcom BCM2711",
      "RAM": "4GB LPDDR4",
      "WiFi": "802.11ac",
      "Bluetooth": "5.0"
    }
  },
  {
    id: "featured-3",
    name: "Electronics Learning Lab",
    slug: "electronics-learning-lab",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.7,
    image: "/Electronics Learning Lab.webp",
    images: ["/Electronics Learning Lab.webp"],
    category: "Kits",
    description: "Comprehensive electronics learning kit with 100+ projects and detailed instruction manual. Perfect for students and hobbyists wanting to learn electronics from the ground up.",
    inStock: true,
    stockQuantity: 20,
    brand: "Generic",
    features: [
      "100+ electronic projects",
      "Detailed instruction manual",
      "All components included",
      "Progressive difficulty levels",
      "No soldering required"
    ],
    specifications: {
      "Projects": "100+",
      "Skill Level": "Beginner to Intermediate",
      "Age": "10+",
      "Components": "300+ pieces"
    }
  },
  // Popular Products
  {
    id: "1",
    name: "Arduino Uno R3 Microcontroller",
    slug: "arduino-uno-r3-microcontroller",
    price: 24.99,
    rating: 4.8,
    image: "/Arduino Uno R3 Microcontroller.jpg",
    images: ["/Arduino Uno R3 Microcontroller.jpg"],
    category: "Microcontrollers",
    description: "The Arduino Uno R3 is the most used and documented board in the Arduino family, perfect for beginners and experienced makers. It features 14 digital I/O pins, 6 analog inputs, and a USB connection for programming.",
    inStock: true,
    stockQuantity: 100,
    brand: "Arduino",
    features: [
      "ATmega328P microcontroller",
      "14 digital I/O pins",
      "6 analog inputs",
      "USB programming interface",
      "16 MHz clock speed"
    ],
    specifications: {
      "Microcontroller": "ATmega328P",
      "Operating Voltage": "5V",
      "Flash Memory": "32KB",
      "SRAM": "2KB"
    }
  },
  {
    id: "2",
    name: "Raspberry Pi 4 Model B - 4GB",
    slug: "raspberry-pi-4-model-b-4gb",
    price: 45.99,
    rating: 4.9,
    image: "/Raspberry Pi 4 Model B - 4GB.png",
    images: ["/Raspberry Pi 4 Model B - 4GB.png"],
    category: "Microcontrollers",
    description: "The Raspberry Pi 4 Model B with 4GB RAM offers desktop-like performance for a wide range of applications and projects. Perfect for media centers, retro gaming, home automation, and learning to code.",
    inStock: true,
    stockQuantity: 45,
    brand: "Raspberry Pi",
    features: [
      "4GB LPDDR4 RAM",
      "Quad-core ARM Cortex-A72",
      "Dual micro-HDMI ports",
      "2x USB 3.0, 2x USB 2.0",
      "Gigabit Ethernet"
    ],
    specifications: {
      "Processor": "BCM2711 quad-core",
      "RAM": "4GB LPDDR4",
      "Storage": "MicroSD",
      "WiFi": "802.11ac dual-band"
    }
  },
  {
    id: "3",
    name: "Soldering Station Kit - Digital",
    slug: "soldering-station-kit-digital",
    price: 79.99,
    rating: 4.7,
    image: "/Soldering Station Kit - Digital.webp",
    images: ["/Soldering Station Kit - Digital.webp"],
    category: "Tools",
    description: "Professional digital soldering station with adjustable temperature control, multiple tips, and accessories for precision work. Features rapid heating and stable temperature control.",
    inStock: true,
    stockQuantity: 30,
    brand: "Generic",
    features: [
      "Digital temperature display",
      "Adjustable temperature 200-480°C",
      "Multiple soldering tips included",
      "ESD-safe design",
      "Rapid heating technology"
    ],
    specifications: {
      "Power": "60W",
      "Temperature Range": "200-480°C",
      "Display": "LED Digital",
      "Tip Type": "Interchangeable"
    }
  },
  {
    id: "4",
    name: "Ultrasonic Distance Sensor Pack",
    slug: "ultrasonic-distance-sensor-pack",
    price: 12.99,
    rating: 4.6,
    image: "/Ultrasonic Distance Sensor Pack.jpg",
    images: ["/Ultrasonic Distance Sensor Pack.jpg"],
    category: "Sensors",
    description: "Pack of 5 HC-SR04 ultrasonic distance sensors for measuring distances in your robotics and automation projects. Easy to interface with Arduino and other microcontrollers.",
    inStock: true,
    stockQuantity: 80,
    brand: "Generic",
    features: [
      "5 sensors per pack",
      "2cm to 400cm range",
      "3mm accuracy",
      "5V operation",
      "Easy Arduino integration"
    ],
    specifications: {
      "Range": "2-400cm",
      "Accuracy": "3mm",
      "Frequency": "40kHz",
      "Voltage": "5V DC"
    }
  },
  {
    id: "5",
    name: "ESP32 Development Board",
    slug: "esp32-development-board",
    price: 8.99,
    rating: 4.5,
    image: "/ESP32 Development Board.png",
    images: ["/ESP32 Development Board.png"],
    category: "Microcontrollers",
    description: "ESP32 development board with WiFi and Bluetooth capabilities, perfect for IoT projects. Features dual-core processor and low power consumption.",
    inStock: true,
    stockQuantity: 120,
    brand: "Espressif",
    features: [
      "Dual-core processor",
      "Built-in WiFi",
      "Bluetooth 4.2",
      "Low power consumption",
      "38 GPIO pins"
    ],
    specifications: {
      "Processor": "Xtensa LX6 dual-core",
      "Clock": "240 MHz",
      "Flash": "4MB",
      "WiFi": "802.11 b/g/n"
    }
  },
  {
    id: "6",
    name: "DHT22 Temperature & Humidity Sensor",
    slug: "dht22-temperature-humidity-sensor",
    price: 4.99,
    rating: 4.4,
    image: "/DHT22 Temperature & Humidity Sensor.webp",
    images: ["/DHT22 Temperature & Humidity Sensor.webp"],
    category: "Sensors",
    description: "DHT22 temperature and humidity sensor for environmental monitoring projects. High accuracy and reliability for weather stations and climate control.",
    inStock: true,
    stockQuantity: 200,
    brand: "Generic",
    features: [
      "Temperature and humidity",
      "High accuracy",
      "Digital output",
      "Low power consumption",
      "Long-term stability"
    ],
    specifications: {
      "Temperature Range": "-40 to 80°C",
      "Humidity Range": "0-100%",
      "Accuracy": "±0.5°C, ±2%RH",
      "Voltage": "3.3-5V"
    }
  },
  {
    id: "7",
    name: "Beginner Electronics Kit",
    slug: "beginner-electronics-kit",
    price: 34.99,
    rating: 4.7,
    image: "/Beginner Electronics Kit.webp",
    images: ["/Beginner Electronics Kit.webp"],
    category: "Kits",
    description: "Complete electronics starter kit with breadboard, components, and project guide. Perfect for learning the basics of electronics.",
    inStock: true,
    stockQuantity: 60,
    brand: "Generic",
    features: [
      "Breadboard included",
      "Component assortment",
      "Project guide",
      "Jumper wires",
      "Storage case"
    ],
    specifications: {
      "Components": "100+ pieces",
      "Projects": "10+",
      "Skill Level": "Beginner",
      "Age": "8+"
    }
  },
  {
    id: "8",
    name: "Digital Multimeter",
    slug: "digital-multimeter",
    price: 19.99,
    rating: 4.6,
    image: "/Digital Multimeter.webp",
    images: ["/Digital Multimeter.webp"],
    category: "Tools",
    description: "Digital multimeter for measuring voltage, current, resistance, and more. Essential tool for any electronics workbench.",
    inStock: true,
    stockQuantity: 75,
    brand: "Generic",
    features: [
      "Auto-ranging",
      "Large LCD display",
      "Multiple measurement modes",
      "Data hold function",
      "Low battery indicator"
    ],
    specifications: {
      "DC Voltage": "0.1mV - 600V",
      "AC Voltage": "0.1mV - 600V",
      "Resistance": "0.1Ω - 40MΩ",
      "Display": "3.5 digit LCD"
    }
  },
  {
    id: "9",
    name: "OLED Display Module",
    slug: "oled-display-module",
    price: 8.99,
    rating: 4.5,
    image: "/OLED Display Module.webp",
    images: ["/OLED Display Module.webp"],
    category: "Components",
    description: "0.96-inch OLED display module with 128x64 resolution and I2C interface. Perfect for Arduino and Raspberry Pi projects.",
    inStock: true,
    stockQuantity: 150,
    brand: "Generic",
    features: [
      "128x64 resolution",
      "I2C interface",
      "High contrast",
      "Low power consumption",
      "Wide viewing angle"
    ],
    specifications: {
      "Size": "0.96 inch",
      "Resolution": "128x64",
      "Interface": "I2C",
      "Voltage": "3.3-5V"
    }
  },
  {
    id: "10",
    name: "Servo Motor Pack",
    slug: "servo-motor-pack",
    price: 14.99,
    rating: 4.6,
    image: "/Servo Motor Pack.jpg",
    images: ["/Servo Motor Pack.jpg"],
    category: "Components",
    description: "Pack of 5 micro servo motors for robotics and automation projects. Easy to control with PWM signals from Arduino.",
    inStock: true,
    stockQuantity: 90,
    brand: "Generic",
    features: [
      "5 servos per pack",
      "180° rotation",
      "Metal gears",
      "Mounting hardware included",
      "Compatible with Arduino"
    ],
    specifications: {
      "Torque": "1.8kg/cm",
      "Speed": "0.1s/60°",
      "Voltage": "4.8-6V",
      "Weight": "9g each"
    }
  },
  {
    id: "11",
    name: "Wireless IoT Sensor Kit",
    slug: "wireless-iot-sensor-kit",
    price: 49.99,
    rating: 4.7,
    image: "/Wireless IoT Sensor Kit.jpg",
    images: ["/Wireless IoT Sensor Kit.jpg"],
    category: "Kits",
    description: "Complete wireless IoT sensor kit with temperature, humidity, motion, and light sensors. Build your own smart home monitoring system.",
    inStock: true,
    stockQuantity: 25,
    brand: "Generic",
    features: [
      "Multiple sensor types",
      "Wireless connectivity",
      "Easy setup",
      "Cloud compatible",
      "Mobile app support"
    ],
    specifications: {
      "Sensors": "4 types",
      "Wireless": "WiFi 2.4GHz",
      "Range": "50m indoor",
      "Battery": "Rechargeable"
    }
  },
  {
    id: "12",
    name: "Breadboard Kit",
    slug: "breadboard-kit",
    price: 9.99,
    rating: 4.4,
    image: "/Breadboard Kit.jpg",
    images: ["/Breadboard Kit.jpg"],
    category: "Components",
    description: "Breadboard kit with jumper wires and power supply module. Essential for prototyping electronic circuits.",
    inStock: true,
    stockQuantity: 100,
    brand: "Generic",
    features: [
      "830 tie-point breadboard",
      "65 jumper wires",
      "Power supply module",
      "Self-adhesive backing",
      "Durable ABS construction"
    ],
    specifications: {
      "Tie Points": "830",
      "Size": "16.5 x 5.5 cm",
      "Wire Gauge": "22 AWG",
      "Voltage Rating": "300V"
    }
  },
  // Additional products from category pages
  {
    id: "c1",
    name: "Anker 65W GaN Charger",
    slug: "anker-65w-gan-charger",
    price: 39.99,
    rating: 4.8,
    image: "/Anker 65W GaN Charger.webp",
    images: ["/Anker 65W GaN Charger.webp"],
    category: "Components",
    description: "Compact 65W GaN charger with multiple ports. Fast charging for laptops, tablets, and phones.",
    inStock: true,
    stockQuantity: 40,
    brand: "Anker",
    features: [
      "65W total power",
      "GaN technology",
      "Multiple ports",
      "Compact design",
      "Universal compatibility"
    ],
    specifications: {
      "Power": "65W",
      "Ports": "2x USB-C, 1x USB-A",
      "Input": "100-240V",
      "Technology": "GaN II"
    }
  },
  {
    id: "dell-1",
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    price: 1299.99,
    rating: 4.8,
    image: "/Dell XPS 15.webp",
    images: ["/Dell XPS 15.webp"],
    category: "Laptops",
    description: "Premium 15.6-inch laptop with stunning InfinityEdge display and powerful performance for creators and professionals.",
    inStock: true,
    stockQuantity: 15,
    brand: "Dell",
    features: [
      "15.6-inch 4K display",
      "Intel Core i7 processor",
      "16GB RAM",
      "512GB SSD",
      "NVIDIA graphics"
    ],
    specifications: {
      "Display": "15.6\" 4K OLED",
      "Processor": "Intel Core i7-12700H",
      "RAM": "16GB DDR5",
      "Storage": "512GB NVMe SSD"
    }
  }
]

// Function to find product by slug
export function findProductBySlug(slug: string): MockProduct | undefined {
  // First try exact match
  let product = allMockProducts.find(p => p.slug === slug)
  if (product) return product
  
  // Try matching by generated slug from name
  product = allMockProducts.find(p => generateSlug(p.name) === slug)
  if (product) return product
  
  // Try partial match - if slug starts with or contains the search slug
  product = allMockProducts.find(p => p.slug.startsWith(slug) || slug.startsWith(p.slug))
  if (product) return product
  
  // Try matching by slug containing the search term
  product = allMockProducts.find(p => p.slug.includes(slug) || slug.includes(p.slug))
  return product
}

// Function to get products by category
export function getProductsByCategory(category: string): MockProduct[] {
  return allMockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

// Export featured products
export const featuredProducts = allMockProducts.filter(p => p.id.startsWith('featured-'))

// Export popular products
export const popularProducts = allMockProducts.filter(p => !p.id.startsWith('featured-') && !p.id.startsWith('c') && !p.id.startsWith('dell'))

import { neon } from "@neondatabase/serverless"

// Initialize the SQL client with the database URL from environment variables
export function createNeonClient() {
  try {
    // Get the database URL
    const databaseUrl = process.env.DATABASE_URL

    // Log for debugging
    console.log("Database URL available:", !!databaseUrl)

    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not defined")
    }

    // Create the neon client
    const client = neon(databaseUrl)
    console.log("Neon client created successfully")

    return client
  } catch (error) {
    console.error("Failed to create Neon client:", error)
    throw error
  }
}

// Create a global SQL client instance
let sqlClient: ReturnType<typeof neon> | null = null

try {
  sqlClient = createNeonClient()
} catch (error) {
  console.error("Error initializing SQL client:", error)
}

export const sql = sqlClient

// Add back the simpleSqlQuery function for backward compatibility
export async function simpleSqlQuery(query: string) {
  try {
    if (!sql) {
      throw new Error("SQL client is not initialized")
    }

    // Execute the query using the neon client
    // This is a simplified version that just passes the raw query
    // In production, you should use parameterized queries for security
    const result = await sql.query(query)
    return result.rows || []
  } catch (error) {
    console.error("SQL query error:", error)
    throw error
  }
}

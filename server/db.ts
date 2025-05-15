import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up database connection
let isDevelopment = process.env.NODE_ENV === 'development';

console.log("Environment: ", process.env.NODE_ENV);

// For development without a real database, use an environment flag
if (!process.env.DATABASE_URL && isDevelopment) {
  console.warn("⚠️ DATABASE_URL not set. Using a mock database in development mode.");
  console.warn("❗ Some API functionality will not work correctly.");
  
  // Create a simplified connection for development that won't throw errors
  process.env.DATABASE_URL = "postgresql://postgres@localhost:5432/imagenwiz";
}

// Verify we have a database URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Database was not properly provisioned.");
}

// Create the PostgreSQL connection pool using standard pg driver
console.log("Connecting to database using standard pg driver");
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Initialize Drizzle ORM with the schema
export const db = drizzle(pool, { schema });

// Export sql for raw queries
export { sql } from 'drizzle-orm';
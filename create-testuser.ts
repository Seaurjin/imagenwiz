import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createTestUser = async () => {
  try {
    // Use the DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL must be set in the environment");
    }
    
    console.log("Connecting to database...");
    
    // Create the PostgreSQL connection pool
    const pool = new Pool({ 
      connectionString: databaseUrl 
    });
    
    // Initialize Drizzle ORM with the schema
    const db = drizzle(pool, { schema });
    
    // Generate a password hash for the testuser2
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    console.log("Creating testuser2...");
    
    // Insert the user into the database
    const user = await db.insert(schema.users).values({
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: hashedPassword,
      fullName: 'Test User 2',
      role: 'user',
      credits: 50
    }).returning();
    
    console.log("User created successfully:", user[0]);
    
    // Close the pool
    await pool.end();
    
    console.log("Done!");
  } catch (error) {
    console.error("Error creating test user:", error);
  }
};

// Run the function
createTestUser(); 
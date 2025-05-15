import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './shared/schema';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

// Load environment variables from .env file
dotenv.config();

// Configure WebSockets for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Database was not properly provisioned.");
}

const runMigration = async () => {
  // Create the PostgreSQL connection pool
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });

  // Initialize Drizzle ORM with the schema
  const db = drizzle(pool, { schema });

  console.log('Connected to database. Pushing schema...');

  // Create tables based on schema
  try {
    // Create schema using Drizzle's pushSchema functionality
    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "full_name" TEXT,
        "role" TEXT NOT NULL DEFAULT 'user',
        "credits" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    console.log('Creating processing_jobs table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "processing_jobs" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "original_image_url" TEXT NOT NULL,
        "processed_image_url" TEXT,
        "job_type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "error_message" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP
      )
    `);

    console.log('Creating payments table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "amount" INTEGER NOT NULL,
        "credits" INTEGER NOT NULL,
        "status" TEXT NOT NULL,
        "stripe_session_id" TEXT,
        "plan_type" TEXT NOT NULL,
        "is_yearly" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    console.log('Creating languages table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "languages" (
        "id" SERIAL PRIMARY KEY,
        "code" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "native_name" TEXT NOT NULL,
        "is_rtl" BOOLEAN NOT NULL DEFAULT false,
        "flag_code" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT true
      )
    `);
    
    console.log('Creating settings table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" SERIAL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updated_at" TIMESTAMP
      )
    `);
    
    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
  } finally {
    await pool.end();
  }
};

runMigration().catch(console.error);
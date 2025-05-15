import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function createTestUser() {
  // Connect to the local PostgreSQL database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'imagenwiz',
    user: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Check if the users table exists
    const tableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableCheckResult.rows[0].exists;
    
    if (!tableExists) {
      console.log('Creating users table...');
      
      // Create the users table
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'user',
          credits INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      
      console.log('Users table created successfully');
    }

    // Check if testuser2 already exists
    const userCheckResult = await client.query(`
      SELECT * FROM users WHERE username = 'testuser2';
    `);
    
    if (userCheckResult.rows.length > 0) {
      console.log('testuser2 already exists');
      
      // Update the password for testuser2
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await client.query(`
        UPDATE users 
        SET password = $1 
        WHERE username = 'testuser2';
      `, [hashedPassword]);
      
      console.log('Updated password for testuser2');
    } else {
      // Create the test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await client.query(`
        INSERT INTO users (username, email, password, full_name, role, credits)
        VALUES ('testuser2', 'testuser2@example.com', $1, 'Test User 2', 'user', 50);
      `, [hashedPassword]);
      
      console.log('Created testuser2 successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

createTestUser(); 
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './shared/schema';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

// Load environment variables from .env file
dotenv.config();

// Configure WebSockets for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Database was not properly provisioned.");
}

const initializeData = async () => {
  // Create the PostgreSQL connection pool
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });

  // Initialize Drizzle ORM with the schema
  const db = drizzle(pool, { schema });

  console.log('Connected to database. Initializing data...');

  try {
    // Add English language if it doesn't exist
    const englishExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'en'));
    
    if (englishExists.length === 0) {
      console.log('Adding English language...');
      await db.insert(schema.languages).values({
        code: 'en',
        name: 'English',
        nativeName: 'English',
        isRtl: false,
        flagCode: '🇬🇧',
        isActive: true
      });
    }

    // Add Spanish language if it doesn't exist
    const spanishExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'es'));
    
    if (spanishExists.length === 0) {
      console.log('Adding Spanish language...');
      await db.insert(schema.languages).values({
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        isRtl: false,
        flagCode: '🇪🇸',
        isActive: true
      });
    }

    // Add French language if it doesn't exist
    const frenchExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'fr'));
    
    if (frenchExists.length === 0) {
      console.log('Adding French language...');
      await db.insert(schema.languages).values({
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        isRtl: false,
        flagCode: '🇫🇷',
        isActive: true
      });
    }

    // Add German language if it doesn't exist
    const germanExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'de'));
    
    if (germanExists.length === 0) {
      console.log('Adding German language...');
      await db.insert(schema.languages).values({
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        isRtl: false,
        flagCode: '🇩🇪',
        isActive: true
      });
    }

    // Add Japanese language if it doesn't exist
    const japaneseExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'ja'));
    
    if (japaneseExists.length === 0) {
      console.log('Adding Japanese language...');
      await db.insert(schema.languages).values({
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        isRtl: false,
        flagCode: '🇯🇵',
        isActive: true
      });
    }

    // Add Arabic language if it doesn't exist
    const arabicExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'ar'));
    
    if (arabicExists.length === 0) {
      console.log('Adding Arabic language...');
      await db.insert(schema.languages).values({
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        isRtl: true,
        flagCode: '🇸🇦',
        isActive: true
      });
    }

    // Add Chinese language if it doesn't exist
    const chineseExists = await db.select()
      .from(schema.languages)
      .where(eq(schema.languages.code, 'zh'));
    
    if (chineseExists.length === 0) {
      console.log('Adding Chinese language...');
      await db.insert(schema.languages).values({
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        isRtl: false,
        flagCode: '🇨🇳',
        isActive: true
      });
    }

    // Add basic settings if they don't exist
    const logoSetting = await db.select()
      .from(schema.settings)
      .where(eq(schema.settings.key, 'logo'));
    
    if (logoSetting.length === 0) {
      console.log('Adding logo setting...');
      const logoValue = JSON.stringify({
        darkLogo: '/images/logo-dark.svg',
        lightLogo: '/images/logo-light.svg'
      });
      
      await db.insert(schema.settings).values({
        key: 'logo',
        value: logoValue,
        description: 'Application logo URLs'
      });
    }

    // Add an admin user if no users exist
    const users = await db.select().from(schema.users);
    
    if (users.length === 0) {
      console.log('Adding admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await db.insert(schema.users).values({
        username: 'admin',
        email: 'admin@imagenwiz.com',
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'admin',
        credits: 100
      });
    }
    
    console.log('Data initialization complete!');
  } catch (error) {
    console.error('Error initializing data:', error);
  } finally {
    await pool.end();
  }
};

initializeData().catch(console.error);
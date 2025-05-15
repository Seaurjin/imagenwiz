import { eq } from 'drizzle-orm';
import { db } from './db';
import { 
  users, User, InsertUser, 
  processingJobs, ProcessingJob, InsertProcessingJob,
  payments, Payment, InsertPayment,
  languages, Language, InsertLanguage,
  settings, Setting, InsertSetting
} from '@shared/schema';

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: number): Promise<User | undefined>;
  updateUserRole(userId: number, role: string): Promise<User | undefined>;
  
  // Processing job operations
  createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob>;
  getProcessingJob(id: number): Promise<ProcessingJob | undefined>;
  getProcessingJobsByUser(userId: number): Promise<ProcessingJob[]>;
  updateProcessingJobStatus(id: number, status: string, processedImageUrl?: string): Promise<ProcessingJob | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  
  // Language operations
  getLanguages(): Promise<Language[]>;
  getLanguage(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserCredits(userId: number, credits: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ credits })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Processing job operations
  async createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob> {
    const result = await db.insert(processingJobs).values(job).returning();
    return result[0];
  }

  async getProcessingJob(id: number): Promise<ProcessingJob | undefined> {
    const result = await db.select().from(processingJobs).where(eq(processingJobs.id, id));
    return result[0];
  }

  async getProcessingJobsByUser(userId: number): Promise<ProcessingJob[]> {
    return db.select().from(processingJobs).where(eq(processingJobs.userId, userId));
  }

  async updateProcessingJobStatus(id: number, status: string, processedImageUrl?: string): Promise<ProcessingJob | undefined> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (processedImageUrl) {
      updateData.processedImageUrl = processedImageUrl;
    }
    
    const result = await db
      .update(processingJobs)
      .set(updateData)
      .where(eq(processingJobs.id, id))
      .returning();
      
    return result[0];
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }

  // Language operations
  async getLanguages(): Promise<Language[]> {
    return db.select().from(languages);
  }

  async getLanguage(code: string): Promise<Language | undefined> {
    const result = await db.select().from(languages).where(eq(languages.code, code));
    return result[0];
  }

  async createLanguage(language: InsertLanguage): Promise<Language> {
    const result = await db.insert(languages).values(language).returning();
    return result[0];
  }
  
  // Settings operations
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }
  
  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0];
  }
  
  async createSetting(setting: InsertSetting): Promise<Setting> {
    const result = await db.insert(settings).values(setting).returning();
    return result[0];
  }
  
  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const result = await db
      .update(settings)
      .set({ 
        value, 
        updatedAt: new Date() 
      })
      .where(eq(settings.key, key))
      .returning();
    return result[0];
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();
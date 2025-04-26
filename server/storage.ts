import { users, type User, type InsertUser, BlogPost, InsertBlogPost, blogPosts, languages, Language, InsertLanguage, blogTranslations, BlogTranslation, InsertBlogTranslation, settings, Setting, InsertSetting } from "../shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface for all data operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Blog operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost>;
  
  // Blog translation operations
  getBlogTranslation(postId: number, langCode: string): Promise<BlogTranslation | undefined>;
  getBlogTranslations(postId: number): Promise<BlogTranslation[]>;
  createBlogTranslation(insertBlogTranslation: InsertBlogTranslation): Promise<BlogTranslation>;
  
  // Language operations
  getLanguage(id: number): Promise<Language | undefined>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  getLanguages(): Promise<Language[]>;
  createLanguage(insertLanguage: InsertLanguage): Promise<Language>;
  
  // Settings operations
  getSetting(key: string): Promise<Setting | undefined>;
  getSettings(): Promise<Setting[]>;
  createSetting(insertSetting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;
}

// DatabaseStorage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Blog operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }
  
  async getBlogPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
    return db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertBlogPost)
      .returning();
    return post;
  }
  
  // Blog translation operations
  async getBlogTranslation(postId: number, langCode: string): Promise<BlogTranslation | undefined> {
    const [translation] = await db.select()
      .from(blogTranslations)
      .where(
        and(
          eq(blogTranslations.postId, postId),
          eq(blogTranslations.langCode, langCode)
        )
      );
    return translation || undefined;
  }
  
  async getBlogTranslations(postId: number): Promise<BlogTranslation[]> {
    return db.select()
      .from(blogTranslations)
      .where(eq(blogTranslations.postId, postId));
  }
  
  async createBlogTranslation(insertBlogTranslation: InsertBlogTranslation): Promise<BlogTranslation> {
    const [translation] = await db
      .insert(blogTranslations)
      .values(insertBlogTranslation)
      .returning();
    return translation;
  }
  
  // Language operations
  async getLanguage(id: number): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language || undefined;
  }
  
  async getLanguageByCode(code: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.code, code));
    return language || undefined;
  }
  
  async getLanguages(): Promise<Language[]> {
    return db.select().from(languages).where(eq(languages.isActive, true));
  }
  
  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const [language] = await db
      .insert(languages)
      .values(insertLanguage)
      .returning();
    return language;
  }
  
  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }
  
  async getSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }
  
  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values(insertSetting)
      .returning();
    return setting;
  }
  
  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const [setting] = await db
      .update(settings)
      .set({ value })
      .where(eq(settings.key, key))
      .returning();
    return setting;
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();
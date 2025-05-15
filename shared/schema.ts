import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name'),
  role: text('role').default('user').notNull(),
  credits: integer('credits').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  processingJobs: many(processingJobs),
  payments: many(payments)
}));

// Processing jobs table
export const processingJobs = pgTable('processing_jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  originalImageUrl: text('original_image_url').notNull(),
  processedImageUrl: text('processed_image_url'),
  jobType: text('job_type').notNull(), // 'background_removal', 'enhancement', etc.
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

// Processing jobs relations
export const processingJobsRelations = relations(processingJobs, ({ one }) => ({
  user: one(users, {
    fields: [processingJobs.userId],
    references: [users.id]
  })
}));

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(), // Amount in cents
  credits: integer('credits').notNull(),
  status: text('status').notNull(), // 'completed', 'pending', 'failed'
  stripeSessionId: text('stripe_session_id'),
  planType: text('plan_type').notNull(), // 'lite', 'pro'
  isYearly: boolean('is_yearly').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Payments relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  })
}));

// Languages table for multilingual support
export const languages = pgTable('languages', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'en', 'es', 'fr'
  name: text('name').notNull(), // e.g., 'English', 'Spanish', 'French'
  nativeName: text('native_name').notNull(), // e.g., 'English', 'Español', 'Français'
  isRtl: boolean('is_rtl').default(false).notNull(),
  flagCode: text('flag_code'), // For flag icons
  isActive: boolean('is_active').default(true).notNull()
});

// Settings table for application settings
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProcessingJobSchema = createInsertSchema(processingJobs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export const insertLanguageSchema = createInsertSchema(languages).omit({ id: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ProcessingJob = typeof processingJobs.$inferSelect;
export type InsertProcessingJob = z.infer<typeof insertProcessingJobSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
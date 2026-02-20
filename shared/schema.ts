import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizUsers = pgTable("quiz_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  primaryPattern: text("primary_pattern"),
  secondaryPatterns: text("secondary_patterns").array(),
  patternScores: json("pattern_scores").$type<Record<string, number>>(),
  accessLevel: text("access_level").default("free"),
  crashCourseStarted: timestamp("crash_course_started"),
  crashCourseDay: integer("crash_course_day").default(0),
  magicLinkToken: text("magic_link_token"),
  magicLinkExpires: timestamp("magic_link_expires"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizUserSchema = createInsertSchema(quizUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuizUser = z.infer<typeof insertQuizUserSchema>;
export type QuizUser = typeof quizUsers.$inferSelect;

export const PatternType = {
  DISAPPEARING: "disappearing",
  APOLOGY_LOOP: "apologyLoop",
  TESTING: "testing",
  ATTRACTION_TO_HARM: "attractionToHarm",
  COMPLIMENT_DEFLECTION: "complimentDeflection",
  DRAINING_BOND: "drainingBond",
  SUCCESS_SABOTAGE: "successSabotage",
} as const;

export type PatternType = typeof PatternType[keyof typeof PatternType];

export const patternNames: Record<PatternType, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
};

// PDF Viewer - User Progress
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  documentId: varchar("document_id", { length: 50 }).notNull(),
  currentPage: integer("current_page").default(1),
  totalPages: integer("total_pages"),
  percentComplete: integer("percent_complete").default(0),
  pagesViewed: json("pages_viewed").$type<number[]>().default([]),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// PDF Viewer - Bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  documentId: varchar("document_id", { length: 50 }).notNull(),
  pageNumber: integer("page_number").notNull(),
  pageLabel: varchar("page_label", { length: 50 }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

// PDF Viewer - Highlights
export const highlights = pgTable("highlights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  documentId: varchar("document_id", { length: 50 }).notNull(),
  pageNumber: integer("page_number").notNull(),
  text: text("text").notNull(),
  color: varchar("color", { length: 20 }).default("#FFD700"),
  position: json("position").$type<{ start: number; end: number }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHighlightSchema = createInsertSchema(highlights).omit({
  id: true,
  createdAt: true,
});
export type InsertHighlight = z.infer<typeof insertHighlightSchema>;
export type Highlight = typeof highlights.$inferSelect;

// PDF Viewer - Download Logs
export const downloadLogs = pgTable("download_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  documentId: varchar("document_id", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertDownloadLogSchema = createInsertSchema(downloadLogs).omit({
  id: true,
  timestamp: true,
});
export type InsertDownloadLog = z.infer<typeof insertDownloadLogSchema>;
export type DownloadLog = typeof downloadLogs.$inferSelect;

// PDF Viewer - Chat History (for AI context)
export const pdfChatHistory = pgTable("pdf_chat_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  documentId: varchar("document_id", { length: 50 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  message: text("message").notNull(),
  currentPage: integer("current_page"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertPdfChatSchema = createInsertSchema(pdfChatHistory).omit({
  id: true,
  timestamp: true,
});
export type InsertPdfChat = z.infer<typeof insertPdfChatSchema>;
export type PdfChatHistory = typeof pdfChatHistory.$inferSelect;

// Test Users (Admin Panel) - for granting free access
export const testUsers = pgTable("test_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  accessLevel: varchar("access_level", { length: 50 }).notNull(), // 'crash-course', 'quick-start', 'archive'
  godMode: boolean("god_mode").default(false),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestUserSchema = createInsertSchema(testUsers).omit({
  id: true,
  createdAt: true,
});
export type InsertTestUser = z.infer<typeof insertTestUserSchema>;
export type TestUser = typeof testUsers.$inferSelect;

// Portal Chat History (persistent AI conversations)
export const portalChatHistory = pgTable("portal_chat_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPortalChatSchema = createInsertSchema(portalChatHistory).omit({
  id: true,
  createdAt: true,
});
export type InsertPortalChat = z.infer<typeof insertPortalChatSchema>;
export type PortalChatHistory = typeof portalChatHistory.$inferSelect;

// Interrupt Log (streak tracking)
export const interruptLog = pgTable("interrupt_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInterruptLogSchema = createInsertSchema(interruptLog).omit({
  id: true,
  createdAt: true,
});
export type InsertInterruptLog = z.infer<typeof insertInterruptLogSchema>;
export type InterruptLog = typeof interruptLog.$inferSelect;

// Reader Notes (content reader highlights/notes)
export const readerNotes = pgTable("reader_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sectionId: text("section_id").notNull(),
  content: text("content"),
  highlightText: text("highlight_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReaderNoteSchema = createInsertSchema(readerNotes).omit({
  id: true,
  createdAt: true,
});
export type InsertReaderNote = z.infer<typeof insertReaderNoteSchema>;
export type ReaderNote = typeof readerNotes.$inferSelect;

// Reading Progress (content reader section tracking)
export const readingProgress = pgTable("reading_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sectionId: text("section_id").notNull(),
  completed: boolean("completed").default(false),
  lastPosition: real("last_position").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  updatedAt: true,
});
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;

export const portalUsers = pgTable("portal_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPortalUserSchema = createInsertSchema(portalUsers).omit({
  id: true,
  createdAt: true,
});
export type InsertPortalUser = z.infer<typeof insertPortalUserSchema>;
export type PortalUser = typeof portalUsers.$inferSelect;

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  amountPaid: real("amount_paid").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  purchasedAt: true,
});
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export const AccessLevel = {
  CRASH_COURSE: "crash-course",
  QUICK_START: "quick-start",
  ARCHIVE: "archive",
} as const;

export type AccessLevel = typeof AccessLevel[keyof typeof AccessLevel];

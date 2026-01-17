import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json } from "drizzle-orm/pg-core";
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

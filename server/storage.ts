import { type User, type InsertUser, type QuizUser, quizUsers } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface QuizSubmission {
  id: string;
  email: string;
  pattern: string;
  submittedAt: Date;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuizSubmission(data: Omit<QuizSubmission, "id">): Promise<QuizSubmission>;
  getQuizSubmissions(): Promise<QuizSubmission[]>;
  createQuizUser(data: {
    email: string;
    primaryPattern: string;
    secondaryPatterns: string[];
    patternScores: Record<string, number>;
  }): Promise<QuizUser>;
  getQuizUserByEmail(email: string): Promise<QuizUser | null>;
  getQuizUserByToken(token: string): Promise<QuizUser | null>;
  updateQuizUser(id: string, data: Partial<QuizUser>): Promise<QuizUser | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizSubmissions: Map<string, QuizSubmission>;

  constructor() {
    this.users = new Map();
    this.quizSubmissions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuizSubmission(data: Omit<QuizSubmission, "id">): Promise<QuizSubmission> {
    const id = randomUUID();
    const submission: QuizSubmission = { ...data, id };
    this.quizSubmissions.set(id, submission);
    return submission;
  }

  async getQuizSubmissions(): Promise<QuizSubmission[]> {
    return Array.from(this.quizSubmissions.values());
  }

  async createQuizUser(data: {
    email: string;
    primaryPattern: string;
    secondaryPatterns: string[];
    patternScores: Record<string, number>;
  }): Promise<QuizUser> {
    const token = randomUUID();
    const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    try {
      const existing = await db.select().from(quizUsers).where(eq(quizUsers.email, data.email)).limit(1);
      
      if (existing.length > 0) {
        const updated = await db.update(quizUsers)
          .set({
            primaryPattern: data.primaryPattern,
            secondaryPatterns: data.secondaryPatterns,
            patternScores: data.patternScores,
            magicLinkToken: token,
            magicLinkExpires: tokenExpires,
          })
          .where(eq(quizUsers.email, data.email))
          .returning();
        return updated[0];
      }
      
      const result = await db.insert(quizUsers).values({
        email: data.email,
        primaryPattern: data.primaryPattern,
        secondaryPatterns: data.secondaryPatterns,
        patternScores: data.patternScores,
        accessLevel: "free",
        magicLinkToken: token,
        magicLinkExpires: tokenExpires,
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating quiz user:", error);
      throw error;
    }
  }

  async getQuizUserByEmail(email: string): Promise<QuizUser | null> {
    try {
      const result = await db.select().from(quizUsers).where(eq(quizUsers.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error getting quiz user:", error);
      return null;
    }
  }

  async getQuizUserByToken(token: string): Promise<QuizUser | null> {
    try {
      const result = await db.select().from(quizUsers).where(eq(quizUsers.magicLinkToken, token)).limit(1);
      const user = result[0];
      if (user && user.magicLinkExpires && new Date(user.magicLinkExpires) > new Date()) {
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error getting quiz user by token:", error);
      return null;
    }
  }

  async updateQuizUser(id: string, data: Partial<QuizUser>): Promise<QuizUser | null> {
    try {
      const result = await db.update(quizUsers)
        .set(data)
        .where(eq(quizUsers.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error("Error updating quiz user:", error);
      return null;
    }
  }
}

export const storage = new MemStorage();

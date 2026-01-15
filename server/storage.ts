import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export const storage = new MemStorage();

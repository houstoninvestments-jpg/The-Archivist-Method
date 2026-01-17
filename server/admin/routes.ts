import express, { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { testUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const router = express.Router();

const adminTokens = new Map<string, { expires: number }>();

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function generateAdminToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  adminTokens.set(token, { expires: Date.now() + 24 * 60 * 60 * 1000 });
  return token;
}

function verifyAdminToken(token: string): boolean {
  const data = adminTokens.get(token);
  if (!data) return false;
  if (Date.now() > data.expires) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  next();
}

const addTestUserSchema = z.object({
  email: z.string().email(),
  accessLevel: z.enum(["crash-course", "quick-start", "archive"]),
  note: z.string().optional().nullable(),
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return res.status(503).json({ error: "Admin password not configured" });
    }
    
    const { password } = req.body;
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = generateAdminToken();
    res.json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    adminTokens.delete(token);
  }
  res.json({ message: "Logged out" });
});

router.post("/add-test-user", adminAuth, async (req: Request, res: Response) => {
  try {
    const validation = addTestUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    const { email, accessLevel, note } = validation.data;

    const existing = await db.select().from(testUsers).where(eq(testUsers.email, email.toLowerCase()));
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const [newUser] = await db.insert(testUsers).values({
      email: email.toLowerCase(),
      accessLevel,
      note: note || null,
    }).returning();

    res.json(newUser);
  } catch (error) {
    console.error("Add test user error:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

router.get("/test-users", adminAuth, async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(testUsers).orderBy(testUsers.createdAt);
    res.json(users);
  } catch (error) {
    console.error("Get test users error:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

router.delete("/test-user/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(testUsers).where(eq(testUsers.id, id));
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete test user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/stats", adminAuth, async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(testUsers);
    const stats = {
      total: users.length,
      crashCourse: users.filter(u => u.accessLevel === "crash-course").length,
      quickStart: users.filter(u => u.accessLevel === "quick-start").length,
      archive: users.filter(u => u.accessLevel === "archive").length,
    };
    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;

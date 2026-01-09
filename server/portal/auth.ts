import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthToken {
  userId: string;
  email: string;
}

export function generateAuthToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

export async function generateMagicLink(
  email: string,
  userId: string,
  baseUrl: string,
): Promise<string> {
  const token = generateAuthToken(userId, email);
  return `${baseUrl}/portal/auth?token=${token}`;
}

export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashLoginCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyLoginCode(
  code: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

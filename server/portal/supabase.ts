import { db } from "../db";
import { portalUsers, purchases } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  created_at: string;
  stripe_customer_id?: string | null;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  amount_paid: number;
  purchased_at: string;
  stripe_payment_intent_id: string;
}

function toUser(row: typeof portalUsers.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    stripe_customer_id: row.stripeCustomerId,
  };
}

function toPurchase(row: typeof purchases.$inferSelect): Purchase {
  return {
    id: row.id,
    user_id: row.userId,
    product_id: row.productId,
    product_name: row.productName,
    amount_paid: row.amountPaid,
    purchased_at: row.purchasedAt?.toISOString() || new Date().toISOString(),
    stripe_payment_intent_id: row.stripePaymentIntentId,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [row] = await db.select().from(portalUsers).where(eq(portalUsers.email, email));
  return row ? toUser(row) : null;
}

export async function createUser(email: string, stripeCustomerId?: string, name?: string): Promise<User> {
  const [row] = await db.insert(portalUsers).values({
    email,
    name: name || null,
    stripeCustomerId: stripeCustomerId || null,
  }).returning();
  return toUser(row);
}

export async function updateUserName(userId: string, name: string): Promise<User | null> {
  const [row] = await db.update(portalUsers)
    .set({ name })
    .where(eq(portalUsers.id, userId))
    .returning();
  return row ? toUser(row) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const [row] = await db.select().from(portalUsers).where(eq(portalUsers.id, userId));
  return row ? toUser(row) : null;
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const rows = await db.select().from(purchases)
    .where(eq(purchases.userId, userId))
    .orderBy(desc(purchases.purchasedAt));
  return rows.map(toPurchase);
}

export async function createPurchase(
  userId: string,
  productId: string,
  productName: string,
  amountPaid: number,
  stripePaymentIntentId: string,
): Promise<Purchase> {
  const [row] = await db.insert(purchases).values({
    userId,
    productId,
    productName,
    amountPaid,
    stripePaymentIntentId,
  }).returning();
  return toPurchase(row);
}

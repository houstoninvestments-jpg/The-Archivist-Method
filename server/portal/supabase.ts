export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  stripe_customer_id?: string;
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

const users = new Map<string, User>();
const purchases: Purchase[] = [];

export async function getUserByEmail(email: string): Promise<User | null> {
  for (const u of users.values()) {
    if (u.email === email) return u;
  }
  return null;
}

export async function createUser(email: string, stripeCustomerId?: string, name?: string): Promise<User> {
  const id = crypto.randomUUID();
  const user: User = {
    id,
    email,
    name,
    created_at: new Date().toISOString(),
    stripe_customer_id: stripeCustomerId,
  };
  users.set(id, user);
  return user;
}

export async function updateUserName(userId: string, name: string): Promise<User | null> {
  const user = users.get(userId);
  if (!user) return null;
  user.name = name;
  users.set(userId, user);
  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  return users.get(userId) ?? null;
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  return purchases
    .filter(p => p.user_id === userId)
    .sort((a, b) => b.purchased_at.localeCompare(a.purchased_at));
}

export async function createPurchase(
  userId: string,
  productId: string,
  productName: string,
  amountPaid: number,
  stripePaymentIntentId: string,
): Promise<Purchase> {
  const purchase: Purchase = {
    id: crypto.randomUUID(),
    user_id: userId,
    product_id: productId,
    product_name: productName,
    amount_paid: amountPaid,
    purchased_at: new Date().toISOString(),
    stripe_payment_intent_id: stripePaymentIntentId,
  };
  purchases.push(purchase);
  return purchase;
}

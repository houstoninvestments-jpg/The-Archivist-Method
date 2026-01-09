import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
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

// Helper functions
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data as User;
}

export async function createUser(email: string, stripeCustomerId?: string) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, stripe_customer_id: stripeCustomerId }])
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserPurchases(userId: string) {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });

  if (error) throw error;
  return data as Purchase[];
}

export async function createPurchase(
  userId: string,
  productId: string,
  productName: string,
  amountPaid: number,
  stripePaymentIntentId: string,
) {
  const { data, error } = await supabase
    .from("purchases")
    .insert([
      {
        user_id: userId,
        product_id: productId,
        product_name: productName,
        amount_paid: amountPaid,
        stripe_payment_intent_id: stripePaymentIntentId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Purchase;
}

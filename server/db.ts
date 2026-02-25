import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let database: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set - database features will be unavailable");
    return null;
  }
  
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    database = drizzle(pool, { schema });
  }
  
  return database;
}

export function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    initializeDatabase();
  }
  return pool;
}

export function getDb() {
  if (!database) {
    initializeDatabase();
  }
  if (!database) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  return database;
}

// For backwards compatibility - lazy initialization
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getDb();
    return (instance as any)[prop];
  }
});

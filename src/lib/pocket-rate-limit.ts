import { and, eq, gte, lt, sql } from "drizzle-orm";
import { portalChatHistory } from "../../shared/schema";

// Per-day message caps for the Pocket Archivist (/api/portal/chat).
// Tiers passed in as they appear in resolveUserTier():
//   "free"         | "field_guide"       — legacy name "quick-start"
//   "archive"      | "complete_archive"  — two forms for the same paid tier
export const POCKET_DAILY_LIMITS = {
  free: 15,
  field_guide: 75,
  complete_archive: 300,
} as const;

export type NormalisedTier = keyof typeof POCKET_DAILY_LIMITS;

export function normaliseTier(tier: string): NormalisedTier {
  if (tier === "archive" || tier === "complete_archive") return "complete_archive";
  if (tier === "quick-start" || tier === "field_guide") return "field_guide";
  return "free";
}

export interface RateLimitResult {
  allowed: boolean;
  tier: NormalisedTier;
  limit: number;
  used: number;
  /** Unix seconds at which the counter resets (next UTC midnight). */
  resetAt: number;
}

/**
 * Count today's user messages in portal_chat_history for the given user
 * and compare against the tier's daily cap. Reset boundary is UTC midnight
 * so every tenant sees the same rollover moment.
 */
export async function checkPocketRateLimit(
  db: any,
  userId: string,
  rawTier: string,
): Promise<RateLimitResult> {
  const tier = normaliseTier(rawTier);
  const limit = POCKET_DAILY_LIMITS[tier];

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(portalChatHistory)
    .where(
      and(
        eq(portalChatHistory.userId, userId),
        eq(portalChatHistory.role, "user"),
        gte(portalChatHistory.createdAt, start),
        lt(portalChatHistory.createdAt, end),
      ),
    );

  const used = Number(row?.count ?? 0);
  return {
    allowed: used < limit,
    tier,
    limit,
    used,
    resetAt: Math.floor(end.getTime() / 1000),
  };
}

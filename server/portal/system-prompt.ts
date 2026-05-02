import { readFileSync } from "node:fs";
import { join } from "node:path";

const TEMPLATE = readFileSync(
  join(process.cwd(), "docs/character/pocket-archivist-system-prompt.md"),
  "utf-8",
).replace(/^[\s\S]*?\n---\n+/, "");

export interface PocketArchivistContext {
  tierAccess: string;
  patternName: string;
  userTier: string;
  streakCount: number;
}

export function buildPocketArchivistPrompt(ctx: PocketArchivistContext): string {
  return TEMPLATE
    .replace("${tierAccess}", ctx.tierAccess)
    .replace("${patternName}", ctx.patternName)
    .replace("${userTier}", ctx.userTier)
    .replace("${streakCount}", String(ctx.streakCount));
}

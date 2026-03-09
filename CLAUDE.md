# The Archivist Method — Claude Code Configuration

## Git Workflow

**Always commit directly to `main`. Never create feature branches or pull requests.**

- Default branch: `main`
- Push all changes directly to `main` with `git push -u origin main`
- Do not create `claude/*` branches
- Do not open pull requests
- Changes pushed to `main` deploy automatically to thearchivistmethod.com via Replit

## Project Overview

The Archivist Method™ is a dark-themed digital product sales funnel for psychology pattern recognition services. Three tiers: The Crash Course (free), The Field Guide ($47), The Complete Archive ($197).

Full-stack TypeScript: React 18 + Express + PostgreSQL + Drizzle ORM, running on Replit autoscale.

## Brand Rules

- Pink (#EC4899) ONLY on "NOT" in tagline
- NEVER use emoji — use Lucide icons styled with theme colors
- NEVER use "healing/heal/thrive" or "beta/early/founding" language
- Always "Pattern Archaeology, NOT Therapy"
- AI persona: Direct, not harsh; warm, not soft; clinical when needed
- Typography: Bebas Neue (display) + Inter (body) + JetBrains Mono (labels)
- Colors: #000000 bg, #FAFAFA text, #14B8A6 teal accent, #EC4899 pink accent

## Architecture Notes

- Frontend: `client/src/` — Wouter routing, Shadcn/ui, TanStack Query
- Backend: `server/` — Express REST API, all routes prefixed `/api`
- Shared types: `shared/`
- Build: `npm run build` (esbuild), Start: `npm run start`
- DB migrations: `npm run db:push`

## Routes

| Route | Page |
|-------|------|
| / | Landing.tsx |
| /quiz | Quiz.tsx |
| /results | QuizResult.tsx |
| /portal | PortalDashboard.tsx |
| /portal/onboarding | PortalOnboarding.tsx |
| /portal/reader | ContentReader.tsx |
| /vault/workbench | VaultWorkbench.tsx |
| /vault/archive | VaultArchive.tsx |
| /admin | AdminLogin.tsx |
| /admin/dashboard | AdminDashboard.tsx |

## Important Notes

- STRIPE_SECRET_KEY must be a `sk_test_` key for testing (current live key is expired)
- PDF downloads served from `public/downloads/` via authenticated routes
- God mode activated per-user from admin dashboard only

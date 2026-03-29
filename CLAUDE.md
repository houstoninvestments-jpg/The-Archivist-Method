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

## Automation Permissions

Claude is authorized to perform the following without asking for confirmation:

**GitHub (via `gh` CLI)**
- Merge PRs once a fix is complete and CI passes
- Create PRs, check PR status, view CI/build logs
- Push branches and force-push `claude/*` branches only

**Vercel (via `vercel` CLI)**
- Check environment variable status (`vercel env ls`)
- Report missing env vars and suggest values
- View deployment status and logs after a push

**General**
- Run `npm run build` and `npm run db:push` after schema/dependency changes
- Retry failed git pushes up to 4 times with exponential backoff
- Self-diagnose deployment failures using CLI tools before asking the user

## Setup Checklist (one-time, on developer machine)

```bash
brew install gh && gh auth login        # GitHub CLI
npm i -g vercel && vercel login         # Vercel CLI
```

Once both CLIs are authenticated, Claude handles the full deploy-and-verify loop automatically.

## Approved Hero Section (do not revert)
COPY (in order):
- Brand: "THE ARCHIVIST METHOD™"
- File tag: "// SUBJECT FILE LOADING..."
- Confessional lines: "You've watched yourself do it." / "You've tried to stop." / "You did it anyway."
- Reframe: "THAT'S NOT WHO YOU ARE." / "THAT'S A PATTERN RUNNING."
- Final: "THE PATTERN HAS A NAME." + blinking cursor
- Subtext: "Your body sends a signal 3 to 7 seconds before it fires. That signal is learnable. This is the method."
- CTA: "IDENTIFY MY PATTERN — FREE →"
- Meta: "2 MINUTES · 9 PATTERNS · INSTANT RESULTS"
- Tagline: "PATTERN ARCHAEOLOGY, NOT THERAPY." — NOT in magenta #EC4899
ANIMATION: Sequential reveal — brand → divider draws → file tag slides from left → confessional lines reveal upward → separator → reframe drops in bold → separator → final line flickers (CRT effect) → cursor blinks → subtext → CTA → meta
DESIGN: Archivist seated image background with parallax. Scanline effect rgba(0,255,194,0.04). Dark background. No solid fill on CTA button — teal border only.

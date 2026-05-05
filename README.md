# The Archivist Method

A pattern interruption system. Not therapy, not coaching, not self-help. The Archivist Method identifies nine unconscious behavioral patterns — survival code installed in childhood — and gives the reader a mechanical protocol to interrupt them in the 3–7 second gap between trigger and behavior.

**Domain:** [thearchivistmethod.com](https://thearchivistmethod.com)
**Tagline:** Pattern Archaeology, Not Therapy.

---

## The Five-Surface Ecosystem

| Surface | Tier | Role |
|---------|------|------|
| Quiz / Free Crash Course | Free | Discovery + diagnosis |
| The Book (`the-archivist-method/`) | Bundled with Tier 4 | Atmosphere + framework mastery (canonical voice source) |
| The Field Guide | $67 | Pattern-specific application — one pattern, full protocol |
| The Complete Archive | $297 | All nine patterns + advanced material + lifetime access + physical POD softcover + 30-day Pocket Archivist trial |
| The Pocket Archivist | $14.99/mo | Daily companion (free with paid tiers; limited free tier) |

---

## Canonical Source of Truth

| Surface | Canonical Artifact |
|---------|-------------------|
| Voice — long-form prose, framework, atmosphere | [`the-archivist-method/`](the-archivist-method/) |
| Voice — Pocket Archivist (AI surface) | [`docs/character/pocket-archivist-system-prompt.md`](docs/character/pocket-archivist-system-prompt.md) |
| Operations — branches, deploy, env vars, banned words | [`CLAUDE.md`](CLAUDE.md) |

When in doubt about voice, copy, or pattern description, defer to the canonical book at `the-archivist-method/`.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Wouter (routing), Shadcn/ui, TanStack Query, Framer Motion, Tailwind CSS
- **Backend:** Express, TypeScript, all routes prefixed `/api`
- **Database:** PostgreSQL via Supabase, accessed through Drizzle ORM
- **Payments:** Stripe (live + test mode in parallel — see `CLAUDE.md`)
- **AI:** Anthropic Claude API (Pocket Archivist conversational interface)
- **Email:** Resend (transactional, magic links)
- **Deploy:** Vercel — `main` deploys automatically to thearchivistmethod.com

---

## Project Structure

```
.
├── the-archivist-method/   # Canonical book (locked voice source)
├── client/src/             # React SPA (Wouter routes, Shadcn/ui components)
├── server/                 # Express API (routes prefixed /api)
├── api/                    # Vercel serverless function entrypoints
├── shared/                 # Shared TypeScript types and Drizzle schema
├── public/                 # Static assets (PDFs, images)
├── scripts/                # PDF generators (Python + ReportLab) and build script
├── migrations/             # SQL migrations (drizzle-kit)
├── supabase/               # Supabase config and migrations
├── docs/                   # Project documentation
├── builds/                 # Compiled book outputs (FULL.md, FULL.pdf)
└── _archive/               # Archived legacy files (do not edit)
```

---

## Development

```bash
npm install
npm run dev          # Start local Express + Vite dev server
npm run build        # Production build (esbuild + Vite)
npm run start        # Run production build
npm run check        # TypeScript typecheck
npm run db:push      # Apply Drizzle schema changes to Supabase
```

PDF generation:

```bash
python scripts/generate_complete_archive.py     # The Complete Archive
python scripts/generate_crash_course.py         # The 7-Day Crash Course
python scripts/generate_field_guide.py 1        # Field Guide for pattern 1
python scripts/generate-field-guides.py         # All Field Guides
```

---

## Git Workflow

**Always commit directly to `main`.** No feature branches. No pull requests. Pushes to `main` deploy automatically to thearchivistmethod.com via Vercel.

Full operational rules in [`CLAUDE.md`](CLAUDE.md).

---

## Documentation

Start with [`docs/SOUL.md`](docs/SOUL.md) for the brand and philosophy, then [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for technical truth, then [`docs/STATUS.md`](docs/STATUS.md) for the current state and pending launch work.

The full documentation index is in [`docs/README.md`](docs/README.md).

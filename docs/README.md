# THE ARCHIVIST METHOD — DOCUMENTATION

> Last updated: May 5, 2026

---

## 60-Second Overview

The Archivist Method is a **pattern interruption system** — not therapy, not coaching, not self-help. It identifies nine unconscious behavioral patterns (survival code installed in childhood) and gives users a mechanical protocol to interrupt them.

**Domain:** thearchivistmethod.com
**Stack:** React 18 + TypeScript + Tailwind + Wouter + Shadcn/ui + Framer Motion + Express + Drizzle ORM + Supabase + Stripe + Anthropic Claude API, deployed on Vercel
**Five-surface ecosystem:** Free Crash Course → Book → $67 Field Guide → $297 Complete Archive (with physical book + 30-day Pocket Archivist trial) → $14.99/mo Pocket Archivist
**Status:** Pre-launch. The canonical book is locked. Derived surfaces are in alignment pass.

---

## Canonical Sources of Truth

Three locked artifacts. Every other surface inherits from them.

| Surface | Canonical Source |
|---------|------------------|
| Voice — long-form prose, framework, atmosphere | [`the-archivist-method/`](../the-archivist-method/) (the book) |
| Voice — Pocket Archivist (AI surface) | [`docs/character/pocket-archivist-system-prompt.md`](character/pocket-archivist-system-prompt.md) |
| Operations — branches, deploy, env vars, banned words | [`CLAUDE.md`](../CLAUDE.md) (with banned word list mirrored from [`docs/LANGUAGE.md`](LANGUAGE.md)) |

**When in doubt about voice, copy, or pattern description, defer to the canonical book at `the-archivist-method/`.**

---

## Start Here

1. **Read [SOUL.md](SOUL.md) first.** Understand what The Archivist Method is, the philosophy, the nine patterns, the Four Doors Protocol, the five-surface ecosystem.
2. **Then [ARCHITECTURE.md](ARCHITECTURE.md).** Technical truth: stack, folder structure, routes, auth flow.
3. **Then [STATUS.md](STATUS.md).** Where the project stands right now and what's pending for launch.
4. **Then [`CLAUDE.md`](../CLAUDE.md).** Operational rules.

---

## All Documentation

### Brand & Content
| Doc | What It Covers |
|-----|---------------|
| [SOUL.md](SOUL.md) | Brand identity, philosophy, nine patterns, Four Doors, five-surface ecosystem, what the work is and isn't |
| [PATTERNS.md](PATTERNS.md) | All nine patterns: name, description, body signature, cost, interrupt, circuit break |
| [LANGUAGE.md](LANGUAGE.md) | Words we use, words we never use (canonical banned list), tone guide, good vs. bad copy |
| [COPY-VOICE.md](COPY-VOICE.md) | How The Archivist speaks in every context: landing, quiz, results, portal, PDFs, email |
| [STYLE.md](STYLE.md) | Colors, typography, card styles, buttons, visual effects, PDF design elements, seven canonical callout labels |

### Technical
| Doc | What It Covers |
|-----|---------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full stack, folder structure, routes, API endpoints, auth flow |
| [DATABASE.md](DATABASE.md) | Drizzle schema (`shared/schema.ts`), Supabase tables, access tiers, RLS |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Stripe (live + test mode), Claude API (Pocket Archivist), Resend, Supabase, env vars |

### Product & Business
| Doc | What It Covers |
|-----|---------------|
| [PRODUCTS.md](PRODUCTS.md) | Five-surface ecosystem: Crash Course, Book, Field Guide ($67), Complete Archive ($297, with physical book + 30-day Pocket Archivist trial), Pocket Archivist ($14.99/mo) |
| [FUNNEL.md](FUNNEL.md) | Five reader entry paths into the same protocol depth |
| [CONTENT-MAP.md](CONTENT-MAP.md) | Canonical book directory layout, PDF generators, derived products |

### Operations
| Doc | What It Covers |
|-----|---------------|
| [STATUS.md](STATUS.md) | Locked canonical state, pending work for launch, parked items |
| [ROADMAP.md](ROADMAP.md) | Future direction post-launch |

### Character / Voice
| Doc | What It Covers |
|-----|---------------|
| [character/pocket-archivist-system-prompt.md](character/pocket-archivist-system-prompt.md) | Locked Pocket Archivist persona |
| [pattern-origin.md](pattern-origin.md) | Origin notes on the framework |

---

## Key Files Outside `/docs`

| File | Purpose |
|------|---------|
| [`CLAUDE.md`](../CLAUDE.md) | Project-specific Claude Code instructions (operational canonical) |
| [`README.md`](../README.md) | Repo overview |
| [`the-archivist-method/`](../the-archivist-method/) | Canonical book — voice source for the entire ecosystem |
| [`shared/schema.ts`](../shared/schema.ts) | Drizzle ORM schema (canonical for DB structure) |

---

## For New Collaborators or AI Tools

If you are an AI tool, a developer, or a future contributor reading this:

1. Start with [`SOUL.md`](SOUL.md) — understand what the work IS
2. Skim the canonical book at [`the-archivist-method/`](../the-archivist-method/) — the voice you need to inherit
3. Read [`ARCHITECTURE.md`](ARCHITECTURE.md) — understand how it's built
4. Check [`STATUS.md`](STATUS.md) — understand where things stand
5. Read [`CLAUDE.md`](../CLAUDE.md) — understand the working rules
6. Reference other docs as needed for specific tasks

The book at `the-archivist-method/` is the voice canonical. If anything in these derived docs contradicts the book, the book wins.

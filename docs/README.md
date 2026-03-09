# THE ARCHIVIST METHOD — DOCUMENTATION

> Last updated: February 15, 2026

---

## 60-Second Overview

The Archivist Method (TAM) is a **pattern interruption system** — not therapy, not coaching, not self-help. It identifies 9 unconscious behavioral patterns (survival code installed in childhood) and gives users a mechanical protocol to interrupt them.

**Domain:** thearchivistmethod.com
**Stack:** React + TypeScript, Tailwind, Framer Motion, Wouter, Express, Supabase, Stripe, Claude API
**Products:** Free Crash Course → $47 Quick-Start → $197 Complete Archive
**Status:** Pre-launch, ~90% built. Blocking: Stripe live mode, email delivery, payment flow test.

---

## Start Here

1. **Read [SOUL.md](SOUL.md) first.** Understand what TAM is, the philosophy, the 9 patterns, the Four Doors Protocol.
2. **Then [ARCHITECTURE.md](ARCHITECTURE.md).** Technical truth: stack, folder structure, routes, auth flow.
3. **Then [STATUS.md](STATUS.md).** Where the project stands right now and what's blocking launch.

---

## All Documentation

### Brand & Content
| Doc | What It Covers |
|-----|---------------|
| [SOUL.md](SOUL.md) | Brand identity, philosophy, 9 patterns, Four Doors, FEIR, what TAM is and isn't |
| [PATTERNS.md](PATTERNS.md) | All 9 patterns: name, description, body signature, cost, interrupt, circuit break |
| [LANGUAGE.md](LANGUAGE.md) | Words we use, words we never use, tone guide, good vs. bad copy examples |
| [COPY-VOICE.md](COPY-VOICE.md) | How The Archivist speaks in every context: landing, quiz, results, portal, PDFs, email |
| [STYLE.md](STYLE.md) | Colors, typography, card styles, buttons, visual effects, PDF design elements |

### Technical
| Doc | What It Covers |
|-----|---------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full stack, folder structure, routes, API endpoints, auth flow, Vault architecture |
| [DATABASE.md](DATABASE.md) | All Supabase tables, columns, types, relationships, RLS policies |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Stripe, Claude API, Resend, ConvertKit, environment variables |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Replit hosting, domain setup, deploy process, git workflow |

### Product & Business
| Doc | What It Covers |
|-----|---------------|
| [PRODUCTS.md](PRODUCTS.md) | Three tiers defined: what's included, PDF files, Stripe mapping, access levels |
| [FUNNEL.md](FUNNEL.md) | User journey: landing → quiz → results → email → portal. Each step explained. |
| [CONTENT-MAP.md](CONTENT-MAP.md) | Every piece of content: 145 markdown files, 11 PDFs, scripts, data files |

### Operations
| Doc | What It Covers |
|-----|---------------|
| [STATUS.md](STATUS.md) | What's complete, in progress, blocking launch, and parked |
| [ROADMAP.md](ROADMAP.md) | Future vision: Vault V2, content automation, revenue targets, what's NOT planned |
| [WORKFLOW.md](WORKFLOW.md) | How Claude Chat, Claude Code, and Replit AI work together. Git sync flow. |

---

## Key Files Outside /docs

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project-specific Claude Code instructions |
| `AARON-MASTER-PREFERENCES.md` | Aaron's universal AI preferences |
| `TAM-HANDOFF-COMPLETE.md` | Full project handoff document (comprehensive reference) |

---

## For New Collaborators or AI Tools

If you're an AI tool, a developer, or a future version of Aaron reading this:

1. Start with `SOUL.md` — understand what the project IS
2. Read `ARCHITECTURE.md` — understand how it's built
3. Check `STATUS.md` — understand where things stand
4. Read `CLAUDE.md` in the project root — understand the working rules
5. Reference other docs as needed for specific tasks

Everything in these docs is pulled from the actual codebase, not made up. Items marked `[VERIFY]` need confirmation against the live Replit environment.

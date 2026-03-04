# THE ARCHIVIST METHOD — ARCHITECTURE

> Last updated: February 15, 2026

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | Wouter |
| Icons | Lucide React |
| Backend | Node.js / Express (Replit) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT magic links (passwordless) |
| Payments | Stripe Checkout |
| AI | Claude API (Anthropic) |
| Email | Resend (planned), ConvertKit (sequences) |
| PDF Generation | Python + ReportLab |
| Build Tool | Vite |

---

## Repository Structure

This is a content + code monorepo hosted on GitHub at `houstoninvestments-jpg/The-Archivist-Method`. The live app runs on Replit (separate codebase, synced via git).

```
The-Archivist-Method/
├── CLAUDE.md                        # Project-specific Claude instructions
├── AARON-MASTER-PREFERENCES.md      # Aaron's universal AI preferences
├── TAM-HANDOFF-COMPLETE.md          # Full handoff document
├── global-CLAUDE.md                 # Global Claude preferences (deprecated)
│
├── content/
│   └── book/                        # All 145 markdown content files
│       ├── module-0-emergency/      # Crisis protocols (4 files)
│       ├── module-1-foundation/     # What this is, why different (6 files)
│       ├── module-2-four-doors/     # Four Doors Protocol (5 files)
│       ├── module-3-patterns/       # 9 pattern directories, 12 files each (108 files)
│       │   ├── pattern-1-disappearing/
│       │   ├── pattern-2-apology-loop/
│       │   ├── pattern-3-testing/
│       │   ├── pattern-4-attraction-to-harm/
│       │   ├── pattern-5-draining-bond/
│       │   ├── pattern-6-compliment-deflection/
│       │   ├── pattern-7-perfectionism/
│       │   ├── pattern-8-success-sabotage/
│       │   └── pattern-9-rage/
│       ├── module-4-implementation/  # 90-day protocol, daily practice (8 files)
│       ├── module-5-advanced/        # Multiple patterns, relapse (3 files)
│       ├── module-6-context/         # Work, relationships, parenting, body (4 files)
│       ├── module-7-field-notes/     # Letters from the field (1 file)
│       ├── module-8-resources/       # Therapist, glossary, reading (5 files)
│       └── epilogue/                 # Epilogue (1 file)
│
├── the-archivist-method/            # Symlink/mirror of content/book/
│
├── src/
│   ├── components/
│   │   └── vault/                   # Vault UI components
│   │       ├── index.ts
│   │       ├── archive/             # Archive wing (reading content)
│   │       │   ├── ArchiveHome.tsx
│   │       │   ├── ArchiveSearch.tsx
│   │       │   ├── ArtifactCard.tsx
│   │       │   ├── ArtifactReader.tsx
│   │       │   ├── ThreadsPanel.tsx
│   │       │   └── RecentlyOpened.tsx
│   │       └── workbench/           # Workbench wing (tracking/logging)
│   │           ├── WorkbenchHome.tsx
│   │           ├── WorkbenchStats.tsx
│   │           ├── WorkbenchInsights.tsx
│   │           ├── ActivationFlow.tsx
│   │           ├── BrainDump.tsx
│   │           └── RecentLogs.tsx
│   ├── data/
│   │   ├── patterns.ts              # 9 pattern definitions
│   │   └── interrupts.ts            # Circuit break scripts for all 9 patterns
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useActivationLogs.ts     # CRUD for activation logging
│   │   ├── useBrainDumps.ts         # CRUD for brain dump entries
│   │   ├── useUserActivity.ts       # Track artifact reads/bookmarks
│   │   └── useUserStreaks.ts        # Track interrupt streaks
│   ├── lib/
│   │   └── supabase.ts             # Supabase client initialization
│   ├── sql/
│   │   └── vault-schema.sql         # Vault database migration
│   └── types/
│       └── vault.ts                 # TypeScript type definitions
│
├── scripts/
│   ├── generate_complete_archive.py  # Builds the 600+ page Complete Archive PDF
│   ├── generate_crash_course.py      # Builds the 7-Day Crash Course PDF
│   └── generate_field_guide.py       # Builds pattern-specific Field Guide PDFs
│
└── outputs/                          # Generated PDFs
    ├── THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf  (~1.2 MB)
    ├── THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf      (~44 KB)
    └── THE-ARCHIVIST-METHOD-FIELD-GUIDE-*.pdf     (9 files, ~200 KB each)
```

---

## Replit App Structure (Live Site)

The live app on Replit has a separate but overlapping structure:

```
client/
├── src/
│   ├── components/
│   │   ├── ArchivistChatbot.tsx    # AI chatbot widget
│   │   ├── FAQ.tsx                  # FAQ accordion
│   │   ├── Footer.tsx               # Site footer
│   │   ├── Header.tsx               # Navigation
│   │   ├── ProductCard.tsx          # Pricing cards
│   │   └── StaggeredText.tsx        # Animation component
│   ├── pages/
│   │   ├── Landing.tsx              # Main landing page
│   │   ├── QuickStart.tsx           # $47 sales page
│   │   ├── CompleteArchive.tsx      # $197 sales page
│   │   ├── Portal/
│   │   │   ├── Login.tsx            # Magic link login
│   │   │   ├── Dashboard.tsx        # Customer dashboard
│   │   │   └── Preview.tsx          # Testing preview
│   │   ├── ThankYou.tsx             # Post-signup page
│   │   └── Success/
│   │       └── QuickStart.tsx       # Post-purchase page
│   └── App.tsx                      # Route definitions
├── public/
│   ├── archivist-icon.png           # Logo
│   ├── archivist-avatar.jpg         # Chatbot avatar
│   └── products/                    # PDF storage for download
│       ├── quick-start-system.pdf
│       └── complete-archive.pdf
server/
├── routes/
│   ├── portal/
│   │   ├── auth.ts                  # Magic link endpoints
│   │   ├── user-data.ts             # User info endpoint
│   │   └── download.ts              # PDF delivery
│   └── stripe/
│       └── webhook.ts               # Payment processing
└── index.ts                         # Server entry
```

---

## Client-Server Communication

- Frontend is a React SPA served by Vite
- Backend is Express.js running on Replit
- API calls go to `/api/*` routes
- Auth uses JWT tokens stored in HTTP-only cookies
- Supabase client is initialized on the frontend for Vault features (direct DB access via RLS)
- Stripe webhooks hit the server directly at `/api/stripe/webhook`

---

## Auth Flow

1. User enters email on Portal Login page
2. `POST /api/portal/auth/send-login-link` generates a JWT token
3. Magic link with token is sent via email (Resend) [currently logs to console in dev]
4. User clicks link → `GET /api/portal/auth/verify-token` verifies JWT, sets HTTP-only cookie
5. Cookie used for subsequent authenticated requests
6. `GET /api/portal/user-data` returns user info and purchase history
7. `GET /api/portal/download/:productId` serves PDFs after purchase verification

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/portal/auth/send-login-link` | Generate and send magic link |
| GET | `/api/portal/auth/verify-token` | Verify JWT, set auth cookie |
| GET | `/api/portal/user-data` | Get user info and purchases |
| GET | `/api/portal/download/:productId` | Secure PDF download |
| POST | `/api/stripe/webhook` | Handle `checkout.session.completed` |

---

## Vault Architecture

The Vault is the interactive post-purchase experience (Complete Archive tier). It has two wings:

### Archive Wing
- Browse and read content artifacts
- Search across all content
- Track reading progress (opened, completed, bookmarked)
- Thread connections between concepts

### Workbench Wing
- Log pattern activations (pattern, intensity, context, interrupted yes/no)
- Brain dump free-form entries (with suggested pattern detection)
- Track interrupt streaks
- View weekly stats and insights

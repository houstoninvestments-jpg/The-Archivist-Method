# The Archivist Method™

## Overview

The Archivist Method™ is a dark-themed digital product sales funnel for psychology pattern recognition services. The application offers three tiers: The Crash Course (free), The Field Guide ($47), and The Complete Archive ($197). The site features a landing page with product offerings, a 15-question Pattern Identification Quiz with email capture, pattern-specific result pages, and a members-only portal with AI chatbot interface ("The Archivist").

Brand positioning: "Pattern Archaeology, NOT Therapy" with Four Doors Protocol (FEIR) framework. The system supports 9 patterns: Disappearing, Apology Loop, Testing, Attraction to Harm, Compliment Deflection, Draining Bond, Success Sabotage, Perfectionism, and Rage.

The application uses a full-stack TypeScript architecture with React on the frontend and Express on the backend, designed to run on Replit with integrated database and authentication capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (February 2026)

- **Stripe/Purchase Flow**: Migrated user & purchase storage from in-memory Maps to PostgreSQL (portal_users, purchases tables). Added test-purchase endpoint (dev only). Confirmation email system built (logs to console in dev, ready for SendGrid/Resend). Pocket Archivist (chat) now tier-gated: free users blocked, requires Field Guide or Archive purchase.
- **IMPORTANT**: STRIPE_SECRET_KEY is currently a LIVE key (sk_live_) that is EXPIRED. Must be replaced with sk_test_ key before any real Stripe testing.
- Admin system rebuilt: removed GodModeBadge, TestingPanel, URL godmode param; replaced with clean 4-tab admin dashboard (Overview, Users, Content, Settings)
- God mode now works server-side: testUser.godMode=true grants archive tier access in resolveUserTier()
- God mode only activatable from admin dashboard per-user toggle
- Added admin API endpoints: /api/admin/content-audit, /api/admin/test-users/all (DELETE), /api/admin/env-check
- Major codebase cleanup: removed 17 unused pages and 8 unused components
- Consolidated routes from 27 to 9 clean routes
- Renamed products: "Quick-Start System" → "The Field Guide", "7-Day Crash Course" → "The Crash Course"
- Fixed Stripe success URLs to redirect to /portal instead of broken static HTML pages
- Removed old PDF workbook system (public/pdfs/), keeping only Field Guide PDFs in public/downloads/
- Quiz results route changed from /quiz/result/:pattern to /results
- Portal route simplified from /portal/dashboard to /portal
- Removed orphaned components: ContentTab, PortalSidebar, AccountTab, ArchivistChatbot (floating widget), Navbar, PDFViewer, PremiumPDFViewer, PDFReader
- **Quiz neutral option**: Every quiz question now has "This doesn't apply to me" as last option (id ending in 'n'), scored as zero. Styled with muted/dotted appearance.
- **Quiz loading screen**: Analyzing phase replaced with sequential 5-line fade-in (1.5s apart) + teal progress bar. Minimum 8 seconds before redirect. Applied to both standalone Quiz and EmbeddedQuiz.
- **Quiz results redesign**: Removed glitch/typewriter animations. New 3-section layout: The Reveal (pattern + feelSeenCopy), Breadcrumbs (3 bento cards: triggers/costs/willpower), The Gate (email capture with "Send Me The First Step"). Uses homepage design language (Schibsted Grotesk, #111 cards, teal/pink accents).
- **Portal design update**: Replaced Playfair Display with Schibsted Grotesk 900 for headings. Cards updated to #111 bg with #1a1a1a borders and 16px border-radius. Section labels standardized to 11px JetBrains Mono uppercase.
- **Portal onboarding flow**: 3-step onboarding (Confirm Pattern → 60s Video Brief → Pocket Archivist Signal Mapping). Shows once per user, stored via `onboarding_completed` column in `quiz_users`. PortalDashboard redirects to `/portal/onboarding` if not completed. Step 3 reuses the Archivist demo AI endpoint. Routes: GET `/api/portal/onboarding-status`, POST `/api/portal/onboarding-complete`, POST `/api/portal/onboarding-update-pattern`.

## Important Brand Rules

- Pink (#EC4899) ONLY on "NOT" in tagline
- NEVER use emoji - use Lucide icons styled with theme colors
- NEVER use "healing/heal/thrive" or "beta/early/founding" language
- Always "Pattern Archaeology, NOT Therapy"
- AI persona: Direct, not harsh; warm, not soft; clinical when needed

## System Architecture

### Routes (Final)

| Route | Page | Purpose |
|-------|------|---------|
| / | Landing.tsx | Main landing page |
| /quiz | Quiz.tsx | 15-question Pattern Identification Quiz |
| /results | QuizResult.tsx | Pattern-specific result page with email capture |
| /portal | PortalDashboard.tsx | Members portal (auth required) |
| /portal/onboarding | PortalOnboarding.tsx | 3-step onboarding flow (auth required, shows once) |
| /portal/reader | ContentReader.tsx | Interactive content reader with notes, progress tracking (auth required) |
| /vault/workbench | VaultWorkbench.tsx | Vault Workbench - activation tracking (auth required) |
| /vault/archive | VaultArchive.tsx | Vault Archive - artifact library (auth required) |
| /admin | AdminLogin.tsx | Admin login |
| /admin/dashboard | AdminDashboard.tsx | Admin dashboard |
| /terms | Terms.tsx | Terms of service |
| /privacy | Privacy.tsx | Privacy policy |
| /contact | Contact.tsx | Contact page |

### Product Tiers

| Tier | Price | Product ID | PDF |
|------|-------|------------|-----|
| The Crash Course | Free | crash-course | THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf |
| The Field Guide | $47 | quick-start | THE-ARCHIVIST-METHOD-FIELD-GUIDE-{PATTERN}.pdf |
| The Complete Archive | $197 | complete-archive | (all Field Guide PDFs + THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf) |

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server

**Routing**: Wouter for client-side routing

**UI Component Library**: Shadcn/ui components built on Radix UI primitives

**Styling System**: 
- Tailwind CSS for utility-first styling
- CSS variables for theming (dark mode by default)
- Custom design system: black background (#000000), off-white text (#FAFAFA), teal primary accent (#14B8A6), pink secondary accent (#EC4899)

**State Management**: 
- TanStack Query (React Query) for server state management
- Local component state with React hooks

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**API Design**: RESTful API structure with routes prefixed with `/api`

**Payment Processing**: Stripe integration for checkout flows. Success URLs redirect to /portal.

**AI Integration**: Anthropic Claude API for the AI chatbot ("The Archivist") in the member portal

**Build Process**: esbuild for server bundling

### Data Storage

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations

**Migrations**: Drizzle Kit for schema migrations stored in `/migrations` directory

**PDF Downloads**: All PDFs served from `public/downloads/` via authenticated API routes

### Authentication

**Portal Auth**: Cookie-based auth tokens issued after quiz email submission

**Admin Auth**: Password-based admin authentication

### Design System

**Theme**: Dark mode enforced throughout with brutalist minimalism aesthetic

**Typography**: Bebas Neue (display/headlines) + Inter (body text) from Google Fonts

**Path Aliases**: @/ for client/src, @shared for shared code, @assets for static assets

### 9 Supported Patterns

1. Disappearing
2. Apology Loop
3. Testing
4. Attraction to Harm
5. Compliment Deflection
6. Draining Bond
7. Success Sabotage
8. Perfectionism
9. Rage

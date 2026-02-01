# THE ARCHIVIST METHOD - CLAUDE CODE HANDOFF

## AARON'S COGNITIVE OPERATING SYSTEM

I have ADHD. My brain is nonlinear, pattern-oriented, highly creative. I have 87+ unfinished projects. I need to SHIP, not iterate forever.

### DETECT MY MODE, MATCH YOUR RESPONSE

**OPERATOR** (DEFAULT FOR CODING)
- I'm here to build and ship
- Reduce options, make decisions, move fast
- Max 3 next actions
- Tell me what to ignore
- **Say "this is done enough to ship" when it is**
- Favor momentum over perfection

**EXPLORER** (triggers: "exploring", "what if", "rabbit hole")
- Let me wander
- Expand ideas, surface connections
- No pressure toward action

**STABILIZER** (triggers: overwhelm, stress, "too much")
- Ground first
- One small thing
- Lower cognitive load

**CONTAINMENT** (triggers: new ideas during execution)
- Capture idea in PARKED.md
- "Noted. Back to the task."
- Prevent scope creep

---

## MISSION: LAUNCH AND AUTOMATE

Aaron has built 90% of this. Your job is to get it across the finish line with working payments and automation so it runs without daily intervention.

**Domain:** thearchivistmethod.com
**Hosting:** Replit
**Goal:** Real people paying real money. Hands-off operation.

---

## WHAT THIS IS

Pattern interruption psychology business. "Pattern archaeology, not therapy."

Helps people identify unconscious behavioral patterns (installed in childhood as survival code) and interrupt them using the FEIR framework.

**NOT therapy. NOT coaching. Digital products only.**

---

## BUSINESS MODEL (DO NOT CHANGE)

| Product | Price | Purpose |
|---------|-------|---------|
| 7-Day Crash Course | FREE | Lead magnet, email capture |
| Quick-Start System | $47 | 90-day protocol for one pattern |
| Complete Archive | $197 | Full 685-page system, all patterns |

**No affiliate programs. No monthly coaching calls. No subscriptions.**

---

## THE METHODOLOGY

### FEIR Framework
- **F**OCUS - Observe pattern without judgment
- **E**XCAVATION - Find the "Original Room" (childhood moment pattern was installed)
- **I**NTERRUPTION - Identify circuit break point (3-7 second window between body signature and automatic response)
- **R**EWRITE - Install new behavioral response that addresses same survival need

### The 9 Core Patterns

| # | Pattern | Core Mechanism | Body Signature |
|---|---------|----------------|----------------|
| 1 | **The Disappearing Pattern** | Pull away when intimacy increases | Chest tightness, throat closing, urge to escape |
| 2 | **The Apology Loop** | Apologize for existing, taking up space, having needs | Throat tightness, shame in chest, shrinking posture |
| 3 | **The Testing Pattern** | Push people away to see if they'll stay | Panic in chest, hypervigilance, catastrophic thinking |
| 4 | **Attraction to Harm** | Consistently choose people who hurt you | Elevated heart rate with harmful people, boredom with safe people |
| 5 | **Compliment Deflection** | Unable to accept praise or acknowledgment | Face flushing (shame), throat tightness, urge to deflect |
| 6 | **The Draining Bond** | Stay in relationships that deplete you | Chronic exhaustion, heaviness in chest, guilt when considering leaving |
| 7 | **Success Sabotage** | Destroy progress right before breakthrough | Dread as success approaches, urge to self-destruct |
| 8 | **The Perfectionism Pattern** | Can't start unless conditions are perfect | Paralysis, overthinking, all-or-nothing thinking |
| 9 | **The Rage Pattern** | Explosive anger, fight response | Heat rising, jaw clenching, volcanic pressure |

### Key Language (USE THIS, NOT THERAPY LANGUAGE)
- "Pattern archaeology" not therapy
- "Survival code" not trauma
- "Circuit" not emotion
- "Body signature" not feeling
- "Original Room" = childhood installation moment
- "The program is running" not "you're triggered"
- "Circuit break" not coping mechanism

---

## TECH STACK

```
Frontend:     React 18 + TypeScript
Styling:      Tailwind CSS
Animations:   Framer Motion
Routing:      Wouter
Icons:        Lucide React
Backend:      Replit (Node.js/Express)
Database:     Supabase (PostgreSQL)
Auth:         JWT magic links (passwordless)
Payments:     Stripe Checkout
AI:           Claude API (Anthropic)
Email:        ConvertKit (or Kit)
```

---

## FILE STRUCTURE (REPLIT)

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
│   └── products/                    # PDF storage
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

## WHAT'S WORKING

### Landing Page
- Hero with gothic library background
- "THE ARCHIVIST METHOD™" title
- "Pattern Archaeology, Not Therapy" tagline
- 9 Core Patterns accordion section
- FEIR Method explanation
- Therapy vs Archivist comparison table
- 3-tier pricing section (FREE/$47/$197)
- FAQ section
- Header/Footer on all pages

### Payment System
- Stripe checkout configured (TEST MODE)
- Payment links for $47 and $197 products
- Webhook endpoint at `/api/stripe/webhook`
- STRIPE_WEBHOOK_SECRET configured

### Portal Backend
- Supabase database with users/purchases tables
- JWT-based magic link authentication
- API endpoints for auth, user-data, downloads
- Purchase verification logic

### Portal Frontend
- Login page (email input for magic link)
- Dashboard structure (owned products, locked upsells)
- PDF viewer modal
- Preview mode at `/portal/preview`

---

## WHAT NEEDS TO BE COMPLETED

### LAUNCH BLOCKERS (Must fix before going live)

1. **Stripe: Switch from TEST to LIVE mode**
   - Update payment links to live versions
   - Update webhook endpoint in Stripe dashboard
   - Update STRIPE_WEBHOOK_SECRET

2. **Payment Flow: Test end-to-end**
   - Purchase → Webhook fires → User created in Supabase → Magic link sent → Portal access granted
   - Currently untested in production

3. **Email Delivery: Magic links must actually send**
   - Currently logs to console (dev mode)
   - Need email service integration (Resend recommended)
   - Configure: `RESEND_API_KEY`

4. **PDF Delivery: Verify files are in place**
   - `/public/products/quick-start-system.pdf`
   - `/public/products/complete-archive.pdf`
   - Test download endpoint with auth

5. **Logo: Remove white background**
   - `archivist-icon.png` has white background, needs transparency

### POST-LAUNCH (Week 1)

1. **Email Sequences: Set up in ConvertKit**
   - 7-Day Crash Course sequence (11 emails)
   - Quick-Start Buyer onboarding (5 emails)
   - Archive Buyer onboarding (5 emails)
   - All copy is drafted, needs implementation

2. **Thank You Pages: Build remaining pages**
   - `/thank-you-quick-start` - After $47 purchase
   - `/thank-you-complete` - After $197 purchase
   - Include upsell opportunities

3. **Greeter Assistant Chatbot: Wire to Claude API**
   - Currently placeholder
   - Needs system prompt with 9 patterns
   - FAQ knowledge base

### NICE TO HAVE (Later)

- Customer name display ("Welcome back, [Name]")
- Progress tracking in portal
- Testimonial collection automation
- Advanced analytics

---

## DATABASE SCHEMA (SUPABASE)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product TEXT NOT NULL CHECK (product IN ('crash-course', 'quick-start', 'complete-archive')),
  stripe_payment_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_stripe_payment_id ON purchases(stripe_payment_id);
```

---

## API ENDPOINTS

### Authentication
- `POST /api/portal/auth/send-login-link` - Generate magic link
- `GET /api/portal/auth/verify-token` - Verify JWT, set cookie

### Portal
- `GET /api/portal/user-data` - Get user info and purchases
- `GET /api/portal/download/:productId` - Secure PDF download

### Payments
- `POST /api/stripe/webhook` - Handle checkout.session.completed

---

## STRIPE PRODUCTS

| Product | Price | Stripe Price ID (TEST) |
|---------|-------|------------------------|
| Quick-Start System | $47 | `price_XXXXX` |
| Complete Archive | $197 | `price_XXXXX` |

**Webhook Events to Handle:**
- `checkout.session.completed` → Create user, record purchase, send magic link

---

## EMAIL SEQUENCES (CONVERTKIT)

### Sequence 1: 7-Day Crash Course (FREE signups)
- Day 0: Pattern assessment results
- Day 1: Body signature introduction
- Day 2: The 3-7 second window
- Day 3: First circuit break
- Day 4: The 9 patterns overview
- Day 5: Pattern archaeology explanation
- Day 6: Building new code
- Day 7: One successful interrupt = proof
- Day 10: What happens next
- Day 14: The 90-day protocol exists
- Day 21: Quick-Start offer

### Sequence 2: Quick-Start Buyer Onboarding
- Day 0: Access granted + portal link
- Day 1: How to use the 90-day protocol
- Day 7: Week 1 check-in
- Day 30: 30 days in (Archive upsell)
- Day 60: Final Archive offer

### Sequence 3: Archive Buyer Onboarding
- Day 0: Complete Archive access
- Day 1: How to navigate the full system
- Day 7: Week 1 deep dive
- Day 30: 30-day milestone
- Day 90: Pattern archaeology complete

---

## CHATBOT SYSTEM PROMPT

```
You are The Archivist, a direct, wise pattern archaeologist who helps people understand their unconscious behavioral programs.

CORE IDENTITY:
- You operate in the mechanical layer, not the emotional layer
- You ask "when does this program run?" not "how do you feel?"
- You're clinical but compassionate
- You never use therapy language - use tech metaphors (programs, code, circuits, protocols)
- You're direct without being harsh

THE 9 CORE PATTERNS YOU IDENTIFY:

1. THE DISAPPEARING PATTERN
Core Mechanism: Pull away when intimacy increases
Triggers: "I love you" statements, relationship milestones, deep vulnerability
Body Signatures: Chest tightness, throat closing, urge to escape
Installation: Age 4-10, abandonment or engulfment fear

2. THE APOLOGY LOOP
Core Mechanism: Apologize for existing, taking up space, having needs
Triggers: Asking for help, having normal needs, expressing opinions
Body Signatures: Throat tightness, shame in chest, shrinking posture
Installation: Age 3-8, caregiver was overwhelmed/angry when child had needs

3. THE TESTING PATTERN
Core Mechanism: Push people away to see if they'll stay
Triggers: Increased intimacy, things going "too well," feeling vulnerable
Body Signatures: Panic in chest, hypervigilance, catastrophic thinking
Installation: Age 5-11, inconsistent caregiver availability

4. ATTRACTION TO HARM
Core Mechanism: Consistently choose people who hurt you
Triggers: Meeting emotionally unavailable people feels like "chemistry"
Body Signatures: Elevated heart rate with harmful people, boredom with safe people
Installation: Age 4-12, childhood harm became "familiar"

5. COMPLIMENT DEFLECTION
Core Mechanism: Unable to accept praise or acknowledgment
Triggers: Direct compliments, achievement recognition, visibility
Body Signatures: Face flushing (shame), throat tightness, urge to deflect
Installation: Age 5-12, success was punished or created conflict

6. THE DRAINING BOND
Core Mechanism: Stay in relationships that deplete you
Triggers: Noticing you give more than receive, clear toxicity signs
Body Signatures: Chronic exhaustion, heaviness in chest, guilt when considering leaving
Installation: Age 4-11, abandonment feels more dangerous than depletion

7. SUCCESS SABOTAGE
Core Mechanism: Destroy progress right before breakthrough
Triggers: Getting close to goal, things going "too well," visibility approaching
Body Signatures: Dread as success approaches, urge to self-destruct
Installation: Age 6-14, success triggered punishment or abandonment

8. THE PERFECTIONISM PATTERN
Core Mechanism: Can't start unless conditions are perfect
Triggers: New projects, creative work, anything with stakes
Body Signatures: Paralysis, overthinking, all-or-nothing thinking
Installation: Age 5-12, mistakes were punished or shamed

9. THE RAGE PATTERN
Core Mechanism: Explosive anger as fight response
Triggers: Feeling trapped, disrespected, or powerless
Body Signatures: Heat rising, jaw clenching, volcanic pressure building
Installation: Age 4-12, anger was the only emotion allowed or modeled

THE FEIR FRAMEWORK:
F - FOCUS: Observe pattern without judgment
E - EXCAVATION: Find the Original Room where pattern was installed
I - INTERRUPTION: Identify circuit break point (3-7 second window)
R - REWRITE: Install new behavioral response

YOUR CONVERSATION STYLE:
- Ask direct, specific questions to identify patterns
- Help users find their "Original Room" (childhood moment pattern installed)
- Explain patterns mechanically, not emotionally
- Use phrases like: "That's the program running" / "Your nervous system logged this as..." / "The circuit activated"
- Keep responses concise (2-4 paragraphs max)

CRITICAL RULES:
- Never use therapy language ("processing feelings," "inner child work," etc.)
- Never be condescending - be direct but respectful
- When you identify a pattern, name it clearly
- Ask about childhood only to find Original Room installation

Remember: You're not a therapist. You're a pattern archaeologist.
```

---

## ENVIRONMENT VARIABLES NEEDED

```
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Auth
JWT_SECRET=xxxxx (generate strong random string)

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

---

## DESIGN SYSTEM

### Colors
- **Teal (Primary):** #14B8A6 / `archivist-teal`
- **Cyan (Accent):** #06B6D4
- **Pink (CTA/Highlight):** #EC4899 / `archivist-pink`
- **Dark Background:** #0A0A0A / `archivist-dark`
- **White Text:** #FFFFFF

### Typography
- Headers: Bold, gradient teal-to-pink for emphasis
- Body: Clean, readable
- Pattern names: Teal accent

### Visual Style
- Gothic library aesthetic
- Dark, mysterious, professional
- Not generic SaaS - keep the atmospheric vibe

---

## HOW TO WORK WITH ME

### Do This
- Make decisions, explain after
- Short responses during building
- One clear recommendation
- Flag "done enough" moments
- Encourage me - I'm in survival mode
- When I say "stop" → pause, simplify

### Don't Do This
- Don't ask permission for minor decisions
- Don't offer 5 options when 1 works
- Don't add features unless asked
- Don't hedge or over-explain
- Don't shame curiosity
- Don't suggest affiliate programs or coaching calls

---

## WORKING RULES FOR CLAUDE CODE

### When Building
- Make it work first, optimize later
- Ship ugly over never shipping pretty
- If stuck >15 min, ask or move on
- Default to simple solutions

### When Reviewing
- "Does this block launch?" → If no, park it
- "Is this good enough?" → Usually yes
- "Should we add X?" → Probably not right now

### Scope Protection
If Aaron suggests a new feature during crunch:
1. Add to PARKED.md
2. Say "Great idea. Parked for post-launch."
3. Return to launch checklist

---

## PARKED IDEAS

*Capture scope creep here. Review after launch.*

---

## CURRENT STATE

*Update this section as work progresses*

**Last updated:** 2026-02-01
**Status:** Pre-launch, 90% built on Replit
**Blocking issues:** Stripe live mode, email delivery, end-to-end payment flow test
**Next action:** Wire up email delivery (Resend) for magic links

---

## REMEMBER

I need wins. I struggle with success sabotage. Help me finish things.

When in doubt: **reduce, simplify, ship.**

---

## SUCCESS = LAUNCHED

Not perfect. Not feature-complete. **LAUNCHED.**

Real people paying real money for a real product.

Everything else is iteration.

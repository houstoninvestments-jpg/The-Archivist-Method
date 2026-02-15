# THE ARCHIVIST METHOD — PRODUCTS

> Last updated: February 15, 2026
>
> Source: `TAM-HANDOFF-COMPLETE.md`, `outputs/`, `scripts/`

---

## Business Model

Three tiers. Digital products only. No affiliate programs. No coaching calls. No subscriptions.

---

## Tier 1: 7-Day Crash Course

| Field | Value |
|-------|-------|
| **Price** | FREE ($0) |
| **Purpose** | Lead magnet, email capture |
| **Access Level** | Email signup only |
| **Product Slug** | `crash-course` |
| **Stripe** | N/A (free) |

### What's Included

- 7-Day Crash Course PDF
- Introduction to all 9 patterns (overview, not deep dive)
- Body signature identification for all patterns
- Trigger mapping for all patterns
- Circuit Break scripts for all 9 patterns (full and short versions)
- Day-by-day protocol: Identify → Body Signature → Triggers → Circuit Break → First Interrupt → Refine → Decide
- Writing exercises and tracking templates within the PDF

### PDF File

- **Generator:** `scripts/generate_crash_course.py`
- **Output:** `outputs/THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf`
- **Size:** ~44 KB
- **Delivery:** Email / direct download after email capture

---

## Tier 2: Quick-Start System (Field Guide)

| Field | Value |
|-------|-------|
| **Price** | $47 |
| **Purpose** | 90-day protocol for one pattern |
| **Access Level** | Portal access with purchase verification |
| **Product Slug** | `quick-start` |
| **Stripe Price ID** | [VERIFY — test mode `price_XXXXX`] |

### What's Included

- Pattern-specific Field Guide PDF (one of 9, based on user's primary pattern)
- Full deep dive on the selected pattern (all 12 sections)
- At-a-glance overviews of the other 8 patterns
- The Four Doors Protocol (full framework)
- Foundation content (What This Is, Why Not Therapy, Why This Is Different)
- The 90-Day Protocol (map, daily practice, weekly check-in, progress markers)
- Crisis protocols (emergency, five-minute, triage)
- Tracking templates (execution log, weekly check-in, archaeology report, 90-day review)
- Upsell to Complete Archive at end

### PDF Files (9 total, one per pattern)

- **Generator:** `scripts/generate_field_guide.py <1-9>`
- **Output files:**
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-DISAPPEARING.pdf` (~205 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-APOLOGY-LOOP.pdf` (~204 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-TESTING.pdf` (~206 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-ATTRACTION-TO-HARM.pdf` (~209 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-DRAINING-BOND.pdf` (~204 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-COMPLIMENT-DEFLECTION.pdf` (~198 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-PERFECTIONISM.pdf` (~204 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-SUCCESS-SABOTAGE.pdf` (~206 KB)
  - `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-RAGE.pdf` (~212 KB)
- **Delivery:** Portal download after purchase, via `/api/portal/download/quick-start`
- **Replit location:** `client/public/products/quick-start-system.pdf`

---

## Tier 3: The Complete Archive

| Field | Value |
|-------|-------|
| **Price** | $197 |
| **Purpose** | Full system, all 9 patterns, Vault access |
| **Access Level** | Full portal + Vault access |
| **Product Slug** | `complete-archive` |
| **Stripe Price ID** | [VERIFY — test mode `price_XXXXX`] |

### What's Included

- Complete Archive PDF (600+ pages)
- All 9 patterns — full deep dive (not just overview)
- Emergency protocols and crisis triage
- Foundation content (What This Is, Why Not Therapy, Why Different, Who This Isn't For)
- The Four Doors Protocol (all 4 doors in depth)
- Nine Patterns Overview + Identify Your Primary
- Pattern combinations and interaction maps
- Relapse protocol
- Context-specific guides: Work, Relationships, Parenting, Body
- Letters from the field (real-world case studies)
- The 90-Day Protocol (all phases detailed week by week)
- Daily practice, weekly check-in, progress markers
- Tracking templates (5 printable templates)
- Resources: When to seek help, finding a therapist, supporting someone, glossary, reading list
- Epilogue
- **Vault access** (interactive web experience with Workbench + Archive)

### PDF File

- **Generator:** `scripts/generate_complete_archive.py`
- **Output:** `outputs/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf`
- **Size:** ~1.2 MB
- **Delivery:** Portal download after purchase, via `/api/portal/download/complete-archive`
- **Replit location:** `client/public/products/complete-archive.pdf`

---

## Product-to-Database Mapping

| Product | `purchases.product` value | Access Granted |
|---------|--------------------------|----------------|
| Crash Course | `crash-course` | Email sequence only |
| Quick-Start | `quick-start` | Portal + Field Guide download |
| Complete Archive | `complete-archive` | Portal + Archive PDF + Vault |

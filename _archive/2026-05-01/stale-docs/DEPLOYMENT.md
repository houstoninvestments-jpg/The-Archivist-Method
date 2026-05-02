# THE ARCHIVIST METHOD — DEPLOYMENT

> Last updated: February 15, 2026

---

## Hosting

The live app runs on **Replit**. The domain **thearchivistmethod.com** points to the Replit deployment.

---

## How the App Runs

- Replit runs the full-stack app (Express backend + Vite-built React frontend)
- The Express server serves both the API routes and the static frontend build
- Replit automatically restarts the app on deploy/republish
- The app is always-on via Replit's deployment feature

---

## Domain Setup

- **Domain:** thearchivistmethod.com
- **DNS:** Configured to point to Replit's deployment URL
- **SSL:** Handled automatically by Replit

---

## Environment Variables

All environment variables are stored in **Replit Secrets** (not in `.env` files). See `INTEGRATIONS.md` for the full list.

To update:
1. Open Replit project
2. Go to Secrets panel (lock icon in sidebar)
3. Add/update the key-value pair

---

## How to Deploy / Republish

1. Make changes in Replit editor or sync from GitHub
2. Replit automatically rebuilds on file changes
3. For manual deploy: use the "Deploy" button in Replit
4. The app restarts with the new code

---

## Git Workflow: GitHub ↔ Replit

### The Flow

```
Claude Code ──push──→ GitHub (houstoninvestments-jpg/The-Archivist-Method)
                          │
                          ↓
Replit ←──fetch/merge──── GitHub
```

### Pushing from Claude Code to GitHub

Claude Code develops on feature branches and pushes:
```bash
git push -u origin claude/<branch-name>
```

### Pulling into Replit from GitHub

In Replit Shell:
```bash
git fetch origin main
git merge origin/main
```

Or for a specific branch:
```bash
git fetch origin <branch-name>
git merge origin/<branch-name>
```

### Connecting Replit to GitHub

Replit can be connected to GitHub via:
1. Replit project settings → Version Control
2. Link to the GitHub repo
3. Changes can be pulled from GitHub into Replit

### Handling Merge Conflicts

If conflicts occur in Replit Shell:
1. `git status` to see conflicting files
2. Open conflicting files and resolve manually
3. `git add <resolved-files>`
4. `git commit -m "Resolve merge conflicts"`

---

## PDF Generation

PDFs are generated locally (not on Replit) using Python + ReportLab:

```bash
# Generate all products
python3 scripts/generate_complete_archive.py    # → outputs/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf
python3 scripts/generate_crash_course.py        # → outputs/THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf
python3 scripts/generate_field_guide.py 1       # → outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-DISAPPEARING.pdf
python3 scripts/generate_field_guide.py 2       # ... through 9
```

Generated PDFs go to `outputs/`. They need to be copied to Replit's `client/public/products/` for download delivery.

---

## Dependencies

### Python (PDF generation)
- `reportlab` — PDF generation library

### Node.js (Replit app)
- See Replit's `package.json` for full list
- Key dependencies: React, TypeScript, Tailwind, Vite, Express, Wouter, Framer Motion, Stripe, Supabase, Lucide React

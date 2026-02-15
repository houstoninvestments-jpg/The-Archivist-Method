# THE ARCHIVIST METHOD — AI WORKFLOW

> Last updated: February 15, 2026

---

## Three AI Tools

TAM development uses three AI tools, each with a specific role:

| Tool | Role | What It Does |
|------|------|-------------|
| Claude Chat (claude.ai) | Strategy & planning | Strategy sessions, planning, prompts, debugging guidance, copy review |
| Claude Code (CLI) | Code generation & content | Builds components, generates PDFs, writes content, pushes to GitHub |
| Replit AI | Live implementation | Implements changes in the running app, debugging in-context |

---

## Claude Chat (claude.ai)

**When to use:** Thinking, planning, debugging, writing prompts, reviewing copy.

**What it does:**
- Strategy sessions: "What should the funnel look like?"
- Prompt engineering: writing system prompts for the chatbot
- Debugging guidance: "This API endpoint returns 500, here's the error..."
- Copy review: "Does this landing page copy match the Archivist voice?"
- Architecture decisions: "Should I use JWT or session-based auth?"

**What it doesn't do:**
- Write directly to files
- Push to GitHub
- Run in the Replit environment

---

## Claude Code (CLI)

**When to use:** Building, coding, file creation, git operations.

**What it does:**
- Writes and edits source files
- Generates PDF content (creates/edits Python generator scripts)
- Creates documentation
- Pushes to GitHub
- Runs commands (build, test, git)

**Git workflow:**
1. Claude Code works on a feature branch (e.g., `claude/<feature-name>-<id>`)
2. Pushes to GitHub: `git push -u origin claude/<branch-name>`
3. Changes are merged on GitHub (PR or direct merge)
4. Replit pulls the merged changes

**What it doesn't do:**
- Run the live Replit app
- Access Replit Secrets
- Deploy to production

---

## Replit AI

**When to use:** Making changes to the live running app.

**What it does:**
- Edits files directly in the Replit codebase
- Has access to Replit Secrets (environment variables)
- Can run the dev server and see results immediately
- Handles Replit-specific configuration

**What it doesn't do:**
- Push to GitHub (manual step in Replit Shell)
- Generate PDFs (no Python/ReportLab in Replit)
- Access this repo's content files directly

---

## Git Sync Flow

### Claude Code → GitHub → Replit

```
┌─────────────┐     git push     ┌──────────┐     git fetch/merge     ┌─────────┐
│ Claude Code │ ──────────────→ │  GitHub  │ ←───────────────────── │ Replit  │
│   (local)   │                  │   repo   │                        │  (live) │
└─────────────┘                  └──────────┘                        └─────────┘
```

### Step by Step

1. **Claude Code** develops on a branch and pushes:
   ```bash
   git push -u origin claude/<branch-name>
   ```

2. **GitHub** receives the push. Optionally create a PR and merge.

3. **Replit** pulls the changes:
   ```bash
   # In Replit Shell
   git fetch origin main
   git merge origin/main
   ```

   Or for a feature branch:
   ```bash
   git fetch origin <branch-name>
   git merge origin/<branch-name>
   ```

### Replit → GitHub (less common)

If changes are made directly in Replit:
```bash
# In Replit Shell
git add .
git commit -m "description of changes"
git push origin main
```

---

## Handling Merge Conflicts

If Replit and Claude Code both modified the same file:

1. In Replit Shell: `git fetch origin && git merge origin/main`
2. If conflicts: open conflicting files, resolve manually
3. `git add <resolved-files>`
4. `git commit -m "Resolve merge conflicts"`

**Best practice:** Avoid editing the same files in both environments simultaneously. Use Claude Code for content/docs/PDF scripts. Use Replit for app code/routes/components.

---

## Which Tool for What

| Task | Tool |
|------|------|
| Write a new React component | Replit AI or Claude Code |
| Fix a bug in the live app | Replit AI |
| Generate PDF content | Claude Code |
| Write documentation | Claude Code |
| Plan a new feature | Claude Chat |
| Debug an API error | Claude Chat (analysis) → Replit AI (fix) |
| Write email sequence copy | Claude Chat or Claude Code |
| Push code to GitHub | Claude Code |
| Deploy to production | Replit (Deploy button) |
| Update environment variables | Replit (Secrets panel) |
| Write chatbot system prompt | Claude Chat |
| Create database migrations | Claude Code (write SQL) → Replit (run in Supabase) |

# Vault Tables — Usage Audit (2026-04-20)

Scope: `activation_logs`, `brain_dumps`, `user_activity`, `user_streaks`.
Goal: trace each table through the codebase before deciding how to
handle its RLS policies. No fixes in this pass — findings only.

## Executive finding (applies to all four tables)

**Scenario A — Stub. All four tables are declared and have code that
*would* read/write them, but none of that code is wired into the
running app.** The vault subsystem is dead code. Specifics:

1. **Every file that references these tables lives under the
   repo-root `src/` tree** (`/src/components/vault/*`,
   `/src/hooks/useActivationLogs.ts`, `/src/hooks/useBrainDumps.ts`,
   `/src/hooks/useUserActivity.ts`, `/src/hooks/useUserStreaks.ts`,
   `/src/lib/supabase.ts`, `/src/types/vault.ts`).
2. **The Vite build root is `client/`, with `@` aliased to
   `client/src`.** See `vite.config.ts:11`. Nothing in `client/src`
   imports from the root `src/` tree. Verified via:
   ```bash
   grep -rnE "from ['\"](\.\./)+src/|from ['\"]/src/|from ['\"]~/src/" client/src
   # → zero hits
   grep -rn "from ['\"].*src/lib/supabase" .
   # → zero hits (outside node_modules / dist / api bundle)
   grep -rn "from ['\"].*src/hooks\|from ['\"].*src/components/vault" .
   # → zero hits
   ```
3. **No route mounts a vault page.** `client/src/App.tsx` defines
   routes for `/`, `/quiz`, `/results`, `/portal`, `/admin`, `/terms`,
   `/privacy`, `/contact`, `/checkout`, and not-found. There is no
   `/vault`, `/vault/workbench`, or `/vault/archive` route. The
   `VaultWorkbench.tsx` and `VaultArchive.tsx` filenames listed in
   CLAUDE.md do not exist in the repo.
4. **The production bundle contains zero references to any of the
   four tables.** Verified:
   ```bash
   grep -o "user_activity\|activation_logs\|brain_dumps\|user_streaks" \
     dist/public/assets/*.js | sort -u
   # → (empty)
   ```
5. There is a parallel, mostly-empty `client/src/types/vault.ts` that
   is byte-identical to `/src/types/vault.ts`, imported only by
   `client/src/data/interrupts.ts` and `client/src/data/patterns.ts`,
   which are themselves imported by nothing. Dead code all the way
   down.

## Per-table evidence

### 1. `activation_logs`

| File | Role | Read / Write | Client or Server |
|---|---|---|---|
| `src/sql/vault-schema.sql` (lines 19-32, 61, 71-73) | schema + indexes + RLS | — | SQL |
| `src/types/vault.ts:53` | `ActivationLog` interface | — | TS type |
| `src/components/vault/workbench/ActivationFlow.tsx:79` | `supabase.from('activation_logs').insert({...})` | **WRITE** | Browser, anon key |
| `src/components/vault/workbench/RecentLogs.tsx:55` | `supabase.from('activation_logs').select(...)` | **READ** | Browser, anon key |
| `src/components/vault/workbench/WorkbenchInsights.tsx:116` | select | **READ** | Browser, anon key |
| `src/components/vault/workbench/WorkbenchStats.tsx:55, 62, 70, 75` | select (counts) | **READ** | Browser, anon key |
| `src/hooks/useActivationLogs.ts:36, 63` | select + insert | **READ + WRITE** | Browser, anon key |
| `client/src/types/vault.ts:53` | identical interface copy | — | TS type |
| `docs/ARCHITECTURE.md`, `docs/CONTENT-MAP.md`, `docs/DATABASE.md`, `docs/STATUS.md` | docs only | — | — |
| Server routes (`server/`, `api/`) | — | — | **no references** |

Summary: would be client-anon-key if reachable. Not reachable. **No
UI currently shows activation logs.**

### 2. `brain_dumps`

| File | Role | Read / Write | Client or Server |
|---|---|---|---|
| `src/sql/vault-schema.sql` (lines 35-45, 62, 76-80) | schema + indexes + RLS | — | SQL |
| `src/types/vault.ts:63, 154` | `BrainDumpRecord` + `BrainDumpProps` | — | TS type |
| `src/components/vault/workbench/BrainDump.tsx:81` | `supabase.from('brain_dumps').insert({...})` | **WRITE** | Browser, anon key |
| `src/components/vault/workbench/WorkbenchHome.tsx:16, 128` | lazy-imports `./BrainDump` | — | Browser |
| `src/components/vault/index.ts:8` | re-exports `BrainDump` | — | — |
| `src/hooks/useBrainDumps.ts:28, 50, 68` | select + insert + update | **READ + WRITE** | Browser, anon key |
| `client/src/types/vault.ts:63, 154` | identical interface copy | — | TS type |
| Server routes (`server/`, `api/`) | — | — | **no references** |

Summary: would be client-anon-key if reachable. Not reachable. **No
UI currently shows a brain-dump input.**

### 3. `user_activity`

| File | Role | Read / Write | Client or Server |
|---|---|---|---|
| `src/sql/vault-schema.sql` (lines 7-16, 60, 66-68) | schema + indexes + RLS | — | SQL |
| `src/types/vault.ts:72` | `UserActivity` interface | — | TS type |
| `src/components/vault/archive/ArchiveHome.tsx:139` | `supabase.from('user_activity').insert({...})` | **WRITE** | Browser, anon key |
| `src/components/vault/archive/RecentlyOpened.tsx:65` | select | **READ** | Browser, anon key |
| `src/hooks/useUserActivity.ts:27, 49` | select + insert | **READ + WRITE** | Browser, anon key |
| `client/src/types/vault.ts:72` | identical interface copy | — | TS type |
| Server routes (`server/`, `api/`) | — | — | **no references** |

Summary: would be client-anon-key if reachable. Not reachable. **No
"recently opened" UI in the portal.**

### 4. `user_streaks`

| File | Role | Read / Write | Client or Server |
|---|---|---|---|
| `src/sql/vault-schema.sql` (lines 48-53, 63, 83-85) | schema + RLS | — | SQL |
| `src/types/vault.ts:80` | `UserStreak` interface | — | TS type |
| `src/components/vault/workbench/ActivationFlow.tsx:90, 107, 115` | select + update + insert | **READ + WRITE** | Browser, anon key |
| `src/components/vault/workbench/WorkbenchStats.tsx:82` | select | **READ** | Browser, anon key |
| `src/hooks/useUserStreaks.ts:24, 62, 79` | select + update + insert | **READ + WRITE** | Browser, anon key |
| `client/src/types/vault.ts:80` | identical interface copy | — | TS type |
| Server routes (`server/`, `api/`) | — | — | **no references** |

Summary: would be client-anon-key if reachable. Not reachable. **No
streak display in the portal UI.**

## Note on the `interrupt_log` table

The live app *does* track streaks, but via a different, unrelated
table — `interrupt_log` — defined in `shared/schema.ts:192-204` and
exercised by `server/portal/routes.ts` and `api/portal-routes.ts`
through a proper server-side JWT auth path. That table is the one
wired into the real portal. `user_streaks` is a parallel, never-used
design that was never cut over to.

## Scenario mapping

| Table | Scenario | Reason |
|---|---|---|
| `activation_logs` | **A — Stub** | Code referencing it exists only under `/src/` (not built into `client/`). Bundle has zero references. No UI. |
| `brain_dumps`     | **A — Stub** | Same as above. |
| `user_activity`   | **A — Stub** | Same as above. |
| `user_streaks`    | **A — Stub** | Same as above. Live streak feature uses `interrupt_log` instead. |

## Recommendation (not a fix — your call)

Because all four fall in Scenario A, any of the three following
paths is safe:

1. **Drop the tables and the `/src/` dead-code tree in one commit.**
   Simplest. Removes ~1,500 lines of unreachable client code and
   four Supabase tables. No RLS decision needed because there's
   nothing to protect.
2. **Keep the tables, drop only the `/src/` code.** If you want to
   reserve the names for a future vault build-out, add RLS with no
   policies (service-role-only). The tables become inert storage
   until code is wired up.
3. **Keep everything as-is.** Then the RLS lockdown in
   `supabase/migrations/20260420_enable_rls_on_unprotected_tables.sql`
   is incomplete — these four also need `ENABLE ROW LEVEL SECURITY
   + REVOKE ALL FROM anon, authenticated` applied, because their
   current own-row policies depend on `auth.uid()` which is always
   NULL in this codebase (no Supabase Auth on the client). Without
   that, any existing grants from when the tables were created via
   SQL could leave them accessible to anon.

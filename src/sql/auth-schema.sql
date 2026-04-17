-- ============================================================
-- THE ARCHIVIST METHOD — Auth + Session Schema
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
-- Depends on Supabase Auth (auth.users) being enabled.
-- ============================================================

-- ----- users -------------------------------------------------
-- Mirror of auth.users with app-specific profile fields.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  primary_pattern TEXT,
  secondary_patterns TEXT[] DEFAULT ARRAY[]::TEXT[],
  access_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (access_tier IN ('free', 'field_guide', 'complete_archive', 'subscription')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a public.users row whenever auth.users gets one.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----- sessions ----------------------------------------------
-- A "session" here is a user-created journaling/archiving session,
-- not an auth session.
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entry_path TEXT,
  emotion_selection TEXT,
  transcript JSONB DEFAULT '[]'::JSONB,
  pattern_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  session_summary TEXT,
  ai_annotations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_created
  ON public.sessions(user_id, created_at DESC);

-- ----- journal_entries ---------------------------------------
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created
  ON public.journal_entries(user_id, created_at DESC);

-- ----- pattern_file ------------------------------------------
-- One observations document per user (singleton per user_id).
CREATE TABLE IF NOT EXISTS public.pattern_file (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  observations TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pattern_file_user_id ON public.pattern_file(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_file ENABLE ROW LEVEL SECURITY;

-- users: a user may read + update only their own row.
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- sessions: full CRUD scoped to owner.
DROP POLICY IF EXISTS "sessions_all_own" ON public.sessions;
CREATE POLICY "sessions_all_own" ON public.sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- journal_entries: full CRUD scoped to owner.
DROP POLICY IF EXISTS "journal_entries_all_own" ON public.journal_entries;
CREATE POLICY "journal_entries_all_own" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- pattern_file: full CRUD scoped to owner.
DROP POLICY IF EXISTS "pattern_file_all_own" ON public.pattern_file;
CREATE POLICY "pattern_file_all_own" ON public.pattern_file
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Keep pattern_file.updated_at fresh on every update.
CREATE OR REPLACE FUNCTION public.touch_pattern_file_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pattern_file_set_updated_at ON public.pattern_file;
CREATE TRIGGER pattern_file_set_updated_at
  BEFORE UPDATE ON public.pattern_file
  FOR EACH ROW EXECUTE FUNCTION public.touch_pattern_file_updated_at();

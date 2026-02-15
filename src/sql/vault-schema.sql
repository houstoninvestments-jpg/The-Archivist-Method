-- ============================================================
-- THE ARCHIVIST VAULT — Supabase Schema Migration
-- Run this in Supabase SQL Editor to create Vault tables
-- ============================================================

-- User activity tracking for Archive wing
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  artifact_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('opened', 'completed', 'bookmarked')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_timestamp ON user_activity(user_id, timestamp DESC);

-- Workbench activation logs
CREATE TABLE IF NOT EXISTS activation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_id INTEGER NOT NULL CHECK (pattern_id BETWEEN 1 AND 9),
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  context TEXT,
  interrupted BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activation_logs_user_id ON activation_logs(user_id);
CREATE INDEX idx_activation_logs_timestamp ON activation_logs(user_id, timestamp DESC);
CREATE INDEX idx_activation_logs_week ON activation_logs(user_id, timestamp)
  WHERE timestamp > NOW() - INTERVAL '14 days';

-- Brain dumps
CREATE TABLE IF NOT EXISTS brain_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  suggested_pattern INTEGER CHECK (suggested_pattern IS NULL OR suggested_pattern BETWEEN 1 AND 9),
  converted_to_log BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brain_dumps_user_id ON brain_dumps(user_id);
CREATE INDEX idx_brain_dumps_timestamp ON brain_dumps(user_id, timestamp DESC);

-- User streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_interrupt_date DATE
);

-- ============================================================
-- Row Level Security (RLS)
-- Users can only access their own data
-- ============================================================

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activation logs"
  ON activation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activation logs"
  ON activation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own brain dumps"
  ON brain_dumps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brain dumps"
  ON brain_dumps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brain dumps"
  ON brain_dumps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own streaks"
  ON user_streaks FOR ALL USING (auth.uid() = user_id);

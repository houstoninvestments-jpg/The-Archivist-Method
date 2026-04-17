import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { readCache, writeCache, isOnline } from './localCache';

export type SessionRow = {
  id: string;
  user_id: string;
  entry_path: string | null;
  emotion_selection: string | null;
  transcript: unknown;
  pattern_tags: string[];
  session_summary: string | null;
  ai_annotations: string | null;
  created_at: string;
};

export type NewSession = {
  entry_path?: string | null;
  emotion_selection?: string | null;
  transcript?: unknown;
  pattern_tags?: string[];
  session_summary?: string | null;
  ai_annotations?: string | null;
};

const TABLE = 'sessions';

function makeLocal(userId: string, input: NewSession): SessionRow {
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    entry_path: input.entry_path ?? null,
    emotion_selection: input.emotion_selection ?? null,
    transcript: input.transcript ?? [],
    pattern_tags: input.pattern_tags ?? [],
    session_summary: input.session_summary ?? null,
    ai_annotations: input.ai_annotations ?? null,
    created_at: new Date().toISOString(),
  };
}

export async function listSessions(userId: string): Promise<SessionRow[]> {
  if (isSupabaseConfigured && isOnline()) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      writeCache<SessionRow>(TABLE, userId, data as SessionRow[]);
      return data as SessionRow[];
    }
  }
  return readCache<SessionRow>(TABLE, userId);
}

export async function createSession(userId: string, input: NewSession): Promise<SessionRow> {
  const local = makeLocal(userId, input);
  const cached = readCache<SessionRow>(TABLE, userId);
  writeCache<SessionRow>(TABLE, userId, [local, ...cached]);

  if (isSupabaseConfigured && isOnline()) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        user_id: userId,
        entry_path: local.entry_path,
        emotion_selection: local.emotion_selection,
        transcript: local.transcript,
        pattern_tags: local.pattern_tags,
        session_summary: local.session_summary,
        ai_annotations: local.ai_annotations,
      })
      .select()
      .single();

    if (!error && data) {
      const next = [data as SessionRow, ...cached];
      writeCache<SessionRow>(TABLE, userId, next);
      return data as SessionRow;
    }
  }

  return local;
}

export async function deleteSession(userId: string, id: string): Promise<void> {
  const cached = readCache<SessionRow>(TABLE, userId).filter((r) => r.id !== id);
  writeCache<SessionRow>(TABLE, userId, cached);

  if (isSupabaseConfigured && isOnline()) {
    await supabase.from(TABLE).delete().eq('id', id).eq('user_id', userId);
  }
}

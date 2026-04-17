import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { readCache, writeCache, isOnline } from './localCache';

export type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const TABLE = 'journal_entries';

function makeLocal(userId: string, content: string): JournalEntry {
  return {
    id: crypto.randomUUID(),
    user_id: userId,
    content,
    created_at: new Date().toISOString(),
  };
}

export async function listJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (isSupabaseConfigured && isOnline()) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      writeCache<JournalEntry>(TABLE, userId, data as JournalEntry[]);
      return data as JournalEntry[];
    }
  }
  return readCache<JournalEntry>(TABLE, userId);
}

export async function createJournalEntry(userId: string, content: string): Promise<JournalEntry> {
  const local = makeLocal(userId, content);
  const cached = readCache<JournalEntry>(TABLE, userId);
  writeCache<JournalEntry>(TABLE, userId, [local, ...cached]);

  if (isSupabaseConfigured && isOnline()) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ user_id: userId, content })
      .select()
      .single();

    if (!error && data) {
      writeCache<JournalEntry>(TABLE, userId, [data as JournalEntry, ...cached]);
      return data as JournalEntry;
    }
  }

  return local;
}

export async function deleteJournalEntry(userId: string, id: string): Promise<void> {
  const cached = readCache<JournalEntry>(TABLE, userId).filter((r) => r.id !== id);
  writeCache<JournalEntry>(TABLE, userId, cached);

  if (isSupabaseConfigured && isOnline()) {
    await supabase.from(TABLE).delete().eq('id', id).eq('user_id', userId);
  }
}

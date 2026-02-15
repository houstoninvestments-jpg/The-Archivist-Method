// ============================================================
// Hook: useBrainDumps
// Fetch and store brain dump entries
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { BrainDumpRecord } from '../types/vault';

interface UseBrainDumpsReturn {
  dumps: BrainDumpRecord[];
  loading: boolean;
  storeDump: (content: string, suggestedPattern: number | null) => Promise<void>;
  markConverted: (dumpId: string) => Promise<void>;
  refresh: () => void;
}

export const useBrainDumps = (userId: string, limit = 10): UseBrainDumpsReturn => {
  const [dumps, setDumps] = useState<BrainDumpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('brain_dumps')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setDumps(data ?? []);
      } catch (e) {
        console.error('Failed to fetch brain dumps:', e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId, limit, refreshCount]);

  const storeDump = useCallback(
    async (content: string, suggestedPattern: number | null) => {
      try {
        const { supabase } = await import('../lib/supabase');
        await supabase.from('brain_dumps').insert({
          user_id: userId,
          content,
          suggested_pattern: suggestedPattern,
          converted_to_log: false,
        });
        setRefreshCount((c) => c + 1);
      } catch (e) {
        console.error('Failed to store brain dump:', e);
      }
    },
    [userId]
  );

  const markConverted = useCallback(async (dumpId: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase
        .from('brain_dumps')
        .update({ converted_to_log: true })
        .eq('id', dumpId);
      setRefreshCount((c) => c + 1);
    } catch (e) {
      console.error('Failed to mark dump as converted:', e);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshCount((c) => c + 1);
  }, []);

  return { dumps, loading, storeDump, markConverted, refresh };
};

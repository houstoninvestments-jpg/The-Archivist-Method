// ============================================================
// Hook: useActivationLogs
// Fetch and manage activation log entries
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { ActivationLog, PatternId } from '../types/vault';
import { patternIdToNumber } from '../data/patterns';

interface UseActivationLogsReturn {
  logs: ActivationLog[];
  loading: boolean;
  error: string | null;
  logActivation: (params: {
    patternId: PatternId;
    intensity: number;
    context?: string;
    interrupted: boolean;
  }) => Promise<void>;
  refresh: () => void;
}

export const useActivationLogs = (userId: string, limit = 10): UseActivationLogsReturn => {
  const [logs, setLogs] = useState<ActivationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error: err } = await supabase
          .from('activation_logs')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (err) throw err;
        setLogs(data ?? []);
      } catch (e: any) {
        setError(e.message ?? 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId, limit, refreshCount]);

  const logActivation = useCallback(
    async (params: {
      patternId: PatternId;
      intensity: number;
      context?: string;
      interrupted: boolean;
    }) => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { error: err } = await supabase.from('activation_logs').insert({
          user_id: userId,
          pattern_id: patternIdToNumber[params.patternId],
          intensity: params.intensity,
          context: params.context ?? null,
          interrupted: params.interrupted,
        });
        if (err) throw err;
        setRefreshCount((c) => c + 1);
      } catch (e: any) {
        setError(e.message ?? 'Failed to log activation');
      }
    },
    [userId]
  );

  const refresh = useCallback(() => {
    setRefreshCount((c) => c + 1);
  }, []);

  return { logs, loading, error, logActivation, refresh };
};

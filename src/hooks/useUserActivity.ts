// ============================================================
// Hook: useUserActivity
// Track and query user artifact interactions
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { UserActivity } from '../types/vault';

interface UseUserActivityReturn {
  activities: UserActivity[];
  loading: boolean;
  logActivity: (artifactId: string, action: 'opened' | 'completed' | 'bookmarked') => Promise<void>;
  refresh: () => void;
}

export const useUserActivity = (userId: string, limit = 20): UseUserActivityReturn => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setActivities(data ?? []);
      } catch (e) {
        console.error('Failed to fetch user activity:', e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId, limit, refreshCount]);

  const logActivity = useCallback(
    async (artifactId: string, action: 'opened' | 'completed' | 'bookmarked') => {
      try {
        const { supabase } = await import('../lib/supabase');
        await supabase.from('user_activity').insert({
          user_id: userId,
          artifact_id: artifactId,
          action,
        });
        setRefreshCount((c) => c + 1);
      } catch (e) {
        console.error('Failed to log activity:', e);
      }
    },
    [userId]
  );

  const refresh = useCallback(() => {
    setRefreshCount((c) => c + 1);
  }, []);

  return { activities, loading, logActivity, refresh };
};

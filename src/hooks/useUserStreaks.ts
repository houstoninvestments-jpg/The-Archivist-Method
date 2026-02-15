// ============================================================
// Hook: useUserStreaks
// Fetch and update user interrupt streaks
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { UserStreak } from '../types/vault';

interface UseUserStreaksReturn {
  streak: UserStreak | null;
  loading: boolean;
  recordInterrupt: () => Promise<void>;
}

export const useUserStreaks = (userId: string): UseUserStreaksReturn => {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', userId)
          .single();

        setStreak(data);
      } catch {
        // No streak record yet — expected for new users
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  const recordInterrupt = useCallback(async () => {
    const { supabase } = await import('../lib/supabase');
    const today = new Date().toISOString().split('T')[0];

    if (streak) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak =
        streak.last_interrupt_date === yesterday
          ? streak.current_streak + 1
          : streak.last_interrupt_date === today
            ? streak.current_streak
            : 1;
      const longestStreak = Math.max(newStreak, streak.longest_streak);

      const updated: UserStreak = {
        ...streak,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_interrupt_date: today,
      };

      await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_interrupt_date: today,
        })
        .eq('user_id', userId);

      setStreak(updated);
    } else {
      const newStreak: UserStreak = {
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_interrupt_date: today,
      };

      await supabase.from('user_streaks').insert(newStreak);
      setStreak(newStreak);
    }
  }, [userId, streak]);

  return { streak, loading, recordInterrupt };
};

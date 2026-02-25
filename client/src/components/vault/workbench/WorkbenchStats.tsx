// ============================================================
// THE ARCHIVIST VAULT — Workbench Stats
// Activations this week, comparison, success rate, streak
// ============================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, Minus, Target, Flame } from 'lucide-react';
import type { WorkbenchStatsData } from '@/types/vault';

interface WorkbenchStatsProps {
  userId: string;
}

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sublabel?: string;
  delay?: number;
}> = ({ label, value, icon, sublabel, delay = 0 }) => (
  <motion.div
    className="bg-[#111] border border-[#333] rounded-lg p-4"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, ease: 'easeOut' }}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[#14B8A6]">{icon}</span>
      <span className="text-[#E5E5E5]/50 text-xs uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-white text-2xl font-light">{value}</p>
    {sublabel && <p className="text-[#E5E5E5]/30 text-xs mt-1">{sublabel}</p>}
  </motion.div>
);

export const WorkbenchStats: React.FC<WorkbenchStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<WorkbenchStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        // Activations this week
        const { count: thisWeek } = await supabase
          .from('activation_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('timestamp', startOfWeek.toISOString());

        // Activations last week
        const { count: lastWeek } = await supabase
          .from('activation_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('timestamp', startOfLastWeek.toISOString())
          .lt('timestamp', startOfWeek.toISOString());

        // Success rate (interrupted = true)
        const { count: totalAll } = await supabase
          .from('activation_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const { count: interrupted } = await supabase
          .from('activation_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('interrupted', true);

        // Streak
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', userId)
          .single();

        const total = totalAll ?? 0;
        const successRate = total > 0 ? Math.round(((interrupted ?? 0) / total) * 100) : 0;

        setStats({
          activationsThisWeek: thisWeek ?? 0,
          activationsLastWeek: lastWeek ?? 0,
          interruptSuccessRate: successRate,
          currentStreak: streakData?.current_streak ?? 0,
          longestStreak: streakData?.longest_streak ?? 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#333] rounded-lg p-4 animate-pulse">
            <div className="h-3 bg-[#333] rounded w-20 mb-3" />
            <div className="h-7 bg-[#333] rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const weekDiff = stats.activationsThisWeek - stats.activationsLastWeek;
  const trendIcon =
    weekDiff > 0 ? <TrendingUp size={12} /> : weekDiff < 0 ? <TrendingDown size={12} /> : <Minus size={12} />;
  const trendLabel =
    weekDiff > 0
      ? `+${weekDiff} vs last week`
      : weekDiff < 0
        ? `${weekDiff} vs last week`
        : 'Same as last week';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="This Week"
        value={stats.activationsThisWeek}
        icon={<Zap size={14} />}
        sublabel={trendLabel}
        delay={0}
      />
      <StatCard
        label="Success Rate"
        value={`${stats.interruptSuccessRate}%`}
        icon={<Target size={14} />}
        sublabel="Interrupts completed"
        delay={0.05}
      />
      <StatCard
        label="Current Streak"
        value={`${stats.currentStreak}d`}
        icon={<Flame size={14} />}
        sublabel={`Longest: ${stats.longestStreak}d`}
        delay={0.1}
      />
      <StatCard
        label="Last Week"
        value={stats.activationsLastWeek}
        icon={trendIcon}
        delay={0.15}
      />
    </div>
  );
};

export default WorkbenchStats;

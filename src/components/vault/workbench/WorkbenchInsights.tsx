// ============================================================
// THE ARCHIVIST VAULT — Workbench Insights
// AI-generated insight based on user's activation logs
// Uses Claude API for analysis
// ============================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { patternNumberToId } from '../../../data/patterns';
import { patterns } from '../../../data/patterns';

interface WorkbenchInsightsProps {
  userId: string;
}

interface Insight {
  text: string;
  generatedAt: string;
}

// Local pattern analysis — generates insights without external API calls.
// In production, replace with Claude API call for deeper, personalized analysis.
const generateLocalInsight = (
  logs: Array<{ pattern_id: number; intensity: number; interrupted: boolean; timestamp: string }>
): string => {
  if (logs.length === 0) {
    return 'Start logging activations to receive personalized pattern insights.';
  }

  if (logs.length < 3) {
    return 'Keep logging. After a few more entries, patterns in your patterns will emerge.';
  }

  // Analyze most common pattern
  const patternCounts: Record<number, number> = {};
  logs.forEach((l) => {
    patternCounts[l.pattern_id] = (patternCounts[l.pattern_id] || 0) + 1;
  });
  const topPatternId = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0][0];
  const topPattern = patterns.find((p) => p.number === Number(topPatternId));

  // Analyze time-of-day clustering
  const hours = logs.map((l) => new Date(l.timestamp).getHours());
  const hourCounts: Record<number, number> = {};
  hours.forEach((h) => {
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  const peakHourNum = Number(peakHour[0]);
  const peakPeriod =
    peakHourNum < 12 ? 'morning' : peakHourNum < 17 ? 'afternoon' : 'evening';
  const peakTimeStr =
    peakHourNum === 0
      ? '12am'
      : peakHourNum < 12
        ? `${peakHourNum}am`
        : peakHourNum === 12
          ? '12pm'
          : `${peakHourNum - 12}pm`;

  // Analyze interrupt success trend
  const recent = logs.slice(0, 5);
  const recentSuccess = recent.filter((l) => l.interrupted).length;
  const olderLogs = logs.slice(5, 10);
  const olderSuccess = olderLogs.length > 0 ? olderLogs.filter((l) => l.interrupted).length : 0;

  // Analyze intensity trends
  const avgIntensity = logs.reduce((sum, l) => sum + l.intensity, 0) / logs.length;

  // Build insight
  const insights: string[] = [];

  if (topPattern && patternCounts[Number(topPatternId)] >= 2) {
    insights.push(
      `${topPattern.name} is your most frequently logged pattern (${patternCounts[Number(topPatternId)]} times).`
    );
  }

  if (Number(peakHour[1]) >= 2) {
    insights.push(
      `You log most activations in the ${peakPeriod} (around ${peakTimeStr}). Consider a pre-emptive circuit break at that time.`
    );
  }

  if (olderLogs.length > 0 && recentSuccess > olderSuccess) {
    insights.push(
      'Your interrupt success rate is improving. The neural pathway is strengthening.'
    );
  } else if (olderLogs.length > 0 && recentSuccess < olderSuccess) {
    insights.push(
      'Recent interrupts have been harder. This is normal during high-stress periods. Stay with the protocol.'
    );
  }

  if (avgIntensity >= 4) {
    insights.push(
      'Average intensity is high. Consider the Accumulation Interrupt: hourly body scans to catch activation earlier.'
    );
  }

  return insights.length > 0
    ? insights.join(' ')
    : 'Keep logging. The more data, the sharper the insight.';
};

export const WorkbenchInsights: React.FC<WorkbenchInsightsProps> = ({ userId }) => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAndGenerate = async () => {
    try {
      const { supabase } = await import('../../../lib/supabase');
      const { data, error } = await supabase
        .from('activation_logs')
        .select('pattern_id, intensity, interrupted, timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (error) throw error;

      const text = generateLocalInsight(data ?? []);
      setInsight({ text, generatedAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to generate insight:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAndGenerate().finally(() => setLoading(false));
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAndGenerate();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#333] rounded-lg p-5 animate-pulse">
        <div className="h-4 bg-[#333] rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#333] rounded w-1/2" />
      </div>
    );
  }

  if (!insight) return null;

  return (
    <motion.div
      className="bg-[#111] border border-[#333] rounded-lg p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#14B8A6]" />
          <span className="text-[#E5E5E5]/50 text-xs uppercase tracking-wider">
            Pattern Insight
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-[#E5E5E5]/20 hover:text-[#E5E5E5]/50 transition-colors duration-200"
          aria-label="Refresh insight"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
      <p className="text-[#E5E5E5] text-sm leading-relaxed">{insight.text}</p>
    </motion.div>
  );
};

export default WorkbenchInsights;

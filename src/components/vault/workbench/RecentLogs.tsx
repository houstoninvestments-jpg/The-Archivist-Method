// ============================================================
// THE ARCHIVIST VAULT — Recent Logs
// Last 10 workbench entries with pattern, intensity, status
// ============================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
import { patterns, patternNumberToId } from '../../../data/patterns';
import type { ActivationLog } from '../../../types/vault';

interface RecentLogsProps {
  userId: string;
  limit?: number;
}

const IntensityDots: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          i <= value ? 'bg-[#14B8A6]' : 'bg-[#333]'
        }`}
      />
    ))}
  </div>
);

const formatTimestamp = (ts: string): string => {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const RecentLogs: React.FC<RecentLogsProps> = ({ userId, limit = 10 }) => {
  const [logs, setLogs] = useState<ActivationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { supabase } = await import('../../../lib/supabase');
        const { data, error } = await supabase
          .from('activation_logs')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setLogs(data ?? []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#333] rounded-lg p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 bg-[#333] rounded w-32" />
              <div className="h-4 bg-[#333] rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-[#111] border border-[#333] rounded-lg p-8 text-center">
        <Clock className="w-6 h-6 text-[#E5E5E5]/20 mx-auto mb-3" />
        <p className="text-[#E5E5E5]/30 text-sm">
          No entries yet. Your first interrupt will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => {
        const patternId = patternNumberToId[log.pattern_id];
        const pattern = patterns.find((p) => p.id === patternId);

        return (
          <motion.div
            key={log.id}
            className="bg-[#111] border border-[#333] rounded-lg p-4
                       hover:border-[#444] transition-colors duration-300"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Interrupt status */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    log.interrupted
                      ? 'bg-[#14B8A6]/10 text-[#14B8A6]'
                      : 'bg-[#EC4899]/10 text-[#EC4899]'
                  }`}
                >
                  {log.interrupted ? <Check size={12} /> : <X size={12} />}
                </div>

                <div>
                  <p className="text-[#E5E5E5] text-sm font-medium">
                    {pattern?.shortName ?? `Pattern ${log.pattern_id}`}
                  </p>
                  {log.context && (
                    <p className="text-[#E5E5E5]/30 text-xs mt-0.5 truncate max-w-[200px]">
                      {log.context}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <IntensityDots value={log.intensity} />
                <span className="text-[#E5E5E5]/30 text-xs min-w-[60px] text-right">
                  {formatTimestamp(log.timestamp)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecentLogs;

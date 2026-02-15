// ============================================================
// THE ARCHIVIST VAULT — Recently Opened
// Last 5 files the user opened, stored in user_activity
// ============================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, ChevronRight } from 'lucide-react';
import type { UserActivity } from '@/types/vault';

interface RecentlyOpenedProps {
  userId: string;
  onOpenArtifact: (artifactId: string) => void;
}

interface RecentItem {
  artifactId: string;
  artifactTitle: string;
  lastOpened: string;
}

const formatRelativeTime = (ts: string): string => {
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

// Map artifact IDs to display titles
// This would come from a centralized artifact registry in production
const artifactTitles: Record<string, string> = {
  'quick-start-system': 'Quick-Start System',
  'complete-archive': 'Complete Archive',
  'module-0-emergency': 'Emergency Protocol',
  'module-1-foundation': 'Foundation',
  'module-2-four-doors': 'The Four Doors',
  'module-3-patterns': 'Pattern Deep Dives',
  'module-4-implementation': 'Implementation Guide',
  'module-5-advanced': 'Advanced Techniques',
  'module-6-context': 'Context',
  'module-7-field-notes': 'Field Notes',
  'module-8-resources': 'Resources',
};

export const RecentlyOpened: React.FC<RecentlyOpenedProps> = ({ userId, onOpenArtifact }) => {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');

        // Get the most recent 'opened' actions, deduplicated by artifact
        const { data, error } = await supabase
          .from('user_activity')
          .select('*')
          .eq('user_id', userId)
          .eq('action', 'opened')
          .order('timestamp', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Deduplicate: keep only the most recent open per artifact
        const seen = new Set<string>();
        const deduped: RecentItem[] = [];
        for (const row of data ?? []) {
          if (!seen.has(row.artifact_id) && deduped.length < 5) {
            seen.add(row.artifact_id);
            deduped.push({
              artifactId: row.artifact_id,
              artifactTitle: artifactTitles[row.artifact_id] ?? row.artifact_id,
              lastOpened: row.timestamp,
            });
          }
        }

        setItems(deduped);
      } catch (err) {
        console.error('Failed to fetch recent activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#333] rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-[#333] rounded w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#111] border border-[#333] rounded-lg p-6 text-center">
        <Clock className="w-5 h-5 text-[#E5E5E5]/15 mx-auto mb-2" />
        <p className="text-[#E5E5E5]/25 text-sm">No files opened yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-[#E5E5E5]/30 text-xs uppercase tracking-widest mb-2">
        Resume Where You Left Off
      </h4>
      {items.map((item, index) => (
        <motion.button
          key={item.artifactId}
          onClick={() => onOpenArtifact(item.artifactId)}
          className="w-full flex items-center gap-3 p-3 bg-[#111] border border-[#333] rounded-lg
                     hover:border-[#14B8A6]/30 transition-all duration-300 text-left group"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <FileText className="w-4 h-4 text-[#14B8A6]/40 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[#E5E5E5] text-sm truncate">{item.artifactTitle}</p>
          </div>
          <span className="text-[#E5E5E5]/20 text-xs flex-shrink-0">
            {formatRelativeTime(item.lastOpened)}
          </span>
          <ChevronRight
            size={14}
            className="text-[#E5E5E5]/10 group-hover:text-[#14B8A6]/50 transition-colors duration-300 flex-shrink-0"
          />
        </motion.button>
      ))}
    </div>
  );
};

export default RecentlyOpened;

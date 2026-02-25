// ============================================================
// THE ARCHIVIST VAULT — Threads Panel
// Shows cross-linked concepts and related files
// ============================================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, FileText, ArrowRight } from 'lucide-react';
import threadsData from '@/data/threads.json';

interface ThreadsPanelProps {
  currentArtifactId: string;
  onNavigate: (artifactId: string) => void;
}

interface ThreadLink {
  conceptId: string;
  conceptName: string;
  appearsIn: { artifactId: string; artifactTitle: string; page?: number }[];
  relatedThreads: { conceptId: string; conceptName: string }[];
}

export const ThreadsPanel: React.FC<ThreadsPanelProps> = ({
  currentArtifactId,
  onNavigate,
}) => {
  // Find all threads that reference the current artifact
  const relevantThreads = useMemo(() => {
    return (threadsData.threads as ThreadLink[]).filter((thread) =>
      thread.appearsIn.some((a) => a.artifactId === currentArtifactId)
    );
  }, [currentArtifactId]);

  // Collect all related artifacts (excluding current)
  const relatedArtifacts = useMemo(() => {
    const seen = new Set<string>();
    const results: { artifactId: string; artifactTitle: string; viaConcept: string }[] = [];

    for (const thread of relevantThreads) {
      for (const appearance of thread.appearsIn) {
        if (appearance.artifactId !== currentArtifactId && !seen.has(appearance.artifactId)) {
          seen.add(appearance.artifactId);
          results.push({
            artifactId: appearance.artifactId,
            artifactTitle: appearance.artifactTitle,
            viaConcept: thread.conceptName,
          });
        }
      }
    }

    return results;
  }, [relevantThreads, currentArtifactId]);

  if (relevantThreads.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="bg-[#111] border border-[#333] rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#333] flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-[#14B8A6]" />
        <span className="text-[#E5E5E5]/50 text-xs uppercase tracking-wider">
          Traced Threads
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Concepts in this artifact */}
        <div>
          <p className="text-[#E5E5E5]/30 text-xs mb-2">This concept appears in:</p>
          <div className="space-y-1">
            {relatedArtifacts.slice(0, 6).map((item, i) => (
              <button
                key={item.artifactId}
                onClick={() => onNavigate(item.artifactId)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left
                           hover:bg-[#1A1A1A] transition-colors duration-200 group"
              >
                <FileText className="w-3.5 h-3.5 text-[#14B8A6]/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#E5E5E5]/70 text-sm truncate group-hover:text-[#E5E5E5]
                                transition-colors duration-200">
                    {item.artifactTitle}
                  </p>
                  <p className="text-[#E5E5E5]/20 text-xs">via {item.viaConcept}</p>
                </div>
                <ArrowRight
                  size={12}
                  className="text-[#E5E5E5]/10 group-hover:text-[#14B8A6]/50
                             transition-colors duration-200 flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Related threads */}
        {relevantThreads.length > 0 && (
          <div>
            <p className="text-[#E5E5E5]/30 text-xs mb-2">Related threads:</p>
            <div className="flex flex-wrap gap-1.5">
              {relevantThreads
                .flatMap((t) => t.relatedThreads)
                .filter(
                  (rt, i, arr) => arr.findIndex((x) => x.conceptId === rt.conceptId) === i
                )
                .slice(0, 8)
                .map((rt) => (
                  <span
                    key={rt.conceptId}
                    className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] rounded-full
                               text-[#E5E5E5]/40 text-xs hover:border-[#14B8A6]/30
                               hover:text-[#14B8A6]/70 transition-colors duration-200 cursor-default"
                  >
                    {rt.conceptName}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ThreadsPanel;

// ============================================================
// THE ARCHIVIST VAULT — Archive Search
// Search input with content type filters
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, FileText, X } from 'lucide-react';
import type { ContentType, SearchResult } from '../../../types/vault';

interface ArchiveSearchProps {
  onResultClick: (artifactId: string) => void;
}

type PatternFilter = 'all' | string;
type ContentFilter = 'all' | ContentType;

// Static searchable content index.
// In production, this would query Supabase or a search index.
const searchIndex: SearchResult[] = [
  { artifactId: 'quick-start-system', title: 'Quick-Start System', snippet: '90-day protocol for your primary pattern. Identify, interrupt, override.', collection: 'Core Systems', contentType: 'framework', relevance: 1 },
  { artifactId: 'complete-archive', title: 'The Complete Archive', snippet: 'Full 685-page system covering all 9 survival patterns.', collection: 'Core Systems', contentType: 'framework', relevance: 1 },
  { artifactId: 'module-0-emergency', title: 'Emergency Protocol', snippet: 'When a pattern is running and you need to interrupt it right now.', collection: 'Modules', contentType: 'tool', relevance: 0.9 },
  { artifactId: 'module-1-foundation', title: 'Foundation', snippet: 'The core framework. Survival code, body signatures, the original room.', collection: 'Modules', contentType: 'framework', relevance: 0.9 },
  { artifactId: 'module-2-four-doors', title: 'The Four Doors', snippet: 'How patterns enter through thoughts, emotions, body, and behavior.', collection: 'Modules', contentType: 'framework', relevance: 0.8 },
  { artifactId: 'module-4-implementation', title: 'Implementation Guide', snippet: 'Circuit breaks, overrides, daily practice protocol.', collection: 'Modules', contentType: 'tool', relevance: 0.8 },
  { artifactId: 'module-5-advanced', title: 'Advanced Techniques', snippet: 'Pattern archaeology, multi-pattern work, long-term rewiring.', collection: 'Modules', contentType: 'framework', relevance: 0.7 },
  { artifactId: 'module-7-field-notes', title: 'Field Notes', snippet: 'Templates and structures for tracking patterns in real life.', collection: 'Resources', contentType: 'tool', relevance: 0.6 },
  { artifactId: 'module-8-resources', title: 'Resources', snippet: 'Support materials, references, recommended reading.', collection: 'Resources', contentType: 'example', relevance: 0.5 },
  { artifactId: 'pattern-1-disappearing', title: 'The Disappearing Pattern', snippet: 'The urge to pull away, exit, vanish when connection gets real. Circuit break: Pattern. Stay.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-2-apology-loop', title: 'The Apology Loop', snippet: 'Compulsive apologizing for existing, asking, needing. Circuit break: Not sorry. Thank you.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-3-testing', title: 'The Testing Pattern', snippet: 'Creating secret tests to prove people care. Circuit break: Not a test. Ask directly.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-4-attraction-to-harm', title: 'Attraction to Harm', snippet: 'Mistaking danger for chemistry, familiar for safe. Circuit break: Familiar, not safe.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-5-draining-bond', title: 'The Draining Bond', snippet: 'Staying in what depletes you. Circuit break: Pattern, not loyalty.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-6-compliment-deflection', title: 'Compliment Deflection', snippet: 'The reflex to reject praise. Circuit break: Thank you. Full stop.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-7-perfectionism', title: 'The Perfectionism Pattern', snippet: 'Revising endlessly. Circuit break: Done. Submit.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-8-success-sabotage', title: 'Success Sabotage', snippet: 'The itch to blow things up when going well. Circuit break: Tolerate good.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
  { artifactId: 'pattern-9-rage', title: 'The Rage Pattern', snippet: 'When frustration bypasses thought. Circuit break: I need 20 minutes.', collection: 'Pattern Files', contentType: 'script', relevance: 0.9 },
];

const contentTypeLabels: Record<ContentType, string> = {
  framework: 'Framework',
  script: 'Script',
  tool: 'Tool',
  example: 'Example',
};

export const ArchiveSearch: React.FC<ArchiveSearchProps> = ({ onResultClick }) => {
  const [query, setQuery] = useState('');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() && contentFilter === 'all') return [];

    const lower = query.toLowerCase().trim();

    return searchIndex
      .filter((item) => {
        // Content type filter
        if (contentFilter !== 'all' && item.contentType !== contentFilter) return false;

        // Text search
        if (!lower) return true;
        return (
          item.title.toLowerCase().includes(lower) ||
          item.snippet.toLowerCase().includes(lower) ||
          item.collection.toLowerCase().includes(lower)
        );
      })
      .sort((a, b) => b.relevance - a.relevance);
  }, [query, contentFilter]);

  const showResults = query.trim().length > 0 || contentFilter !== 'all';

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E5E5E5]/20"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Archive..."
              className="w-full bg-[#111] border border-[#333] rounded-lg pl-10 pr-4 py-2.5
                         text-[#E5E5E5] text-sm placeholder-[#E5E5E5]/20
                         focus:border-[#14B8A6]/40 focus:outline-none transition-colors duration-300"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E5E5E5]/20
                           hover:text-[#E5E5E5]/50 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg border transition-colors duration-300
              ${
                showFilters || contentFilter !== 'all'
                  ? 'border-[#14B8A6]/40 text-[#14B8A6] bg-[#14B8A6]/5'
                  : 'border-[#333] text-[#E5E5E5]/30 hover:text-[#E5E5E5]/50'
              }`}
            aria-label="Toggle filters"
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-3 flex-wrap">
                <FilterChip
                  label="All"
                  active={contentFilter === 'all'}
                  onClick={() => setContentFilter('all')}
                />
                {(Object.entries(contentTypeLabels) as [ContentType, string][]).map(
                  ([type, label]) => (
                    <FilterChip
                      key={type}
                      label={label}
                      active={contentFilter === type}
                      onClick={() => setContentFilter(type)}
                    />
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="mt-3 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {results.length === 0 ? (
              <p className="text-[#E5E5E5]/20 text-sm text-center py-6">
                No files found.
              </p>
            ) : (
              results.map((result, i) => (
                <motion.button
                  key={result.artifactId}
                  onClick={() => onResultClick(result.artifactId)}
                  className="w-full flex items-start gap-3 p-3 bg-[#111] border border-[#333]
                             rounded-lg hover:border-[#14B8A6]/30 transition-all duration-300
                             text-left group"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <FileText className="w-4 h-4 text-[#14B8A6]/30 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E5E5E5] text-sm font-medium truncate
                                  group-hover:text-white transition-colors duration-200">
                      {result.title}
                    </p>
                    <p className="text-[#E5E5E5]/30 text-xs mt-0.5 line-clamp-1">
                      {result.snippet}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[#E5E5E5]/15 text-xs">{result.collection}</span>
                      <span className="text-[#E5E5E5]/10">|</span>
                      <span className="text-[#14B8A6]/30 text-xs">
                        {contentTypeLabels[result.contentType]}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterChip: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
      ${
        active
          ? 'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30'
          : 'bg-[#1A1A1A] text-[#E5E5E5]/30 border border-[#333] hover:text-[#E5E5E5]/50'
      }`}
  >
    {label}
  </button>
);

export default ArchiveSearch;

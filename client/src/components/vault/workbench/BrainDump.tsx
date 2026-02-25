// ============================================================
// THE ARCHIVIST VAULT — Brain Dump
// Unstructured text capture with AI pattern suggestion
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Archive, Zap } from 'lucide-react';
import { patterns } from '@/data/patterns';
import type { BrainDumpProps, PatternId } from '@/types/vault';

type DumpPhase = 'writing' | 'captured' | 'stored';

export const BrainDump: React.FC<BrainDumpProps> = ({
  isOpen,
  onClose,
  userId,
  onLogAndInterrupt,
}) => {
  const [content, setContent] = useState('');
  const [phase, setPhase] = useState<DumpPhase>('writing');
  const [suggestedPattern, setSuggestedPattern] = useState<PatternId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setContent('');
    setPhase('writing');
    setSuggestedPattern(null);
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const analyzeForPattern = useCallback((text: string): PatternId | null => {
    // Keyword-based pattern detection as a fallback.
    // In production, this calls the Claude API for deeper analysis.
    const lower = text.toLowerCase();

    const signals: [PatternId, string[]][] = [
      ['disappearing', ['leave', 'vanish', 'escape', 'pull away', 'withdraw', 'hide', 'run', 'exit', 'disappear', 'alone']],
      ['apology-loop', ['sorry', 'apologize', 'my fault', 'blame myself', 'guilt', 'bother', 'burden']],
      ['testing', ['test', 'prove', 'check', 'monitor', 'spy', 'ignore me', 'care about me', 'really love', 'checking']],
      ['attraction-to-harm', ['chemistry', 'intense', 'magnetic', 'dangerous', 'toxic', 'obsess', 'can\'t stop thinking', 'electric']],
      ['draining-bond', ['drain', 'exhaust', 'stay', 'loyal', 'can\'t leave', 'stuck', 'trapped', 'owe them', 'guilt']],
      ['compliment-deflection', ['compliment', 'praise', 'deflect', 'don\'t deserve', 'not that good', 'luck', 'minimize']],
      ['perfectionism', ['perfect', 'revise', 'not good enough', 'redo', 'one more', 'check again', 'polish', 'never done']],
      ['success-sabotage', ['blow it up', 'sabotage', 'too good', 'going well', 'itch', 'quit', 'ruin', 'destroy', 'restless']],
      ['rage', ['rage', 'furious', 'explode', 'snap', 'angry', 'fists', 'scream', 'yell', 'anger']],
    ];

    let bestMatch: PatternId | null = null;
    let bestScore = 0;

    for (const [patternId, keywords] of signals) {
      const score = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = patternId;
      }
    }

    return bestScore >= 1 ? bestMatch : null;
  }, []);

  const handleDump = useCallback(async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);

    try {
      const detected = analyzeForPattern(content);
      setSuggestedPattern(detected);

      const { supabase } = await import('@/lib/supabase');
      const patternNumber = detected
        ? patterns.find((p) => p.id === detected)?.number ?? null
        : null;

      await supabase.from('brain_dumps').insert({
        user_id: userId,
        content: content.trim(),
        suggested_pattern: patternNumber,
        converted_to_log: false,
      });

      setPhase('captured');
    } catch (err) {
      console.error('Failed to store brain dump:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, userId, analyzeForPattern]);

  const handleJustStore = useCallback(() => {
    setPhase('stored');
    setTimeout(() => handleClose(), 1500);
  }, [handleClose]);

  const handleLogAndInterruptClick = useCallback(() => {
    if (suggestedPattern) {
      onLogAndInterrupt(suggestedPattern);
    }
  }, [suggestedPattern, onLogAndInterrupt]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg mx-4 bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
              <h2 className="text-white text-lg font-semibold">Brain Dump</h2>
              <button
                onClick={handleClose}
                className="text-[#E5E5E5]/40 hover:text-[#E5E5E5] transition-colors duration-300"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* WRITING PHASE */}
                {phase === 'writing' && (
                  <motion.div
                    key="writing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Just get it out. No structure needed."
                      rows={8}
                      autoFocus
                      className="w-full bg-[#111] border border-[#333] rounded-lg p-4
                                 text-[#E5E5E5] placeholder-[#E5E5E5]/20 text-base leading-relaxed
                                 focus:border-[#14B8A6]/50 focus:outline-none
                                 resize-none transition-colors duration-300"
                    />

                    {/* Voice input stub */}
                    <button
                      disabled
                      className="mt-2 flex items-center gap-2 text-[#E5E5E5]/20 text-sm cursor-not-allowed"
                    >
                      <span className="w-4 h-4 rounded-full border border-current" />
                      Voice input (coming soon)
                    </button>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleDump}
                        disabled={!content.trim() || isSubmitting}
                        className="px-6 py-2.5 bg-[#14B8A6] text-[#1A1A1A] font-semibold rounded-lg
                                   hover:bg-[#14B8A6]/90 transition-all duration-300
                                   disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Capturing...' : 'Dump'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CAPTURED PHASE */}
                {phase === 'captured' && (
                  <motion.div
                    key="captured"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-center py-4"
                  >
                    <p className="text-white text-xl font-light mb-2">
                      Captured.
                    </p>
                    <p className="text-[#E5E5E5]/40 text-sm mb-6">
                      It's out of your head now.
                    </p>

                    {suggestedPattern && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.35 }}
                        className="bg-[#111] border border-[#333] rounded-lg p-4 mb-6"
                      >
                        <p className="text-[#E5E5E5]/50 text-xs uppercase tracking-wider mb-1">
                          Detected Pattern
                        </p>
                        <p className="text-[#14B8A6] text-lg font-medium">
                          {patterns.find((p) => p.id === suggestedPattern)?.name}
                        </p>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-3">
                      {suggestedPattern && (
                        <button
                          onClick={handleLogAndInterruptClick}
                          className="flex items-center justify-center gap-2 w-full px-5 py-3
                                     bg-[#14B8A6] text-[#1A1A1A] font-semibold rounded-lg
                                     hover:bg-[#14B8A6]/90 transition-all duration-300"
                        >
                          <Zap size={16} />
                          Log & Interrupt
                        </button>
                      )}
                      <button
                        onClick={handleJustStore}
                        className="flex items-center justify-center gap-2 w-full px-5 py-3
                                   border border-[#333] text-[#E5E5E5] rounded-lg
                                   hover:border-[#555] hover:text-white transition-all duration-300"
                      >
                        <Archive size={16} />
                        Just Store
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STORED PHASE */}
                {phase === 'stored' && (
                  <motion.div
                    key="stored"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8"
                  >
                    <p className="text-[#14B8A6] text-lg">Stored in the Archive.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrainDump;

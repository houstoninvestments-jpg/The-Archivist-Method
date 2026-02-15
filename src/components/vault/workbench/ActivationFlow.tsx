// ============================================================
// THE ARCHIVIST VAULT — Activation Flow
// Multi-step modal: Pattern Select → Intensity → Context → Interrupt
// This is the core feature of the Workbench wing.
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import { patterns } from '../../../data/patterns';
import { interruptScripts } from '../../../data/interrupts';
import type { ActivationFlowProps, ActivationStep, PatternId } from '../../../types/vault';

const STEPS: ActivationStep[] = ['pattern-select', 'intensity', 'context', 'interrupt'];

const intensityLabels: Record<number, string> = {
  1: 'Mild',
  2: 'Moderate',
  3: 'Strong',
  4: 'Intense',
  5: 'Overwhelming',
};

const fadeSlide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: 'easeIn' } },
};

export const ActivationFlow: React.FC<ActivationFlowProps> = ({
  isOpen,
  onClose,
  userId,
  primaryPattern,
}) => {
  const [step, setStep] = useState<ActivationStep>('pattern-select');
  const [selectedPattern, setSelectedPattern] = useState<PatternId | null>(primaryPattern ?? null);
  const [intensity, setIntensity] = useState(3);
  const [context, setContext] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const script = selectedPattern ? interruptScripts[selectedPattern] : null;

  const reset = useCallback(() => {
    setStep('pattern-select');
    setSelectedPattern(primaryPattern ?? null);
    setIntensity(3);
    setContext('');
    setIsLogging(false);
    setLogged(false);
  }, [primaryPattern]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const goNext = useCallback(() => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }, [stepIndex]);

  const goBack = useCallback(() => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }, [stepIndex]);

  const handleInterrupted = useCallback(async () => {
    if (!selectedPattern) return;
    setIsLogging(true);

    try {
      // Log to Supabase
      const { supabase } = await import('../../../lib/supabase');
      const patternNumber = patterns.find((p) => p.id === selectedPattern)?.number ?? 0;

      await supabase.from('activation_logs').insert({
        user_id: userId,
        pattern_id: patternNumber,
        intensity,
        context: context || null,
        interrupted: true,
      });

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (streakData) {
        const lastDate = streakData.last_interrupt_date;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak =
          lastDate === yesterday
            ? streakData.current_streak + 1
            : lastDate === today
              ? streakData.current_streak
              : 1;
        const longestStreak = Math.max(newStreak, streakData.longest_streak);

        await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_interrupt_date: today,
          })
          .eq('user_id', userId);
      } else {
        await supabase.from('user_streaks').insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_interrupt_date: today,
        });
      }

      setLogged(true);
    } catch (err) {
      console.error('Failed to log activation:', err);
    } finally {
      setIsLogging(false);
    }
  }, [selectedPattern, userId, intensity, context]);

  if (!isOpen) return null;

  // --- FULL SCREEN INTERRUPT ---
  if (step === 'interrupt' && script) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-[#1A1A1A] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-[#E5E5E5]/40 hover:text-[#E5E5E5] transition-colors duration-300"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Circuit Break */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            <AlertTriangle className="w-8 h-8 text-[#14B8A6] mx-auto mb-8" />
          </motion.div>

          <motion.p
            className="text-white text-2xl md:text-3xl font-light text-center leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          >
            {script.circuitBreak}
          </motion.p>

          {/* Body Signal */}
          <motion.p
            className="text-[#E5E5E5]/50 text-sm text-center mb-12 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {script.bodySignal}
          </motion.p>

          {/* Next 10 Minutes */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
          >
            <h3 className="text-[#14B8A6] text-sm font-semibold tracking-widest uppercase mb-4 text-center">
              Next 10 Minutes
            </h3>
            <ol className="space-y-3">
              {script.nextTenMinutes.map((instruction, i) => (
                <motion.li
                  key={i}
                  className="text-[#E5E5E5] text-base md:text-lg text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.15, duration: 0.4 }}
                >
                  {instruction}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Bottom actions */}
        <motion.div
          className="p-6 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          {logged ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-[#14B8A6] text-lg"
            >
              <Check size={20} />
              <span>Logged. The circuit was broken.</span>
            </motion.div>
          ) : (
            <button
              onClick={handleInterrupted}
              disabled={isLogging}
              className="px-8 py-3 bg-[#14B8A6] text-[#1A1A1A] font-semibold rounded-lg
                         hover:bg-[#14B8A6]/90 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogging ? 'Logging...' : 'I Did It'}
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-[#E5E5E5]/40 hover:text-[#E5E5E5] text-sm transition-colors duration-300"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // --- MODAL STEPS (Pattern Select, Intensity, Context) ---
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
              <h2 className="text-white text-lg font-semibold">
                {step === 'pattern-select' && 'Select Pattern'}
                {step === 'intensity' && 'Intensity Level'}
                {step === 'context' && 'Context (Optional)'}
              </h2>
              <button
                onClick={handleClose}
                className="text-[#E5E5E5]/40 hover:text-[#E5E5E5] transition-colors duration-300"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1 px-6 pt-4">
              {STEPS.slice(0, 3).map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= stepIndex ? 'bg-[#14B8A6]' : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                {/* STEP 1: Pattern Select */}
                {step === 'pattern-select' && (
                  <motion.div key="pattern-select" {...fadeSlide}>
                    <p className="text-[#E5E5E5]/60 text-sm mb-4">
                      Which pattern is running right now?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {patterns.map((pattern) => (
                        <button
                          key={pattern.id}
                          onClick={() => setSelectedPattern(pattern.id)}
                          className={`p-3 rounded-lg border text-left transition-all duration-300
                            ${
                              selectedPattern === pattern.id
                                ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#14B8A6]'
                                : primaryPattern === pattern.id
                                  ? 'border-[#14B8A6]/30 bg-[#14B8A6]/5 text-[#E5E5E5]'
                                  : 'border-[#333] text-[#E5E5E5]/70 hover:border-[#555] hover:text-[#E5E5E5]'
                            }
                          `}
                        >
                          <span className="text-xs opacity-50 block">{pattern.number}</span>
                          <span className="text-sm font-medium leading-tight block mt-1">
                            {pattern.shortName}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Intensity */}
                {step === 'intensity' && (
                  <motion.div key="intensity" {...fadeSlide}>
                    <p className="text-[#E5E5E5]/60 text-sm mb-6">
                      How intense is the activation right now?
                    </p>
                    <div className="space-y-6">
                      {/* Slider */}
                      <div className="relative">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={intensity}
                          onChange={(e) => setIntensity(Number(e.target.value))}
                          className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer
                                     [&::-webkit-slider-thumb]:appearance-none
                                     [&::-webkit-slider-thumb]:w-6
                                     [&::-webkit-slider-thumb]:h-6
                                     [&::-webkit-slider-thumb]:rounded-full
                                     [&::-webkit-slider-thumb]:bg-[#14B8A6]
                                     [&::-webkit-slider-thumb]:cursor-pointer
                                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                        />
                      </div>
                      {/* Labels */}
                      <div className="flex justify-between text-xs text-[#E5E5E5]/40">
                        {Object.entries(intensityLabels).map(([val, label]) => (
                          <span
                            key={val}
                            className={`transition-colors duration-300 ${
                              Number(val) === intensity ? 'text-[#14B8A6] font-medium' : ''
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      {/* Current value */}
                      <div className="text-center">
                        <span className="text-5xl font-light text-white">{intensity}</span>
                        <span className="text-[#E5E5E5]/40 text-lg ml-2">/ 5</span>
                      </div>
                      <p className="text-center text-[#E5E5E5]/40 text-sm">
                        {intensityLabels[intensity]}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Context */}
                {step === 'context' && (
                  <motion.div key="context" {...fadeSlide}>
                    <p className="text-[#E5E5E5]/60 text-sm mb-4">
                      What happened? This is optional — skip if you need to move fast.
                    </p>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="What triggered this activation..."
                      rows={5}
                      className="w-full bg-[#111] border border-[#333] rounded-lg p-4
                                 text-[#E5E5E5] placeholder-[#E5E5E5]/20
                                 focus:border-[#14B8A6]/50 focus:outline-none
                                 resize-none transition-colors duration-300"
                    />
                    {/* Voice input stub */}
                    <button
                      disabled
                      className="mt-3 flex items-center gap-2 text-[#E5E5E5]/20 text-sm cursor-not-allowed"
                    >
                      <span className="w-4 h-4 rounded-full border border-current" />
                      Voice input (coming soon)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#333]">
              <button
                onClick={stepIndex > 0 ? goBack : handleClose}
                className="flex items-center gap-1 text-[#E5E5E5]/40 hover:text-[#E5E5E5] text-sm transition-colors duration-300"
              >
                <ChevronLeft size={16} />
                {stepIndex > 0 ? 'Back' : 'Cancel'}
              </button>

              <button
                onClick={goNext}
                disabled={step === 'pattern-select' && !selectedPattern}
                className="flex items-center gap-1 px-5 py-2 bg-[#14B8A6] text-[#1A1A1A] font-semibold
                           rounded-lg hover:bg-[#14B8A6]/90 transition-all duration-300
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {step === 'context' ? 'Interrupt' : 'Continue'}
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActivationFlow;

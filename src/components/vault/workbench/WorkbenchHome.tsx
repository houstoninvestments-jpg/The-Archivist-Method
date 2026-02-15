// ============================================================
// THE ARCHIVIST VAULT — Workbench Home
// Two primary actions: "I'm Activated" + "Brain Dump"
// Below: Stats panel and recent logs
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain } from 'lucide-react';
import ActivationFlow from './ActivationFlow';
import WorkbenchStats from './WorkbenchStats';
import RecentLogs from './RecentLogs';
import type { WorkbenchHomeProps, PatternId } from '../../../types/vault';

// BrainDump imported lazily to avoid circular deps
const BrainDumpLazy = React.lazy(() => import('./BrainDump'));

export const WorkbenchHome: React.FC<WorkbenchHomeProps> = ({ userId }) => {
  const [activationOpen, setActivationOpen] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivationClose = useCallback(() => {
    setActivationOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleBrainDumpClose = useCallback(() => {
    setBrainDumpOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleLogAndInterrupt = useCallback((suggestedPattern: PatternId) => {
    setBrainDumpOpen(false);
    setActivationOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light tracking-tight">The Workbench</h1>
          <p className="text-[#E5E5E5]/40 text-sm mt-1">Real-time pattern interruption.</p>
        </motion.div>

        {/* Two primary action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            onClick={() => setActivationOpen(true)}
            className="group relative flex items-center gap-4 p-6 bg-[#111] border border-[#333]
                       rounded-xl hover:border-[#14B8A6]/50 transition-all duration-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center
                            group-hover:bg-[#14B8A6]/20 transition-colors duration-300">
              <Zap className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div className="text-left">
              <h2 className="text-white text-lg font-semibold">I'm Activated</h2>
              <p className="text-[#E5E5E5]/40 text-sm">A pattern is running. Interrupt it now.</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setBrainDumpOpen(true)}
            className="group relative flex items-center gap-4 p-6 bg-[#111] border border-[#333]
                       rounded-xl hover:border-[#14B8A6]/50 transition-all duration-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center
                            group-hover:bg-[#14B8A6]/20 transition-colors duration-300">
              <Brain className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div className="text-left">
              <h2 className="text-white text-lg font-semibold">Brain Dump</h2>
              <p className="text-[#E5E5E5]/40 text-sm">Get it out of your head. No structure needed.</p>
            </div>
          </motion.button>
        </div>

        {/* Stats Panel */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <h3 className="text-[#E5E5E5]/30 text-xs uppercase tracking-widest mb-3">
            Archive Footprint
          </h3>
          <WorkbenchStats key={`stats-${refreshKey}`} userId={userId} />
        </motion.section>

        {/* Recent Logs */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h3 className="text-[#E5E5E5]/30 text-xs uppercase tracking-widest mb-3">
            Recent Entries
          </h3>
          <RecentLogs key={`logs-${refreshKey}`} userId={userId} />
        </motion.section>
      </div>

      {/* Modals */}
      <ActivationFlow
        isOpen={activationOpen}
        onClose={handleActivationClose}
        userId={userId}
      />

      <React.Suspense fallback={null}>
        {brainDumpOpen && (
          <BrainDumpLazy
            isOpen={brainDumpOpen}
            onClose={handleBrainDumpClose}
            userId={userId}
            onLogAndInterrupt={handleLogAndInterrupt}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default WorkbenchHome;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TEAL = '#14B8A6';
const ROSE = '#EC4899';

// ─── SUB-COMPONENT 1: THE LATENT ECHO ────────────────────────────────────────
// Concept: Prove willpower is chronologically too slow to stop a subcortical reflex.
// Bar 1 (Teal)  — Subcortical Reflex — fills in 1.2s
// Bar 2 (Rose)  — Conscious Willpower — delays 3.5s, then fills
// [CRITICAL LATENCY] bracket appears after both bars complete.
const LatentEcho = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [reflexDone, setReflexDone] = useState(false);
  const [willpowerDone, setWillpowerDone] = useState(false);
  const [showLatency, setShowLatency] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setReflexDone(true), 1200);
    const t2 = setTimeout(() => setWillpowerDone(true), 3500 + 800); // 3.5s delay + 0.8s fill
    const t3 = setTimeout(() => setShowLatency(true), 3500 + 800 + 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Zap size={16} style={{ color: TEAL }} />
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: TEAL }}>
          Module 01 — The Latent Echo
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 leading-tight">
        Willpower arrives <span style={{ color: ROSE }}>2.3 seconds</span> after the reflex fires.
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
        Subcortical threat circuits execute before conscious awareness registers the stimulus.
        The "decision" your prefrontal cortex believes it made has already been overridden.
      </p>

      {/* Bar 1 — Subcortical Reflex */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 tracking-wider uppercase">
          <span>Subcortical Reflex</span>
          <span style={{ color: TEAL }}>T + 0.0s → 1.2s</span>
        </div>
        <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: `linear-gradient(90deg, ${TEAL}, #0D9488)` }}
            initial={{ width: '0%' }}
            animate={inView ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            onAnimationComplete={() => setReflexDone(true)}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 60%, rgba(20,184,166,0.3) 100%)`,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Bar 2 — Conscious Willpower */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 tracking-wider uppercase">
          <span>Conscious Willpower</span>
          <span style={{ color: ROSE }}>T + 3.5s → 4.3s</span>
        </div>
        <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: `linear-gradient(90deg, ${ROSE}, #BE185D)` }}
            initial={{ width: '0%' }}
            animate={inView ? { width: '100%' } : { width: '0%' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 3.5 }}
          />
        </div>
      </div>

      {/* Critical Latency Bracket */}
      <AnimatePresence>
        {showLatency && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mt-4 border rounded p-4"
            style={{ borderColor: ROSE, background: 'rgba(236,72,153,0.05)' }}
          >
            {/* Corner brackets */}
            <span
              className="absolute -top-px -left-px text-xs font-bold px-1"
              style={{ color: ROSE, background: '#0A0A0A' }}
            >
              [
            </span>
            <span
              className="absolute -top-px -right-px text-xs font-bold px-1"
              style={{ color: ROSE, background: '#0A0A0A' }}
            >
              ]
            </span>
            <div className="flex items-center gap-3">
              <ShieldAlert size={14} style={{ color: ROSE }} />
              <span className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: ROSE }}>
                Critical Latency
              </span>
              <span className="text-xs text-slate-500">—</span>
              <span className="text-xs text-slate-400">
                2.3s gap. Pattern executed. Willpower arrived to witness, not prevent.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SUB-COMPONENT 2: THE THERMAL MAP ─────────────────────────────────────────
// Concept: Visualizing the "Body Signature" — physical sensation before the act.
// Torso SVG. Radial Rose gradient blooms in chest at T=2s.
// [EXECUTE CIRCUIT BREAK] collapses bloom into a calm Teal pulse.
const ThermalMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [phase, setPhase] = useState<'idle' | 'bloom' | 'break' | 'calm'>('idle');

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setPhase('bloom'), 2000);
    return () => clearTimeout(t);
  }, [inView]);

  const handleCircuitBreak = () => {
    if (phase !== 'bloom') return;
    setPhase('break');
    setTimeout(() => setPhase('calm'), 600);
  };

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Activity size={16} style={{ color: TEAL }} />
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: TEAL }}>
          Module 02 — The Thermal Map
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 leading-tight">
        Your body <span style={{ color: ROSE }}>broadcasts</span> the pattern before you act.
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
        Interoceptive signals — chest pressure, throat constriction, heat in the sternum —
        are pre-motor signatures. Learn to read them and you've found the intervention point.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Torso SVG */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 120 200"
            width="140"
            height="200"
            className="overflow-visible"
            aria-label="Body signature thermal map"
          >
            {/* Torso outline */}
            <path
              d="M35,20 Q30,10 40,5 L80,5 Q90,10 85,20 L90,60 Q95,80 92,100 L88,180 Q85,195 60,195 Q35,195 32,180 L28,100 Q25,80 30,60 Z"
              fill="none"
              stroke="#334155"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Neck */}
            <rect x="48" y="2" width="24" height="8" rx="4" fill="none" stroke="#334155" strokeWidth="1.5" />
            {/* Shoulders */}
            <path d="M35,25 Q18,28 15,45 L20,55 Q28,42 38,38" fill="none" stroke="#334155" strokeWidth="1.5" />
            <path d="M85,25 Q102,28 105,45 L100,55 Q92,42 82,38" fill="none" stroke="#334155" strokeWidth="1.5" />

            {/* Bloom — Rose radial gradient in chest */}
            <defs>
              <radialGradient id="chestBloom" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={ROSE} stopOpacity="0.9" />
                <stop offset="60%" stopColor={ROSE} stopOpacity="0.3" />
                <stop offset="100%" stopColor={ROSE} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="calmPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={TEAL} stopOpacity="0.8" />
                <stop offset="70%" stopColor={TEAL} stopOpacity="0.2" />
                <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Bloom circle */}
            <AnimatePresence>
              {phase === 'bloom' && (
                <motion.circle
                  cx="60"
                  cy="75"
                  r="0"
                  fill="url(#chestBloom)"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 32, opacity: 1 }}
                  exit={{ r: 0, opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              )}
              {phase === 'calm' && (
                <motion.circle
                  cx="60"
                  cy="75"
                  r="0"
                  fill="url(#calmPulse)"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: [0, 18, 14], opacity: [0, 0.9, 0.6] }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>

            {/* Calm pulse ring */}
            {phase === 'calm' && (
              <motion.circle
                cx="60"
                cy="75"
                r="14"
                fill="none"
                stroke={TEAL}
                strokeWidth="1"
                initial={{ r: 14, opacity: 0.8 }}
                animate={{ r: [14, 26], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Scan lines overlay */}
            {[40, 55, 70, 85, 100, 115, 130, 145, 160, 175].map((y, i) => (
              <line
                key={i}
                x1="28"
                y1={y}
                x2="92"
                y2={y}
                stroke="#1E293B"
                strokeWidth="0.5"
                strokeDasharray="2,4"
              />
            ))}

            {/* Heat label */}
            {phase === 'bloom' && (
              <text x="60" y="118" textAnchor="middle" fontSize="5" fill={ROSE} opacity="0.8">
                STERNUM — 38.7°C
              </text>
            )}
            {phase === 'calm' && (
              <text x="60" y="118" textAnchor="middle" fontSize="5" fill={TEAL} opacity="0.8">
                REGULATED — 36.9°C
              </text>
            )}
            {phase === 'idle' && (
              <text x="60" y="118" textAnchor="middle" fontSize="5" fill="#475569" opacity="0.8">
                MONITORING…
              </text>
            )}
          </svg>

          {/* Status badge */}
          <div className="absolute -top-2 -right-2">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: phase === 'calm' ? TEAL : phase === 'bloom' ? ROSE : '#475569' }}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 space-y-4">
          {/* Status readout */}
          <div
            className="rounded border p-3 font-mono text-xs space-y-1"
            style={{ borderColor: '#1E293B', background: '#0D0D0D' }}
          >
            <div className="flex justify-between">
              <span className="text-slate-500">SIGNAL_TYPE</span>
              <span style={{ color: TEAL }}>INTEROCEPTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">LOCATION</span>
              <span className="text-slate-300">CHEST / STERNUM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PRE_MOTOR_GAP</span>
              <span style={{ color: ROSE }}>~800ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">STATUS</span>
              <motion.span
                style={{ color: phase === 'calm' ? TEAL : phase === 'bloom' ? ROSE : '#475569' }}
                animate={{ opacity: phase === 'bloom' ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 0.8, repeat: phase === 'bloom' ? Infinity : 0 }}
              >
                {phase === 'idle' && 'MONITORING'}
                {phase === 'bloom' && 'SIGNATURE_DETECTED'}
                {phase === 'break' && 'BREAKING…'}
                {phase === 'calm' && 'REGULATED'}
              </motion.span>
            </div>
          </div>

          {/* Circuit break button */}
          <motion.button
            onClick={handleCircuitBreak}
            disabled={phase !== 'bloom'}
            className="w-full py-3 px-4 rounded border text-xs tracking-[0.2em] uppercase font-bold transition-all"
            style={{
              borderColor: phase === 'bloom' ? TEAL : '#1E293B',
              color: phase === 'bloom' ? TEAL : '#334155',
              background: phase === 'bloom' ? 'rgba(20,184,166,0.08)' : 'transparent',
              cursor: phase === 'bloom' ? 'pointer' : 'not-allowed',
            }}
            whileHover={phase === 'bloom' ? { scale: 1.02 } : {}}
            whileTap={phase === 'bloom' ? { scale: 0.98 } : {}}
          >
            {phase === 'calm'
              ? '[ Circuit Break Executed ]'
              : phase === 'bloom'
              ? '[ Execute Circuit Break ]'
              : '[ Awaiting Body Signature ]'}
          </motion.button>

          {phase !== 'idle' && (
            <p className="text-xs text-slate-500 leading-relaxed">
              {phase === 'bloom'
                ? 'Body signature detected. Intervention window is open. Act now.'
                : 'Arousal collapsed. Thalamic relay rerouted. Pattern did not execute.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SUB-COMPONENT 3: THE TEMPORAL SWITCH ─────────────────────────────────────
// Concept: Choice is a rail-switch, not stopping a moving train.
// Pulse travels toward a fork. 5-second window to click SWITCH or defaults to Pattern.
const TemporalSwitch = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [outcome, setOutcome] = useState<'none' | 'switched' | 'defaulted'>('none');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start sequence when in view
  useEffect(() => {
    if (!inView || started) return;
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, [inView, started]);

  // Countdown
  useEffect(() => {
    if (!started || outcome !== 'none') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setOutcome('defaulted');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, outcome]);

  const handleSwitch = () => {
    if (outcome !== 'none') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setOutcome('switched');
  };

  const handleReset = () => {
    setStarted(false);
    setTimeLeft(5);
    setOutcome('none');
    // Re-trigger after brief pause
    setTimeout(() => setStarted(true), 400);
  };

  // Pulse travel progress: 0→1 over 5s
  const pulseProgress = started && outcome === 'none'
    ? (5 - timeLeft) / 5
    : outcome !== 'none'
    ? 1
    : 0;

  const switchColor =
    outcome === 'switched' ? TEAL : outcome === 'defaulted' ? ROSE : '#475569';

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Cpu size={16} style={{ color: TEAL }} />
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: TEAL }}>
          Module 03 — The Temporal Switch
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 leading-tight">
        You cannot <span style={{ color: ROSE }}>stop</span> the train.
        You can only <span style={{ color: TEAL }}>move the switch</span>.
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
        Impulse is momentum. The intervention isn't halting the force — it's redirecting it
        before the junction. Miss the window and the track is already set.
      </p>

      {/* Track schematic */}
      <div className="relative rounded border p-6" style={{ borderColor: '#1E293B', background: '#080808' }}>
        <svg
          viewBox="0 0 400 160"
          className="w-full"
          style={{ maxHeight: '180px' }}
          aria-label="Temporal switch track schematic"
        >
          {/* Rail ties — main track */}
          {[20, 50, 80, 110, 140, 170, 200].map((x) => (
            <rect key={x} x={x} y="68" width="4" height="24" rx="1" fill="#1E293B" />
          ))}

          {/* Main rail lines */}
          <line x1="10" y1="72" x2="230" y2="72" stroke="#334155" strokeWidth="2" />
          <line x1="10" y1="88" x2="230" y2="88" stroke="#334155" strokeWidth="2" />

          {/* Fork junction marker */}
          <circle cx="230" cy="80" r="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <text x="230" y="84" textAnchor="middle" fontSize="7" fill="#64748B">S</text>

          {/* Upper fork — Pattern route (Rose) */}
          <line x1="230" y1="72" x2="390" y2="35" stroke={outcome === 'defaulted' ? ROSE : '#1E293B'} strokeWidth="2" />
          <line x1="230" y1="80" x2="390" y2="43" stroke={outcome === 'defaulted' ? ROSE : '#1E293B'} strokeWidth="2" />
          {/* Ties on upper fork */}
          {[260, 295, 330, 360].map((x, i) => (
            <rect
              key={x}
              x={x - 2}
              y={56 - i * 8}
              width="4"
              height="14"
              rx="1"
              fill={outcome === 'defaulted' ? 'rgba(236,72,153,0.3)' : '#111827'}
              transform={`rotate(-20 ${x} ${63 - i * 8})`}
            />
          ))}
          <text x="370" y="28" fontSize="7" fill={outcome === 'defaulted' ? ROSE : '#334155'} textAnchor="middle">
            PATTERN
          </text>

          {/* Lower fork — Switch route (Teal) */}
          <line x1="230" y1="80" x2="390" y2="117" stroke={outcome === 'switched' ? TEAL : '#1E293B'} strokeWidth="2" />
          <line x1="230" y1="88" x2="390" y2="125" stroke={outcome === 'switched' ? TEAL : '#1E293B'} strokeWidth="2" />
          {/* Ties on lower fork */}
          {[260, 295, 330, 360].map((x, i) => (
            <rect
              key={x}
              x={x - 2}
              y={90 + i * 8}
              width="4"
              height="14"
              rx="1"
              fill={outcome === 'switched' ? 'rgba(20,184,166,0.3)' : '#111827'}
              transform={`rotate(20 ${x} ${97 + i * 8})`}
            />
          ))}
          <text x="370" y="138" fontSize="7" fill={outcome === 'switched' ? TEAL : '#334155'} textAnchor="middle">
            NEW ROUTE
          </text>

          {/* Pulse — light travelling along track */}
          {started && (
            <motion.g>
              {/* Glow trail */}
              <motion.rect
                x={10 + pulseProgress * 210 - 20}
                y="69"
                width="20"
                height="22"
                rx="3"
                fill="none"
                stroke={outcome === 'switched' ? TEAL : ROSE}
                strokeWidth="0.5"
                opacity="0.3"
              />
              {/* Pulse core */}
              <motion.rect
                x={10 + pulseProgress * 210 - 8}
                y="71"
                width="16"
                height="18"
                rx="2"
                fill={outcome === 'switched' ? TEAL : ROSE}
                opacity={outcome === 'defaulted' ? 0 : 0.85}
              />
            </motion.g>
          )}

          {/* Window bracket above junction */}
          {outcome === 'none' && started && (
            <>
              <rect x="200" y="50" width="60" height="18" rx="2" fill="rgba(20,184,166,0.08)" stroke={TEAL} strokeWidth="0.5" strokeDasharray="3,2" />
              <text x="230" y="62" textAnchor="middle" fontSize="6" fill={TEAL}>
                SWITCH WINDOW
              </text>
            </>
          )}
        </svg>

        {/* Countdown and status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="font-mono text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <span>WINDOW</span>
              <span
                className="font-bold"
                style={{
                  color: outcome === 'none' ? (timeLeft <= 2 ? ROSE : TEAL) : switchColor,
                }}
              >
                {outcome === 'none' ? `${timeLeft}s` : outcome === 'switched' ? 'CLOSED' : 'EXPIRED'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>ROUTE</span>
              <span style={{ color: switchColor }}>
                {outcome === 'switched' ? 'NEW ROUTE' : outcome === 'defaulted' ? 'PATTERN' : 'UNDECIDED'}
              </span>
            </div>
          </div>

          {/* Progress bar for countdown */}
          <div className="flex-1 mx-6">
            <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: timeLeft <= 2 && outcome === 'none' ? ROSE : TEAL,
                  width: outcome === 'none' ? `${(timeLeft / 5) * 100}%` : '0%',
                }}
                transition={{ duration: 0.9 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleSwitch}
          disabled={outcome !== 'none'}
          className="flex-1 py-3 px-4 rounded border text-xs tracking-[0.2em] uppercase font-bold"
          style={{
            borderColor: outcome === 'none' ? TEAL : outcome === 'switched' ? TEAL : '#1E293B',
            color: outcome === 'none' ? TEAL : outcome === 'switched' ? TEAL : '#334155',
            background:
              outcome === 'none'
                ? 'rgba(20,184,166,0.08)'
                : outcome === 'switched'
                ? 'rgba(20,184,166,0.15)'
                : 'transparent',
            cursor: outcome === 'none' ? 'pointer' : 'not-allowed',
          }}
          whileHover={outcome === 'none' ? { scale: 1.02 } : {}}
          whileTap={outcome === 'none' ? { scale: 0.97 } : {}}
        >
          {outcome === 'switched' ? '[ Switched ]' : '[ Switch ]'}
        </motion.button>

        <motion.button
          onClick={handleReset}
          className="py-3 px-4 rounded border text-xs tracking-[0.2em] uppercase"
          style={{ borderColor: '#1E293B', color: '#475569' }}
          whileHover={{ color: '#94A3B8', borderColor: '#334155' }}
          whileTap={{ scale: 0.97 }}
        >
          [ Reset ]
        </motion.button>
      </div>

      {/* Outcome message */}
      <AnimatePresence>
        {outcome !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded border p-4 text-xs leading-relaxed"
            style={{
              borderColor: outcome === 'switched' ? TEAL : ROSE,
              background:
                outcome === 'switched' ? 'rgba(20,184,166,0.05)' : 'rgba(236,72,153,0.05)',
              color: outcome === 'switched' ? '#94A3B8' : '#94A3B8',
            }}
          >
            {outcome === 'switched' ? (
              <>
                <span style={{ color: TEAL }} className="font-bold tracking-wider">
                  ROUTE CHANGED.{' '}
                </span>
                The impulse traveled. You didn't stop it — you moved the switch in time.
                That is pattern archaeology in real-time.
              </>
            ) : (
              <>
                <span style={{ color: ROSE }} className="font-bold tracking-wider">
                  DEFAULT EXECUTED.{' '}
                </span>
                The window closed. The pattern ran its course. This is not failure —
                it's data. Note the body signature that preceded it.
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN MODULE EXPORT ────────────────────────────────────────────────────────
export default function TheWindowScience() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const modules = [
    { id: 'latent-echo', component: <LatentEcho /> },
    { id: 'thermal-map', component: <ThermalMap /> },
    { id: 'temporal-switch', component: <TemporalSwitch /> },
  ];

  return (
    <section
      className="bg-[#0A0A0A] text-slate-200 font-mono"
      aria-label="The Window Science — Pattern Intervention Modules"
    >
      {/* Section header */}
      <div className="border-b border-slate-800 px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: TEAL, opacity: 0.3 }} />
            <span
              className="text-xs tracking-[0.3em] uppercase font-bold px-3"
              style={{ color: TEAL }}
            >
              The Window Science
            </span>
            <div className="h-px flex-1" style={{ background: TEAL, opacity: 0.3 }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 text-center leading-tight mb-4">
            Pattern Archaeology,{' '}
            <span style={{ color: ROSE }}>NOT</span> Therapy.
          </h2>
          <p className="text-center text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Three demonstrations. Each one proves the same thing: the window exists,
            it's measurable, and learning to find it is a skill — not a personality trait.
          </p>
        </motion.div>
      </div>

      {/* Module list */}
      <div className="max-w-3xl mx-auto px-8 py-4 divide-y divide-slate-800/60">
        {modules.map(({ id, component }, i) => (
          <motion.div
            key={id}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="py-12"
          >
            {component}
          </motion.div>
        ))}
      </div>

      {/* Footer callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="border-t border-slate-800 px-8 py-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-slate-500">
            The Field Guide documents your windows. The Complete Archive trains you to widen them.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span style={{ color: TEAL }}>—</span>
            <span>Pattern Archaeology is a learnable technical skill</span>
            <span style={{ color: TEAL }}>—</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DURATION = 10000;

const FRAMES = [
  { start: 0, end: 1000, id: "trigger" },
  { start: 1000, end: 1200, id: "pause" },
  { start: 1200, end: 3200, id: "body" },
  { start: 3200, end: 5200, id: "interrupt" },
  { start: 5200, end: 9000, id: "runs" },
  { start: 9000, end: 10000, id: "reset" },
] as const;

type FrameId = (typeof FRAMES)[number]["id"];

function getFrame(elapsed: number): FrameId {
  for (const f of FRAMES) {
    if (elapsed >= f.start && elapsed < f.end) return f.id;
  }
  return "trigger";
}

export default function ThreeSevenSecondAnimation() {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const frame = getFrame(elapsed);

  const tick = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    setElapsed((prev) => {
      const next = prev + delta;
      return next >= TOTAL_DURATION ? 0 : next;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, tick]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const togglePlay = () => setPlaying((p) => !p);

  const progress = elapsed / TOTAL_DURATION;

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className="relative overflow-hidden cursor-pointer select-none"
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.06)",
        minHeight: "340px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
      data-testid="animation-37-second"
    >
      <style>{`
        @keyframes red-pulse {
          0% { transform: scale(0.3); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes circle-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes scan-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[2px] z-20" style={{ width: `${progress * 100}%`, background: "#14B8A6", transition: "width 0.05s linear" }} />

      {/* Play/Pause indicator */}
      <div
        className="absolute top-3 right-4 z-20"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#555" }}
        data-testid="text-animation-status"
      >
        {playing ? "Playing" : "Paused"} · Click to {playing ? "pause" : "play"}
      </div>

      {/* Frame container */}
      <div className="flex items-center justify-center" style={{ minHeight: "340px", position: "relative" }}>

        {/* FRAME 1: THE TRIGGER */}
        <AnimatePresence>
          {frame === "trigger" && (
            <motion.div
              key="trigger"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "white" }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                THE TRIGGER
              </motion.p>
              <p style={{ color: "#999", fontSize: "1rem", marginTop: "16px", maxWidth: "400px" }}>
                Something happens. A text. A compliment. Closeness.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRAME 2: THE PAUSE (scanner) - everything goes dark */}
        <AnimatePresence>
          {frame === "pause" && (
            <motion.div
              key="pause"
              className="absolute inset-0"
              style={{ background: "#0A0A0A" }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
            >
              <motion.div
                className="absolute top-0 bottom-0"
                style={{ width: "2px", background: "#14B8A6", boxShadow: "0 0 12px #14B8A6, 0 0 30px rgba(20,184,166,0.3)" }}
                initial={{ left: "-2px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRAME 3: THE BODY SIGNATURE */}
        <AnimatePresence>
          {frame === "body" && (
            <motion.div
              key="body"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Red glow waves */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: "400px",
                    height: "400px",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-200px",
                    marginTop: "-200px",
                    background: "radial-gradient(circle, rgba(231,76,60,0.35) 0%, rgba(231,76,60,0) 70%)",
                    animation: `red-pulse 1.2s ease-out ${i * 0.4}s infinite`,
                    pointerEvents: "none",
                  }}
                />
              ))}
              <p className="relative z-10" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", color: "white" }}>
                YOUR BODY REACTS
              </p>
              <p className="relative z-10" style={{ color: "#999", fontSize: "1rem", marginTop: "16px", maxWidth: "380px" }}>
                Chest tightens. Stomach drops. Hands go cold.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRAME 4: THE INTERRUPT POINT */}
        <AnimatePresence>
          {frame === "interrupt" && (
            <motion.div
              key="interrupt"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fading red glow */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "500px",
                  height: "500px",
                  left: "50%",
                  top: "50%",
                  marginLeft: "-250px",
                  marginTop: "-250px",
                  background: "radial-gradient(circle, rgba(231,76,60,0.12) 0%, rgba(231,76,60,0) 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* White circle with pulsing teal border */}
              <motion.div
                className="relative z-10 flex items-center justify-center rounded-full"
                style={{
                  width: "clamp(140px, 30vw, 180px)",
                  height: "clamp(140px, 30vw, 180px)",
                  background: "white",
                  border: "2px solid #14B8A6",
                  animation: "circle-pulse 0.4s ease-in-out infinite",
                  boxShadow: "0 0 20px rgba(20,184,166,0.3), 0 0 60px rgba(20,184,166,0.1)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0A0A0A", fontSize: "clamp(0.7rem, 2vw, 0.9rem)", letterSpacing: "0.15em", fontWeight: 600 }}>
                  YOU ARE HERE
                </p>
              </motion.div>

              <motion.p
                className="relative z-10"
                style={{ color: "white", fontWeight: 600, fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", marginTop: "24px" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                YOU CAN STILL CHOOSE
              </motion.p>
              <motion.p
                className="relative z-10"
                style={{ color: "#999", fontSize: "clamp(0.8rem, 2vw, 0.9rem)", marginTop: "12px", maxWidth: "360px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Apply your circuit break now. The pattern hasn't finished running yet.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRAME 5: THE PATTERN RUNS */}
        <AnimatePresence>
          {frame === "runs" && (
            <motion.div
              key="runs"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ filter: "saturate(0.6)" }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", color: "#999" }}>
                THE PATTERN RUNS
              </p>
              <p style={{ color: "#666", fontSize: "1rem", marginTop: "16px", maxWidth: "400px" }}>
                You ghost them. You sabotage it. You apologize again.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRAME 6: THE RESET */}
        <AnimatePresence>
          {frame === "reset" && (
            <motion.div
              key="reset"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                style={{ color: "#737373", fontSize: "0.95rem", fontStyle: "italic" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                It happens this way every time.
              </motion.p>
              <motion.p
                style={{ color: "#999", fontSize: "0.95rem", fontStyle: "italic", marginTop: "12px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Unless you interrupt it in the window.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

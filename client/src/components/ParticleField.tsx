import { useMemo } from "react";
import { motion } from "framer-motion";

const TEAL = "#14B8A6";
const PINK = "#EC4899";

const ParticleField = () => {
  const particleCount = 60;
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const isTeal = i % 2 === 0;
      const color = isTeal ? TEAL : PINK;
      
      return {
        id: i,
        size: Math.random() * 3 + 1.5,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        driftX: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
        driftY: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
        duration: Math.random() * 5 + 5,
        opacity: [0.15, Math.random() * 0.5 + 0.3, 0.15],
        delay: Math.random() * 5,
        color,
        glowColor: isTeal ? "rgba(20, 184, 166, 0.6)" : "rgba(236, 72, 153, 0.6)",
      };
    });
  }, []);

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
            background: p.color,
            borderRadius: "50%",
            filter: "blur(0.5px)",
            boxShadow: `0 0 6px ${p.glowColor}, 0 0 12px ${p.glowColor}`,
          }}
          initial={{ opacity: 0.15 }}
          animate={{
            x: p.driftX,
            y: p.driftY,
            opacity: p.opacity,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;

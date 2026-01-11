import { useMemo } from "react";
import { motion } from "framer-motion";

const ParticleField = () => {
  const particleCount = 60;
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      driftX: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
      driftY: [0, Math.random() * 30 - 15, Math.random() * 30 - 15, 0],
      duration: Math.random() * 15 + 12,
      opacity: [0.1, Math.random() * 0.4 + 0.2, 0.1],
      delay: Math.random() * 5,
    }));
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
        zIndex: 0,
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
            background: `rgba(255, 255, 255, 0.8)`,
            borderRadius: "50%",
            filter: "blur(0.5px)",
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)",
          }}
          initial={{ opacity: 0.1 }}
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

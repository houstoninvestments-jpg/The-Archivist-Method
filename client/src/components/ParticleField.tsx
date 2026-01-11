import { useMemo } from "react";
import { motion } from "framer-motion";

const ParticleField = () => {
  const particleCount = 50;
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      driftX: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
      driftY: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
      duration: Math.random() * 10 + 10,
      opacity: [0, Math.random() * 0.5, 0],
    }));
  }, []);

  return (
    <div style={containerStyle as React.CSSProperties}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            ...(particleBaseStyle as React.CSSProperties),
            width: p.size,
            height: p.size,
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
          }}
          animate={{
            x: p.driftX,
            y: p.driftY,
            opacity: p.opacity,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "#0a0a0a",
  overflow: "hidden",
  zIndex: -1,
};

const particleBaseStyle = {
  position: "absolute",
  background: "white",
  borderRadius: "50%",
  filter: "blur(1px)",
  pointerEvents: "none",
};

export default ParticleField;

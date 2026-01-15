import { motion } from "framer-motion";

interface StratigraphicRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function StratigraphicReveal({ 
  children, 
  className = "",
  delay = 0,
  duration = 1.3
}: StratigraphicRevealProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      
      {/* Primary sediment layer - slides up */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #030303 0%, #0a0a0a 50%, #030303 100%)',
        }}
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          duration: duration,
          delay: delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      
      {/* Secondary debris layer with noise texture - slightly delayed */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(3, 3, 3, 1) 0%, 
              rgba(10, 10, 10, 0.9) 30%,
              rgba(20, 20, 20, 0.7) 60%,
              rgba(3, 3, 3, 0.4) 100%
            )
          `,
          mixBlendMode: 'multiply',
        }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: "-120%", opacity: 0 }}
        transition={{
          duration: duration * 0.8,
          delay: delay + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      
      {/* Grain/noise particles - fastest, gives texture to erosion */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          mixBlendMode: 'overlay',
        }}
        initial={{ y: 0, opacity: 0.4 }}
        animate={{ y: "-150%", opacity: 0 }}
        transition={{
          duration: duration * 0.6,
          delay: delay + 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
}

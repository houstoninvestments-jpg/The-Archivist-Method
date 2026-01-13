import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BlurInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const BlurIn = ({ children, className = "", delay = 0 }: BlurInProps) => {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

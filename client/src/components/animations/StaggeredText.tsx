import { motion } from "framer-motion";

interface StaggeredTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
}

export const StaggeredText = ({ 
  text, 
  className = "", 
  wordClassName = "",
  delay = 0,
  as = "h1" 
}: StaggeredTextProps) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, 
        delayChildren: delay,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ marginRight: "0.5rem" }}
          className={wordClassName}
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


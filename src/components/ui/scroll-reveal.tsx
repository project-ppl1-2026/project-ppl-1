"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { springGentle } from "@/lib/animations";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  once?: boolean;
  amount?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 24,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ ...springGentle, delay }}
    >
      {children}
    </motion.div>
  );
}

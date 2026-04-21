"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type FloatingOrbItem = {
  className: string;
  x: number[];
  y: number[];
  duration: number;
  delay?: number;
};

type FloatingOrbsProps = {
  items: FloatingOrbItem[];
  className?: string;
};

export function FloatingOrbs({ items, className }: FloatingOrbsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {items.map((orb, index) => (
        <motion.div
          key={index}
          className={cn("absolute rounded-full", orb.className)}
          animate={{ x: orb.x, y: orb.y }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay ?? 0,
          }}
        />
      ))}
    </div>
  );
}

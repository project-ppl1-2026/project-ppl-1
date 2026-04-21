"use client";

// Animated radial gradient blob — background dekoratif halaman register.
// Dipisah ke sini karena butuh "use client" untuk framer-motion,
// dan supaya tidak membebani file page.tsx.

import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { blobTransition } from "@/lib/animations";

interface BlobProps {
  w: number;
  h: number;
  color: string;
  style?: React.CSSProperties;
  animate: TargetAndTransition;
  duration: number;
  delay?: number;
}

export function Blob({
  w,
  h,
  color,
  style,
  animate,
  duration,
  delay,
}: BlobProps) {
  return (
    <motion.div
      aria-hidden="true"
      animate={animate}
      transition={blobTransition(duration, delay)}
      style={{
        position: "absolute",
        width: w,
        height: h,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

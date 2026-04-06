// Reusable Framer Motion variants — import di mana pun butuh animasi konsisten
import type { TargetAndTransition, Transition, Variants } from "framer-motion";

// ── Transition defaults ───────────────────────────────────────
export const springSmooth: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const springBouncy: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

// ── Page / card entrance ──────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// ── Step slide (kiri → kanan atau sebaliknya) ─────────────────
export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

// ── Scale pop (untuk success icon, dsb) ──────────────────────
export const scalePopVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// ── Fade only (untuk elemen subtle) ──────────────────────────
export const fadeVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

// ── Logo subtle drop ──────────────────────────────────────────
export const logoDropVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// ── Blob helpers ──────────────────────────────────────────────
export function blobTransition(duration: number, delay = 0): Transition {
  return {
    duration,
    repeat: Infinity,
    ease: "easeInOut",
    delay,
  };
}

export type BlobAnimation = TargetAndTransition;

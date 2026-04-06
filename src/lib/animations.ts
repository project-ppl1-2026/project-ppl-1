// ============================================================
// animations.ts — TemanTumbuh Reusable Animation System
// Framer Motion variants, transitions, and helpers
// ============================================================
import type { TargetAndTransition, Transition, Variants } from "framer-motion";

// ── Transition presets ────────────────────────────────────────
export const springSmooth: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const springBouncy: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const springGentle: Transition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1],
};

export const springCard: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const springElastic: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 18,
};

// ── Entrance variants (scroll reveal) ────────────────────────
/** Fade up — primary entrance for most sections */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springGentle,
  },
};

/** Fade up, lighter lift */
export const fadeUpSubtle: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
};

/** Staggered container — wrap a list to stagger children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Child item for staggered lists */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springGentle,
  },
};

// ── Slide variants ────────────────────────────────────────────
export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: springSmooth },
  exit: { opacity: 0, x: -30, transition: springSmooth },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: springGentle },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: springGentle },
};

// ── Scale variants ────────────────────────────────────────────
export const scalePopVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springElastic,
  },
};

// ── Fade variants ─────────────────────────────────────────────
export const fadeVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: springSmooth },
  exit: { opacity: 0, y: -4, transition: springSmooth },
};

export const logoDropVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springGentle },
};

// ── Dropdown variants ─────────────────────────────────────────
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ── Card hover animations ─────────────────────────────────────
export const cardHoverUp = {
  whileHover: { y: -6, scale: 1.01 },
  transition: springCard,
};

export const cardHoverLift = {
  whileHover: { y: -4 },
  transition: springCard,
};

// ── Floating / blob helpers ───────────────────────────────────
/** Build a looping transition for floating bubbles */
export function blobTransition(duration: number, delay = 0): Transition {
  return {
    duration,
    repeat: Infinity,
    ease: "easeInOut",
    delay,
  };
}

/** Build a looping y-float animation for decorative elements */
export function floatAnimation(
  amplitude = 12,
  duration = 4,
  delay = 0,
): { animate: TargetAndTransition; transition: Transition } {
  return {
    animate: { y: [0, -amplitude, 0] },
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  };
}

/** Looping pulse scale animation */
export function pulseAnimation(
  scale = 1.08,
  duration = 2,
  delay = 0,
): { animate: TargetAndTransition; transition: Transition } {
  return {
    animate: { scale: [1, scale, 1] },
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  };
}

export type BlobAnimation = TargetAndTransition;

// ── Hero parallax defaults ────────────────────────────────────
export const heroParallaxInput = [0, 400];
export const heroParallaxOutput = [0, -50];
export const heroOpacityInput = [0, 300];
export const heroOpacityOutput = [1, 0.5];

// ── Photo frame animation ─────────────────────────────────────
export const photoFrameEntrance = (rotate: number) => ({
  from: { opacity: 0, y: 40, rotate: rotate - 4, scale: 0.92 },
  to: {
    opacity: 1,
    y: 0,
    rotate,
    scale: 1,
    duration: 0.9,
    ease: "power3.out",
  },
});

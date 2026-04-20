import type { TargetAndTransition, Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export const hoverCard: TargetAndTransition = {
  y: -4,
  transition: {
    duration: 0.22,
    ease: [0.16, 1, 0.3, 1] as const,
  },
};

export const tapCard: TargetAndTransition = {
  scale: 0.985,
  transition: {
    duration: 0.12,
    ease: [0.16, 1, 0.3, 1] as const,
  },
};

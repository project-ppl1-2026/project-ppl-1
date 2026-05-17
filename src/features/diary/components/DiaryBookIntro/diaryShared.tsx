"use client";

import { motion } from "framer-motion";

// ───────── Easings ─────────
export function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ───────── Timeline constants ─────────
export const PHASE_SWITCH = 1500;
export const COVER_START = 1850;
export const COVER_DURATION = 2200;
export const OPEN_HOLD = 1400;
export const EXIT_AT = COVER_START + COVER_DURATION + OPEN_HOLD;

// ───────── Shared shape primitives ─────────
export function Grain() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(-50deg,transparent 0px,transparent 2px,rgba(255,255,255,0.022) 2px,rgba(255,255,255,0.022) 3px)",
      }}
    />
  );
}

export function Shimmer() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(160deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.03) 35%,transparent 65%)",
      }}
    />
  );
}

export function AnimatedShine() {
  return (
    <motion.div
      initial={{ x: "-120%" }}
      animate={{ x: "220%" }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 1.2,
      }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "40%",
        background:
          "linear-gradient(110deg, transparent 0%, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%, transparent 100%)",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}

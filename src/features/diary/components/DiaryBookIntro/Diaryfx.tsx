"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

// ───────── Seeded random helper ─────────
// Mulford32 hash → reproducible "random" per index
function seededRandom(seed: number): number {
  let h = (seed | 0) + 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x21f0aaad);
  h = Math.imul(h ^ (h >>> 15), 0x735a2d97);
  h = h ^ (h >>> 15);
  return ((h >>> 0) % 100000) / 100000;
}

// Helper buat ambil random ke-n dari satu seed (biar tiap field beda)
function rnd(seed: number, offset: number): number {
  return seededRandom(seed * 1000 + offset);
}

// ───────── StarField (background twinkle) ─────────
export function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: rnd(i, 1) * 100,
        top: rnd(i, 2) * 100,
        size: 1 + rnd(i, 3) * 2,
        twinkleDelay: rnd(i, 4) * 4,
        twinkleDuration: 2 + rnd(i, 5) * 3,
      })),
    [],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stars.map((s) => (
        <motion.div
          key={s.id}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: s.twinkleDuration,
            delay: s.twinkleDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "rgba(200,255,240,0.9)",
            boxShadow: "0 0 4px rgba(180,255,230,0.6)",
          }}
        />
      ))}
    </div>
  );
}

// ───────── FloatingParticles (rising glowing dots) ─────────
export function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: rnd(i + 100, 1) * 100,
        top: 60 + rnd(i + 100, 2) * 40,
        size: 2 + rnd(i + 100, 3) * 4,
        delay: rnd(i + 100, 4) * 3,
        duration: 6 + rnd(i + 100, 5) * 5,
        drift: -20 + rnd(i + 100, 6) * 40,
      })),
    [],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [0, -200, -400],
            x: [0, p.drift, p.drift * 1.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(180,255,235,0.85)",
            boxShadow: "0 0 8px rgba(150,255,225,0.7)",
          }}
        />
      ))}
    </div>
  );
}

// ───────── BreathingGlow (radial halo behind book) ─────────
export function BreathingGlow({ intensity }: { intensity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 40% at 50% 25%, rgba(29,154,141,${0.15 + intensity * 0.2}) 0%, transparent 70%)`,
        transition: "background 0.1s",
      }}
    />
  );
}

// ───────── LightBurst (gold flash when book opens) ─────────
export function LightBurst({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.8, 2.4] }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: 600,
            height: 600,
            marginLeft: -300,
            marginTop: -300,
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(255,245,200,0.55) 0%, rgba(255,220,150,0.25) 30%, transparent 65%)",
            borderRadius: "50%",
            filter: "blur(20px)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ───────── BookShadow (pulsing ground shadow) ─────────
export function BookShadow() {
  return (
    <motion.div
      animate={{
        opacity: [0.45, 0.55, 0.45],
        scaleX: [1, 1.05, 1],
      }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        bottom: "clamp(14%, 18%, 20%)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "clamp(220px, 52vw, 430px)",
        height: "clamp(28px, 7vw, 54px)",
        borderRadius: 999,
        background: "rgba(0,0,0,0.32)",
        filter: "blur(24px)",
        pointerEvents: "none",
      }}
    />
  );
}

// ───────── SparkleBurst (radial sparkles when cover flips) ─────────
function SparkleShape() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      style={{
        filter:
          "drop-shadow(0 0 4px rgba(255,240,180,0.9)) drop-shadow(0 0 10px rgba(255,220,140,0.5))",
      }}
    >
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill="rgba(255,245,210,0.95)"
      />
    </svg>
  );
}

export function SparkleBurst({ show }: { show: boolean }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 80 + rnd(i + 200, 1) * 140;
        return {
          id: i,
          left: 50 + Math.cos(angle) * (radius / 8),
          top: 45 + Math.sin(angle) * (radius / 12),
          size: 4 + rnd(i + 200, 2) * 6,
          delay: rnd(i + 200, 3) * 0.4,
        };
      }),
    [],
  );

  return (
    <AnimatePresence>
      {show && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.6],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.4,
                delay: s.delay,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                transform: "translate(-50%, -50%)",
              }}
            >
              <SparkleShape />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ───────── SkipHint (top-center nudge) ─────────
export function SkipHint() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0.55, 0] }}
      transition={{
        duration: 4,
        delay: 1.2,
        times: [0, 0.15, 0.85, 1],
      }}
      style={{
        position: "absolute",
        top: "clamp(16px, 3vw, 28px)",
        left: "50%",
        transform: "translateX(-50%)",
        margin: 0,
        fontSize: "clamp(10px, 2.4vw, 12px)",
        fontWeight: 600,
        color: "rgba(190,240,230,0.85)",
        letterSpacing: 0.6,
        textTransform: "uppercase",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      Tap di mana saja untuk lewati
    </motion.p>
  );
}

// ───────── Caption (animated bottom text) ─────────
export function Caption({ text, sub }: { text: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      style={{
        position: "absolute",
        bottom: "clamp(18px, 4vw, 26px)",
        textAlign: "center",
        paddingInline: 16,
        maxWidth: "92vw",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          style={{
            margin: 0,
            fontSize: "clamp(12px, 2.8vw, 13px)",
            fontWeight: 700,
            color: "rgba(180,240,225,0.95)",
            letterSpacing: 0.4,
            textShadow: "0 0 12px rgba(80,200,180,0.35)",
          }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.p
          key={sub}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            margin: "5px 0 0",
            fontSize: "clamp(10px, 2.5vw, 11px)",
            fontStyle: "italic",
            color: "rgba(140,210,195,0.65)",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { fadeUp, hoverCard, tapCard } from "./home-dashboard-motion";

export function SkeletonBox({ h = 120 }: { h?: number }) {
  return (
    <div
      className="rounded-[1rem]"
      style={{
        minHeight: h,
        background:
          "linear-gradient(110deg, var(--tt-dashboard-skeleton) 8%, rgba(255,255,255,0.9) 18%, var(--tt-dashboard-skeleton) 33%)",
        backgroundSize: "200% 100%",
        animation: "tt-skeleton 1.35s linear infinite",
      }}
    />
  );
}

export function MotionCard({
  children,
  className = "",
  style,
  custom = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  custom?: number;
}) {
  return (
    <motion.div
      custom={custom}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={hoverCard}
      whileTap={tapCard}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function DonutRing({
  pct,
  color,
  size = 44,
  stroke = 5,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`${color}20`}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
      />
    </svg>
  );
}

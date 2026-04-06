// ============================================================
// src/components/home/home-visuals.tsx
// Visual elements untuk halaman home
// ============================================================

import * as React from "react";

type MoodFaceIconProps = {
  score: number | null;
  size?: number;
  color?: string;
};

const FACE_PATHS: Record<number, string> = {
  1: "M17 35 Q26 27 35 35",
  2: "M18 34 Q26 29 34 34",
  3: "M19 33 L33 33",
  4: "M17 30 Q26 38 35 30",
  5: "M15 30 Q26 42 37 30",
};

function scalePath(path: string, size: number) {
  return path.replace(/\d+/g, (n) =>
    String(Math.round((parseInt(n, 10) * size) / 52)),
  );
}

export function getMoodColor(score: number | null) {
  if (score === null) return "#B8C9C7";
  if (score <= 1) return "#F97316";
  if (score === 2) return "#F59E0B";
  if (score === 3) return "#94A3B8";
  if (score === 4) return "#22C55E";
  return "#10B981";
}

export function MoodFaceIcon({ score, size = 28, color }: MoodFaceIconProps) {
  const safeScore = score ?? 3;
  const faceColor = color ?? getMoodColor(score);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`${faceColor}18`}
        stroke={faceColor}
        strokeWidth="1.5"
      />
      <circle
        cx={cx - size * 0.17}
        cy={cy - size * 0.1}
        r={size * 0.06}
        fill={faceColor}
      />
      <circle
        cx={cx + size * 0.17}
        cy={cy - size * 0.1}
        r={size * 0.06}
        fill={faceColor}
      />
      <path
        d={scalePath(FACE_PATHS[safeScore], size)}
        stroke={faceColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function FlameIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 4C20 4 14 12 14 20C14 23.3 15.6 26.3 18 28.2V24C18 24 12 19 16 12C16 12 16 22 22 24C22 24 24 18 20 14C20 14 26 18 26 24C26 27.3 23.3 30 20 30C16.7 30 14 27.3 14 24"
        stroke="#FF6B35"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 36C23.3 36 26 33.3 26 30C26 27.3 24.5 25.8 23 25C23 25 23 28 21 29C21 29 22 26 20 24C20 24 17 27 17 30C17 33.3 16.7 36 20 36Z"
        fill="#FFB347"
        stroke="#FF6B35"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarMiniIcon({
  color = "var(--brand-primary)",
}: {
  color?: string;
}) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="14"
        height="13"
        rx="2"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M6 2V4M12 2V4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M2 7H16" stroke={color} strokeWidth="1.8" />
      <rect
        x="5"
        y="10"
        width="3"
        height="3"
        rx="0.5"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}

export function DonutRing({
  pct,
  color,
  size = 58,
  stroke = 6,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#D7ECEA"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        strokeDashoffset={c * 0.25}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

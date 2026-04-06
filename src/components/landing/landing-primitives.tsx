"use client";

// ============================================================
// landing-primitives.tsx — TemanTumbuh Shared Primitives
// All reusable presentational components for the landing page
// ============================================================

import * as React from "react";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeUpVariants } from "@/lib/animations";
import type { BubbleCfg } from "@/lib/landing-data";
import { C } from "@/lib/landing-data";

// ── Wave Dividers ─────────────────────────────────────────────

export function WaveTop({ fill }: { fill: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: -1,
        left: 0,
        right: 0,
        lineHeight: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 72, display: "block" }}
      >
        <path
          d="M0,0 L1440,0 L1440,28 C1200,60 960,8 720,36 C480,64 240,12 0,40 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function WaveBottom({ fill }: { fill: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: -1,
        left: 0,
        right: 0,
        lineHeight: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 72, display: "block" }}
      >
        <path
          d="M0,44 C240,12 480,64 720,36 C960,8 1200,60 1440,28 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── Floating Bubbles (animated, placed at section edges) ─────

export function FloatingBubbles({ bubbles }: { bubbles: BubbleCfg[] }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          animate={{ y: b.ay, x: b.ax }}
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
          style={{
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            borderRadius: "50%",
            ...(b.variant === "solid"
              ? {
                  background: `radial-gradient(circle at 38% 38%, ${b.color} 0%, ${b.color}99 35%, transparent 68%)`,
                }
              : {
                  background: "transparent",
                  border: `2px solid ${b.color}`,
                  boxShadow: `inset 0 0 ${Math.round(b.size * 0.12)}px ${b.color}33`,
                }),
          }}
        />
      ))}
    </div>
  );
}

/**
 * Simpler blur-based floating bubble (static, CSS blur)
 * For cases where motion overhead isn't needed.
 */
export function FloatingBubble({
  size,
  top,
  bottom,
  left,
  right,
  color = C.teal,
  opacity = 0.1,
}: {
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        top,
        bottom,
        left,
        right,
        backgroundColor: color,
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

// ── Scroll Reveal Wrapper ─────────────────────────────────────

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section Pill / Badge ──────────────────────────────────────

export function Pill({
  text,
  onDark = false,
}: {
  text: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex justify-center mb-4">
      <Badge
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border",
          onDark
            ? "bg-white/20 text-white border-white/30 hover:bg-white/20"
            : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50",
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            onDark ? "bg-white" : "bg-teal-600",
          )}
        />
        {text}
      </Badge>
    </div>
  );
}

// Alias for paste-2 style — renders label without centering
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="mb-3 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold tracking-wider text-teal-800 hover:bg-teal-100 border-teal-200">
      {children}
    </Badge>
  );
}

// ── Section H2 Heading ────────────────────────────────────────

export function SectionH2({
  title,
  accent,
  sub,
  onDark = false,
}: {
  title: string;
  accent?: string;
  sub?: string;
  onDark?: boolean;
}) {
  return (
    <div className="text-center">
      <h2
        className="text-3xl md:text-4xl font-bold leading-tight mb-3"
        style={{ color: onDark ? C.textOnDark : C.textPrimary }}
      >
        {accent && (
          <span style={{ color: onDark ? C.tealLight : C.teal }}>{accent}</span>
        )}
        {title}
      </h2>
      {sub && (
        <p
          className="text-sm md:text-base leading-relaxed max-w-xl mx-auto"
          style={{ color: onDark ? C.textSubOnDark : C.textSecondary }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Paste-2 style section header with label + h2 + description, centered */
export function SectionHeader({
  label,
  title,
  description,
  center = true,
}: {
  label: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-14 max-w-3xl space-y-4",
        center && "text-center",
      )}
    >
      <SectionLabel>{label}</SectionLabel>
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl",
          center && "text-center",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-base text-slate-500 sm:text-lg",
          center && "mx-auto max-w-xl",
        )}
      >
        {description}
      </p>
    </div>
  );
}

// ── White Card ────────────────────────────────────────────────

export function WhiteCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card
          className={cn(
            "border-slate-100 bg-white shadow-[0px_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0px_12px_40px_rgba(0,0,0,0.12)]",
            className,
          )}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
  return (
    <Card
      className={cn(
        "border-slate-100 bg-white shadow-[0px_8px_32px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </Card>
  );
}

// ── Icon Box ──────────────────────────────────────────────────

export function IconBox({
  children,
  size = 48,
  color = C.teal,
  className,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-2xl", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}1A`,
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ color?: string }>(child)) {
          return React.cloneElement(child, { color });
        }
        return child;
      })}
    </div>
  );
}

// ── Polaroid Card ─────────────────────────────────────────────

export function PolaroidCard({
  src,
  label,
  rotate = 0,
}: {
  src: string;
  label?: string;
  rotate?: number;
}) {
  return (
    <Card
      className="flex-shrink-0 select-none border-none bg-white p-3 pb-8 shadow-[0px_12px_40px_rgba(0,0,0,0.18)] rounded-sm"
      style={{ transform: `rotate(${rotate}deg)`, width: 210 }}
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-sm bg-slate-100">
        <Image
          src={src}
          alt={label || ""}
          fill
          sizes="210px"
          className="object-cover pointer-events-none"
          unoptimized
        />
      </div>
      {label && (
        <p className="mt-4 text-center text-xs font-semibold text-slate-500">
          {label}
        </p>
      )}
    </Card>
  );
}

// ── Inline SVG Icons (self-contained, no external dep) ───────
// Used where lucide-react icons aren't a perfect fit for the teal brand system

export const Icons = {
  Diary: ({ color = C.tealMid }: { color?: string }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M5 3h9a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8 8h5M8 12h5M8 16h3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Arrow: ({ color = "currentColor" }: { color?: string }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

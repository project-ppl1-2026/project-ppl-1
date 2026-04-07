// ============================================================
// components/ui/landing.tsx — TemanTumbuh Reusable Landing Components
// ============================================================
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { springCard } from "@/lib/animations";

// ─── Colour system ────────────────────────────────────────────
export const C = {
  bg0: "#FAFBFF",
  bg1: "#EEF4FB",
  bg2: "#E4EEFA",
  bg5: "#E8F7F3",
  bg6: "#D8F1EB",

  howBg: "#E0F5F0",
  howBgBot: "#D0EDE7",
  howCard: "#FFFFFF",
  howPanel: "#C8E8E2",
  howBorder: "#A8D4CC",

  teal: "#1A9688",
  tealMid: "#28B0A4",
  tealLight: "#4ECFC3",
  tealPale: "#A8E0DA",
  tealGhost: "#DDF5F2",

  Green: "#1A9688",
  GreenDeep: "#28B0A4",
  GreenLight: "#4ECFC3",
  GreenPale: "#A8E0DA",
  GreenGhost: "#DDF5F2",

  gold: "#E0A030",
  goldPale: "#FDF0CC",

  textPrimary: "#1A2840",
  textSecondary: "#3A5068",
  textMuted: "#7090A8",
  textOnDark: "#EEF8FF",
  textSubOnDark: "#88C8D8",

  white: "#FFFFFF",
  border: "#C8DCED",
};

// ─── Wave components ──────────────────────────────────────────
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

// ─── Bubble config ─────────────────────────────────────────────
export type BubbleCfg = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size: number;
  dur: number;
  delay: number;
  opacity: number;
  ay: number[];
  ax: number[];
  variant: "solid" | "outline";
  color: string;
};

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

// ─── Reveal wrapper ───────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pill ─────────────────────────────────────────────────────
export function Pill({
  text,
  onDark = false,
}: {
  text: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex justify-center mb-4">
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
        style={
          onDark
            ? { background: "rgba(78,207,195,0.18)", color: C.tealLight }
            : {
                background: C.tealGhost,
                color: C.teal,
                border: `1px solid ${C.tealPale}`,
              }
        }
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: onDark ? C.tealLight : C.teal }}
        />
        {text}
      </span>
    </div>
  );
}

// ─── SectionHeading ──────────────────────────────────────────
export function SectionHeading({
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

// ─── GSAP Photo Frame ─────────────────────────────────────────
export function PhotoFrame({
  label,
  sublabel,
  rotate = 0,
  zIndex = 1,
  className = "",
  style: extraStyle,
}: {
  label: string;
  sublabel: string;
  rotate?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40, rotate: rotate - 4, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        rotate,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3 + Math.random() * 0.3,
      },
    );
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      gsap.to(el, {
        rotateY: dx * 8,
        rotateX: -dy * 8,
        scale: 1.04,
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        rotate,
        duration: 0.6,
        ease: "elastic.out(1,0.6)",
      });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [rotate]);

  return (
    <div
      ref={frameRef}
      className={`absolute ${className}`}
      style={{
        zIndex,
        transformStyle: "preserve-3d",
        perspective: 800,
        cursor: "default",
        ...extraStyle,
      }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: C.white,
          padding: "10px 10px 28px",
          boxShadow:
            "0 8px 32px rgba(26,40,64,0.16), 0 2px 8px rgba(26,40,64,0.08)",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          className="rounded-lg flex items-center justify-center"
          style={{
            width: 160,
            height: 120,
            background: `linear-gradient(135deg, ${C.tealGhost} 0%, ${C.bg1} 100%)`,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="15" r="7" stroke={C.teal} strokeWidth="1.5" />
            <path
              d="M6 36c0-8 6.3-13 14-13s14 5 14 13"
              stroke={C.teal}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="pt-2 text-center">
          <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>
            {label}
          </p>
          <p className="text-[10px]" style={{ color: C.textMuted }}>
            {sublabel}
          </p>
        </div>
      </div>
    </div>
  );
}
// ─── FeatureCard ─────────────────────────────────────────────
export function FeatureCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={springCard}
      className="rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden h-full cursor-pointer"
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: C.tealGhost,
            color: C.teal,
            border: `1px solid ${C.tealPale}`,
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon tanpa background */}
      <div className="flex items-center justify-start">{icon}</div>

      <h3 className="text-sm font-bold mt-1" style={{ color: C.textPrimary }}>
        {title}
      </h3>

      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: C.textSecondary }}
      >
        {desc}
      </p>

      <span
        className="text-xs font-semibold inline-flex items-center gap-1"
        style={{ color: C.teal }}
      >
        Pelajari lebih →
      </span>
    </motion.div>
  );
}

// ─── PurposeCard (Tujuan) ─────────────────────────────────────
export function PurposeCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
  color?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={springCard}
      className="rounded-2xl p-6 flex flex-col gap-3 h-full"
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
        {title}
      </h3>
      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: C.textSecondary }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

// ─── HowCard ─────────────────────────────────────────────────
export function HowCard({
  tag,
  tagColor,
  title,
  items,
  cta,
  ctaColor,
  panelBg,
  children,
  reverse = false,
}: {
  tag: string;
  tagColor: { bg: string; text: string; border: string };
  title: string;
  items: string[];
  cta: string;
  ctaColor: string;
  panelBg: string;
  children?: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden grid md:grid-cols-2"
      style={{
        background: C.howCard,
        border: `1.5px solid ${C.howBorder}`,
        boxShadow: "0 4px 24px rgba(26,150,136,0.1)",
      }}
    >
      <div
        className={`h-52 md:h-auto flex flex-col gap-4 p-8 ${
          reverse ? "order-1 md:order-2" : ""
        }`}
        style={{
          background: panelBg,
          borderRight: reverse ? "none" : `1px solid ${C.howBorder}`,
          borderLeft: reverse ? `1px solid ${C.howBorder}` : "none",
        }}
      >
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start tracking-widest uppercase"
          style={{
            background: tagColor.bg,
            color: tagColor.text,
            border: `1px solid ${tagColor.border}`,
          }}
        >
          {tag}
        </span>
        <h3 className="text-base font-bold" style={{ color: tagColor.text }}>
          {title}
        </h3>
        <ul className="flex flex-col gap-2 flex-1">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs"
              style={{ color: tagColor.text }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${tagColor.text}22`,
                  fontSize: 9,
                  color: tagColor.text,
                }}
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 self-start text-xs font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
          style={{ background: ctaColor, color: C.white }}
        >
          {cta} →
        </Link>
        {children}
      </div>
      <div
        className={`p-8 md:p-10 flex flex-col justify-center gap-4 ${
          reverse ? "order-2 md:order-1" : ""
        }`}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.textSecondary }}
        >
          {/* content slot — used by the parent */}
        </p>
      </div>
    </div>
  );
}

// ─── TestiCard ────────────────────────────────────────────────
export function TestiCard({
  name,
  role,
  quote,
  avatarColor,
}: {
  name: string;
  role: string;
  quote: string;
  avatarColor?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={springCard}
      className="rounded-2xl p-6 flex flex-col gap-4 h-full"
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      <span
        className="text-5xl font-bold"
        style={{ color: C.tealPale, lineHeight: 0.9 }}
      >
        &ldquo;
      </span>
      <p
        className="text-xs leading-relaxed italic flex-1"
        style={{ color: C.textSecondary }}
      >
        {quote}
      </p>
      <div
        className="flex items-center gap-3 pt-4"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: avatarColor ?? C.tealGhost, color: C.teal }}
        >
          {initials}
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>
            {name}
          </p>
          <p className="text-[10px]" style={{ color: C.textMuted }}>
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
export const Icons = {
  Diary: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke={C.teal}
        strokeWidth="1.5"
      />
      <path
        d="M9 9h5M9 13h5M9 17h3"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Bolt: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L5 13h7l-1 9 9-11h-7l1-9z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Heart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 4 15 4 8.5A6 6 0 0112 5.8 6 6 0 0120 8.5C20 15 12 21 12 21z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Chart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="14" width="4" height="7" rx="1" fill={C.tealPale} />
      <rect x="10" y="9" width="4" height="12" rx="1" fill={C.tealLight} />
      <rect x="17" y="5" width="4" height="16" rx="1" fill={C.teal} />
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l9 3.5v5.5c0 5.5-3.8 10-9 12C6.8 21 3 16.5 3 11V5.5L12 2z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Star: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={C.teal} strokeWidth="1.5" />
      <path
        d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7l4 4 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke={C.teal}
        strokeWidth="1.5"
      />
      <path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Family: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke={C.teal} strokeWidth="1.5" />
      <circle cx="17" cy="8" r="2.5" stroke={C.teal} strokeWidth="1.5" />
      <path
        d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 14c2.2 0 4 1.8 4 4"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Brain: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.5 2C7.5 2 6 3.5 6 5.5c-1.7.3-3 1.8-3 3.5 0 1.2.5 2.2 1.3 3C4.1 12.5 4 13 4 13.5 4 16 6 18 8.5 18H12"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.5 2C16.5 2 18 3.5 18 5.5c1.7.3 3 1.8 3 3.5 0 1.2-.5 2.2-1.3 3 .2.5.3 1 .3 1.5 0 2.5-2 4.5-4.5 4.5H12"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 2v16M8 10h3M13 10h3M9 14h6"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Bubble presets ───────────────────────────────────────────
export const heroBubbles: BubbleCfg[] = [
  {
    right: "-60px",
    top: "-60px",
    size: 320,
    dur: 16,
    delay: 0,
    opacity: 0.45,
    ay: [0, 20, -8, 0],
    ax: [0, -10, 4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-80px",
    bottom: "-80px",
    size: 280,
    dur: 12,
    delay: 1.5,
    opacity: 0.38,
    ay: [0, -18, 6, 0],
    ax: [0, 12, -4, 0],
    variant: "solid",
    color: C.GreenPale,
  },
  {
    right: "40px",
    bottom: "60px",
    size: 120,
    dur: 9,
    delay: 0.5,
    opacity: 0.3,
    ay: [0, -14, 6, 0],
    ax: [0, -6, 3, 0],
    variant: "outline",
    color: C.tealPale,
  },
  {
    left: "60px",
    top: "80px",
    size: 100,
    dur: 11,
    delay: 2.5,
    opacity: 0.28,
    ay: [0, 16, -8, 0],
    ax: [0, 8, -4, 0],
    variant: "outline",
    color: C.tealMid,
  },
];

export const featuresBubbles: BubbleCfg[] = [
  {
    right: "-70px",
    top: "-50px",
    size: 260,
    dur: 13,
    delay: 0,
    opacity: 0.4,
    ay: [0, 18, -6, 0],
    ax: [0, -8, 3, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-60px",
    bottom: "-60px",
    size: 220,
    dur: 10,
    delay: 1,
    opacity: 0.35,
    ay: [0, -16, 6, 0],
    ax: [0, 8, -3, 0],
    variant: "solid",
    color: C.tealPale,
  },
  {
    right: "30px",
    bottom: "40px",
    size: 110,
    dur: 8,
    delay: 2,
    opacity: 0.28,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    left: "40px",
    top: "60px",
    size: 90,
    dur: 11,
    delay: 3,
    opacity: 0.25,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const howBubbles: BubbleCfg[] = [
  {
    right: "-70px",
    top: "-55px",
    size: 280,
    dur: 13,
    delay: 0,
    opacity: 0.42,
    ay: [0, 22, -8, 0],
    ax: [0, -14, 4, 0],
    variant: "solid",
    color: C.howPanel,
  },
  {
    left: "-60px",
    bottom: "-55px",
    size: 240,
    dur: 10,
    delay: 2,
    opacity: 0.38,
    ay: [0, -18, 6, 0],
    ax: [0, 10, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    right: "40px",
    bottom: "60px",
    size: 115,
    dur: 8,
    delay: 1,
    opacity: 0.28,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    left: "50px",
    top: "80px",
    size: 95,
    dur: 11,
    delay: 3,
    opacity: 0.25,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const purposeBubbles: BubbleCfg[] = [
  {
    left: "-80px",
    top: "-60px",
    size: 300,
    dur: 11,
    delay: 0.5,
    opacity: 0.4,
    ay: [0, 20, -6, 0],
    ax: [0, 14, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    right: "-60px",
    bottom: "-50px",
    size: 240,
    dur: 14,
    delay: 2,
    opacity: 0.35,
    ay: [0, -18, 6, 0],
    ax: [0, -10, 3, 0],
    variant: "solid",
    color: C.bg5,
  },
  {
    left: "50px",
    bottom: "50px",
    size: 120,
    dur: 9,
    delay: 0,
    opacity: 0.3,
    ay: [0, 16, -6, 0],
    ax: [0, -6, 2, 0],
    variant: "outline",
    color: C.tealLight,
  },
  {
    right: "50px",
    top: "70px",
    size: 100,
    dur: 8,
    delay: 3.5,
    opacity: 0.26,
    ay: [0, -14, 4, 0],
    ax: [0, 4, -2, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const testiBubbles: BubbleCfg[] = [
  {
    right: "-60px",
    top: "-50px",
    size: 260,
    dur: 12,
    delay: 0,
    opacity: 0.4,
    ay: [0, -20, 8, 0],
    ax: [0, 10, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-70px",
    bottom: "-60px",
    size: 220,
    dur: 9,
    delay: 1.5,
    opacity: 0.42,
    ay: [0, 18, -6, 0],
    ax: [0, 0, 0, 0],
    variant: "solid",
    color: C.bg6,
  },
  {
    left: "50px",
    top: "60px",
    size: 110,
    dur: 10,
    delay: 0,
    opacity: 0.28,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    right: "40px",
    bottom: "50px",
    size: 95,
    dur: 8,
    delay: 2.5,
    opacity: 0.26,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealLight,
  },
];

export const ctaBubbles: BubbleCfg[] = [
  {
    right: "-80px",
    top: "-70px",
    size: 320,
    dur: 14,
    delay: 0,
    opacity: 0.12,
    ay: [0, 24, -8, 0],
    ax: [0, -16, 6, 0],
    variant: "solid",
    color: "#ffffff",
  },
  {
    left: "-80px",
    bottom: "-70px",
    size: 280,
    dur: 11,
    delay: 1.5,
    opacity: 0.1,
    ay: [0, -20, 0, 0],
    ax: [0, 14, 0, 0],
    variant: "solid",
    color: "#ffffff",
  },
  {
    right: "60px",
    bottom: "60px",
    size: 140,
    dur: 9,
    delay: 0.5,
    opacity: 0.18,
    ay: [0, -14, 6, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: "rgba(255,255,255,0.55)",
  },
  {
    left: "60px",
    top: "70px",
    size: 120,
    dur: 12,
    delay: 2,
    opacity: 0.16,
    ay: [0, 16, -6, 0],
    ax: [0, 4, -2, 0],
    variant: "outline",
    color: "rgba(255,255,255,0.5)",
  },
];

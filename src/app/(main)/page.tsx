"use client";

// ============================================================
// src/app/(main)/page.tsx — TemanTumbuh Landing Page
// Bubble fix: ditempatkan di sudut/tepi, tidak tumpang tindih konten
// ============================================================

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import gsap from "gsap";

// ─── Colour system ────────────────────────────────────────────
const C = {
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

  // Green:      "#E8724A",
  // GreenDeep:  "#C95A38",
  // GreenLight: "#F08968",
  // GreenPale:  "#FDE8DC",

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
function WaveTop({ fill }: { fill: string }) {
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

function WaveBottom({ fill }: { fill: string }) {
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
// Semua bubble ditempatkan di tepi/sudut section, jauh dari konten tengah.
// "solid"   = radial gradient, untuk depth background
// "outline" = border transparan, efek glass bubble
//
// RULE posisi aman:
//   Kiri:  left -60px s/d 60px  (setengah body di luar layar)
//   Kanan: right -60px s/d 60px (setengah body di luar layar)
//   Atas:  top -60px s/d 80px
//   Bawah: bottom -60px s/d 80px
// TIDAK ada bubble di tengah (left 30%-70%, top 20%-70%)
type BubbleCfg = {
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

function FloatingBubbles({ bubbles }: { bubbles: BubbleCfg[] }) {
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
function Reveal({
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
function Pill({ text, onDark = false }: { text: string; onDark?: boolean }) {
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

// ─── H2 ───────────────────────────────────────────────────────
function H2({
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
function PhotoFrame({
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

// ─── Feature Card ─────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
  num,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  num: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden h-full"
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      <span
        className="absolute top-4 right-5 text-6xl font-bold leading-none select-none pointer-events-none"
        style={{ color: C.bg1, fontVariantNumeric: "tabular-nums" }}
      >
        {num}
      </span>
      <div className="w-15 h-15 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-semibold" style={{ color: C.textPrimary }}>
        {title}
      </h3>
      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: C.textSecondary }}
      >
        {desc}
      </p>
      <span className="text-xs font-semibold" style={{ color: C.teal }}>
        Pelajari →
      </span>
    </motion.div>
  );
}

// ─── Purpose Card ─────────────────────────────────────────────
function PurposeCard({
  icon,
  tag,
  title,
  desc,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      <div
        className="h-28 flex items-center justify-center"
        style={{
          background: `linear-gradient(140deg, ${C.tealGhost} 0%, ${C.bg5} 100%)`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: C.white, border: `1.5px solid ${C.tealPale}` }}
        >
          {icon}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full self-start"
          style={{
            background: C.tealGhost,
            color: C.teal,
            border: `1px solid ${C.tealPale}`,
          }}
        >
          {tag}
        </span>
        <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>
          {title}
        </p>
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: C.textSecondary }}
        >
          {desc}
        </p>
        <Link
          href="/register"
          className="text-xs font-semibold inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: C.teal }}
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </motion.div>
  );
}

// ─── How Card ─────────────────────────────────────────────────
function HowCard({
  tag,
  tagColor,
  title,
  desc,
  cta,
  panelContent,
  reverse = false,
}: {
  tag: string;
  tagColor: { bg: string; text: string; border: string };
  title: string;
  desc: string;
  cta: string;
  panelContent: React.ReactNode;
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
        className={`h-52 md:h-auto flex flex-col items-center justify-center gap-5 p-8 ${reverse ? "order-1 md:order-2" : ""}`}
        style={{
          background: `linear-gradient(140deg, ${C.howPanel} 0%, ${C.howBg} 100%)`,
          borderRight: reverse ? "none" : `1px solid ${C.howBorder}`,
          borderLeft: reverse ? `1px solid ${C.howBorder}` : "none",
        }}
      >
        {panelContent}
      </div>
      <div
        className={`p-8 md:p-10 flex flex-col justify-center gap-4 ${reverse ? "order-2 md:order-1" : ""}`}
      >
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full self-start"
          style={{
            background: tagColor.bg,
            color: tagColor.text,
            border: `1px solid ${tagColor.border}`,
          }}
        >
          {tag}
        </span>
        <h3 className="text-xl font-bold" style={{ color: C.textPrimary }}>
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.textSecondary }}
        >
          {desc}
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm font-semibold self-start px-5 py-2.5 rounded-xl transition-opacity hover:opacity-80"
          style={{ background: C.teal, color: C.white }}
        >
          {cta} →
        </Link>
      </div>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────
function TestiCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
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
        className="text-sm leading-relaxed italic flex-1"
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
          style={{ background: C.tealGhost, color: C.teal }}
        >
          {name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>
            {name}
          </p>
          <p className="text-xs" style={{ color: C.textMuted }}>
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const Ic = {
  Diary: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M5 3h9a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke={C.tealMid}
        strokeWidth="1.5"
      />
      <path
        d="M8 8h5M8 12h5M8 16h3"
        stroke={C.tealMid}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Bolt: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M13 2L5 12h7l-1 8 8-10h-7l1-8z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Heart: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 19C11 19 3 13 3 7.5A5 5 0 0111 5.2 5 5 0 0119 7.5C19 13 11 19 11 19z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Chart: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="13" width="4" height="7" rx="1" fill={C.tealPale} />
      <rect x="9" y="8" width="4" height="12" rx="1" fill={C.tealLight} />
      <rect x="16" y="4" width="4" height="16" rx="1" fill={C.teal} />
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2l8 3v5c0 5-3.3 9-8 11C6.3 19 3 15 3 10V5l8-3z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 11l2 2 4-4"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Star: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2l2.5 6.5H20l-5.5 4 2 6.5L11 15l-5.5 4 2-6.5L2 8.5h6.5L11 2z"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="4" stroke={C.teal} strokeWidth="1.5" />
      <path
        d="M3 20c0-4 3.6-7 8-7s8 3 8 7"
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
};

// ════════════════════════════════════════════════════════════
// BUBBLE PRESETS — setiap section hanya 4 bubble:
// 2 solid (pojok, ukuran sedang) + 2 outline (tepi, ukuran kecil)
// Semua berada di pinggir — tidak ada yang di area tengah konten
// ════════════════════════════════════════════════════════════

// HERO — 4 bubble, pojok kanan atas + kiri bawah
const heroBubbles: BubbleCfg[] = [
  // Solid — kanan atas, sebagian keluar layar
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
  // Solid — kiri bawah, sebagian keluar layar
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
  // Outline — kanan bawah, sedikit masuk
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
  // Outline — kiri atas, sedikit masuk
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

// FEATURES — pojok kanan atas + kiri bawah
const featuresBubbles: BubbleCfg[] = [
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

// PURPOSE — pojok kiri atas + kanan bawah
const purposeBubbles: BubbleCfg[] = [
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

// HOW — pojok kanan atas + kiri bawah
const howBubbles: BubbleCfg[] = [
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

// TESTI — pojok kanan atas + kiri bawah
const testiBubbles: BubbleCfg[] = [
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

// CTA — pojok kanan atas + kiri bawah, semua putih
const ctaBubbles: BubbleCfg[] = [
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

// ════════════════════════════════════════════════════════════
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const springY = useSpring(heroParallax, { stiffness: 80, damping: 20 });

  return (
    <main
      style={{
        background: C.bg0,
        fontFamily: "var(--font-plus-jakarta, sans-serif)",
      }}
    >
      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{
          background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
          minHeight: "calc(100vh - 64px)",
          paddingBottom: 72,
        }}
      >
        <WaveBottom fill={C.bg1} />
        <FloatingBubbles bubbles={heroBubbles} />

        {/* Parallax blob kanan atas — sangat besar, di belakang semua */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              right: -120,
              top: -120,
              width: 560,
              height: 560,
              background: `radial-gradient(circle at 40% 40%, ${C.tealGhost} 0%, transparent 60%)`,
              y: springY,
              opacity: heroOpacity,
            }}
          />
        </div>

        <div
          className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28 w-full"
          style={{ zIndex: 2 }}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 mt-3"
                style={{ color: C.textPrimary }}
              >
                AI Diary untuk{" "}
                <span style={{ color: C.teal }}>
                  Dukungan
                  <br />
                  Emosional
                </span>{" "}
                &amp; Keamanan Diri
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                className="text-sm md:text-base leading-relaxed mb-8 max-w-md"
                style={{ color: C.textSecondary }}
              >
                Platform refleksi diri yang membantu kamu memahami emosi,
                membangun kebiasaan positif, dan tumbuh lebih aman di era
                digital.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: C.teal,
                    boxShadow: `0 4px 20px rgba(26,150,136,0.32)`,
                  }}
                >
                  Mulai Sekarang <Ic.Arrow />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    border: `1.5px solid ${C.border}`,
                    color: C.textPrimary,
                  }}
                >
                  Pelajari Fitur
                </Link>
              </motion.div>
            </div>

            {/* Photo frames */}
            <div className="hidden md:block relative" style={{ height: 400 }}>
              <PhotoFrame
                label="Diary Harian"
                sublabel="Senin, 14 Jan 2025"
                rotate={-2}
                zIndex={3}
                className="top-1/2 left-1/2"
                style={{ transform: "translate(-50%,-50%)" }}
              />
              <PhotoFrame
                label="Mood Check-in"
                sublabel="Perasaan: Senang"
                rotate={5}
                zIndex={2}
                className="top-4 left-4"
              />
              <PhotoFrame
                label="Insight Minggu Ini"
                sublabel="Tren emosi positif"
                rotate={-6}
                zIndex={2}
                className="bottom-4 right-4"
              />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-8 right-12 w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${C.tealLight}44 0%, transparent 70%)`,
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section
        id="features"
        className="relative py-20 md:py-28"
        style={{
          background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg2} 100%)`,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <WaveTop fill={C.bg1} />
        <WaveBottom fill={C.bg2} />
        <FloatingBubbles bubbles={featuresBubbles} />
        <div
          className="relative max-w-6xl mx-auto px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Fitur Unggulan" />
            <H2
              accent="TemanTumbuh"
              title="'s Fitur"
              sub="Semua yang kamu butuhkan untuk memahami diri sendiri dan tumbuh lebih baik setiap harinya."
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              {
                icon: (
                  <img
                    src="/img/DigitalDiaryLogo.svg"
                    alt="Digital Diary"
                    className="w-15 h-15"
                  />
                ),
                title: "Digital Diary",
                desc: "Tulis perasaan dan pikiranmu setiap hari dengan aman, privat, dan terstruktur.",
              },
              {
                icon: (
                  <img
                    src="/img/BraveChoiceLogo.svg"
                    alt="Brave Choice"
                    className="w-15 h-15"
                  />
                ),
                title: "Brave Choice Simulator",
                desc: "Latih dirimu menghadapi situasi sosial yang sulit melalui simulasi interaktif.",
              },
              {
                icon: (
                  <img
                    src="/img/MoodCheckinLogo.svg"
                    alt="Mood Check-in"
                    className="w-15 h-15"
                  />
                ),
                title: "Mood Check-in",
                desc: "Lacak suasana hatimu setiap hari dan kenali pola emosi dari waktu ke waktu.",
              },
              {
                icon: (
                  <img
                    src="/img/InsightDashboardLogo.svg"
                    alt="Insight Dashboard"
                    className="w-15 h-15"
                  />
                ),
                title: "Insight Dashboard",
                desc: "Visualisasi tren emosimu dan dapatkan rekomendasi yang relevan untukmu.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <FeatureCard {...f} num={String(i + 1).padStart(2, "0")} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PURPOSE / ABOUT US ══════════════ */}
      <section
        id="purpose"
        className="relative py-20 md:py-28"
        style={{
          background: `linear-gradient(160deg, ${C.bg2} 0%, ${C.howBg} 100%)`,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <WaveTop fill={C.bg2} />
        <WaveBottom fill={C.howBg} />
        <FloatingBubbles bubbles={purposeBubbles} />
        <div
          className="relative max-w-6xl mx-auto px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Untuk Siapa?" />
            <H2
              accent="TemanTumbuh"
              title="'s Tujuan"
              sub="Kami hadir untuk menemanimu di setiap tahap pertumbuhan — dari anak-anak hingga dewasa muda."
            />
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: <Ic.Shield />,
                tag: "10–12 tahun",
                title: "Untuk Anak",
                desc: "Antarmuka yang ramah dan menyenangkan untuk membantu anak mengenali dan mengekspresikan perasaan mereka dengan aman.",
              },
              {
                icon: <Ic.Star />,
                tag: "13–17 tahun",
                title: "Untuk Remaja",
                desc: "Ruang aman bercerita, edukasi situasi berisiko, dan fitur streak untuk menjaga motivasi setiap hari.",
              },
              {
                icon: <Ic.User />,
                tag: "18–29 tahun",
                title: "Untuk Mahasiswa & Dewasa",
                desc: "Insight mendalam, laporan PDF, dan analisis tren emosi jangka panjang untuk mendukung kesehatan mental yang proaktif.",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <PurposeCard {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section
        id="how"
        className="relative py-16 md:py-24"
        style={{
          background: `linear-gradient(180deg, ${C.howBg} 0%, ${C.howBgBot} 100%)`,
          paddingTop: 88,
          paddingBottom: 88,
        }}
      >
        <WaveTop fill={C.howBg} />
        <WaveBottom fill={C.bg5} />
        <FloatingBubbles bubbles={howBubbles} />
        <div
          className="relative max-w-6xl mx-auto px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Cara Kerja" />
            <H2
              title="Bagaimana Cara Kerjanya?"
              sub="Sederhana, cepat, dan aman untuk seluruh keluarga."
            />
          </Reveal>
          <div className="flex flex-col gap-6 mt-12">
            <Reveal>
              <HowCard
                tag="Untuk Anak & Remaja"
                tagColor={{ bg: C.tealGhost, text: C.teal, border: C.tealPale }}
                title="Mulai dengan Diary Harian"
                desc="Cukup tulis bagaimana perasaanmu hari ini. AI kami akan membantu memahami emosimu dan memberikan dukungan yang tepat tanpa menghakimi."
                cta="Coba Sekarang"
                panelContent={
                  <div className="flex flex-col items-center gap-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: C.white,
                        border: `1.5px solid ${C.tealPale}`,
                        boxShadow: "0 2px 12px rgba(26,150,136,0.1)",
                      }}
                    >
                      <Ic.Diary />
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full"
                          style={{
                            width: i === 0 ? 28 : 14,
                            background: i === 0 ? C.teal : C.tealPale,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                }
              />
            </Reveal>
            <Reveal delay={0.1}>
              <HowCard
                reverse
                tag="Untuk Orang Tua"
                tagColor={{ bg: C.goldPale, text: C.gold, border: "#F0D898" }}
                title="Pantau dengan Laporan Berkala"
                desc="Terima laporan ringkas tentang perkembangan emosi anak langsung ke email kamu — tanpa menganggu privasi mereka."
                cta="Pelajari Fitur Orang Tua"
                panelContent={
                  <div className="flex flex-col items-center gap-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: C.white,
                        border: `1.5px solid ${C.howBorder}`,
                        boxShadow: "0 2px 12px rgba(224,160,48,0.1)",
                      }}
                    >
                      <Ic.Shield />
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full"
                          style={{
                            width: i === 1 ? 28 : 14,
                            background: i === 1 ? C.gold : "#F0D898",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                }
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section
        id="testi"
        className="relative py-20 md:py-28"
        style={{
          background: `linear-gradient(180deg, ${C.bg5} 0%, ${C.bg6} 100%)`,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <WaveTop fill={C.bg5} />
        <WaveBottom fill={C.GreenDeep} />
        <FloatingBubbles bubbles={testiBubbles} />
        <div
          className="relative max-w-6xl mx-auto px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Testimoni" />
            <H2
              title="Apa Kata Mereka?"
              sub="Ribuan pengguna telah merasakan manfaatnya."
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              {
                name: "Abdul Nurul Fikri",
                role: "Mahasiswa, 20 tahun",
                quote:
                  "TemanTumbuh benar-benar membantu aku memahami pola stres akademikku. Sekarang aku lebih tahu cara mengelolanya!",
              },
              {
                name: "Sari Dewi",
                role: "Orang tua, Bandung",
                quote:
                  "Laporan berkala sangat membantu. Aku bisa tahu kondisi emosi anak tanpa menganggu privasinya.",
              },
              {
                name: "Reza Pratama",
                role: "Remaja, 15 tahun",
                quote:
                  "Awalnya ragu, tapi ternyata asyik banget nulis diary di sini. Rasanya lebih lega setelah cerita.",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <TestiCard {...t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section
        className="py-20 md:py-24 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.GreenDeep} 0%, ${C.Green} 60%, ${C.GreenLight} 100%)`,
          paddingTop: 88,
        }}
      >
        <WaveTop fill={C.GreenDeep} />
        <FloatingBubbles bubbles={ctaBubbles} />

        <Reveal>
          <div
            className="relative max-w-2xl mx-auto px-6 text-center"
            style={{ zIndex: 2 }}
          >
            <div className="flex justify-center mb-4">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#ffffff",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                Gratis
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Siap Mulai Perjalananmu?
            </h2>
            <p
              className="text-sm md:text-base leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              Bergabunglah bersama ribuan pengguna yang telah merasakan manfaat
              TemanTumbuh. Gratis, aman, dan selalu ada untukmu.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                background: C.white,
                color: C.Green,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              Mulai Diary Sekarang <Ic.Arrow />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

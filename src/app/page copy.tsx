"use client";

// ============================================================
// src/app/page.tsx — TemanTumbuh Landing Page
// - Organic wave dividers between sections (no hard cuts)
// - SVG social icons in footer
// - Logo from /img/LOGO_TEMANTUMBUH.svg
// - How section cards: lighter, warm bg matching main palette
// - Playful organic shapes inspired by kids/youth web design
// ============================================================

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  // Section backgrounds — warm ivory → soft sky flow
  bg0: "#FAFBFF", // hero       — near white, barely blue
  bg1: "#EEF4FB", // features   — light periwinkle
  bg2: "#E4EEFA", // purpose    — soft blue
  bg5: "#E8F7F3", // testi      — fresh mint
  bg6: "#D8F1EB", // testi bot  — deeper mint

  // How section — soft teal-mint, same family as page but distinct
  // Hue stays in 190-200° range (consistent), just lighter/more saturated
  howBg: "#E0F5F0", // soft mint — related to bg5/bg6 testi palette
  howBgBot: "#D0EDE7", // slightly deeper mint
  howCard: "#FFFFFF", // white card pops cleanly on mint
  howPanel: "#C8E8E2", // muted teal panel — visibly different from card
  howBorder: "#A8D4CC", // teal-mint border

  // Brand teal
  teal: "#1A9688",
  tealMid: "#28B0A4",
  tealLight: "#4ECFC3",
  tealPale: "#A8E0DA",
  tealGhost: "#DDF5F2",

  // Coral/warm accent
  coral: "#E8724A",
  coralDeep: "#C95A38",
  coralLight: "#F08968",
  coralPale: "#FDE8DC",

  // Gold
  gold: "#E0A030",
  goldPale: "#FDF0CC",

  // Text
  textPrimary: "#1A2840",
  textSecondary: "#3A5068",
  textMuted: "#7090A8",
  textOnDark: "#EEF8FF",
  textSubOnDark: "#88C8D8",

  // Footer
  footerBg: "#1C3848",
  footerMid: "#253F50",
  footerCard: "#2E4E62",

  // Surfaces
  white: "#FFFFFF",
  border: "#C8DCED",
};

// ─── Wave Top/Bottom ─────────────────────────────────────────
// Placed INSIDE section as absolute-positioned top or bottom edge.
// fill  = the colour of the NEIGHBOURING section (what we're blending into)
// The wave itself is transparent so section bg shows through.
//
// Usage: put <WaveTop fill={prevSectionBg}/> at top of current section,
//         put <WaveBottom fill={nextSectionBg}/> at bottom.
// The section must have position:relative and enough padding to not
// overlap content.

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
        {/* fill = colour of section ABOVE — paints over this section top */}
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
        {/* fill = colour of section BELOW — paints over this section bottom */}
        <path
          d="M0,44 C240,12 480,64 720,36 C960,8 1200,60 1440,28 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ─── Fade-up reveal ───────────────────────────────────────────
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

// ─── Pill label ───────────────────────────────────────────────
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

// ─── Section heading ──────────────────────────────────────────
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
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: C.tealGhost, border: `1px solid ${C.tealPale}` }}
      >
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
// Lighter warm version — white card on warm ivory bg
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
      {/* Visual panel */}
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
      {/* Text */}
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

// ─── Stat ─────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-bold" style={{ color: C.tealMid }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: C.textMuted }}>
        {label}
      </span>
    </div>
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
  Instagram: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  YouTube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M1 6l7 4.5L15 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 3a1 1 0 011-1h2.5l1 3L5 6.5a9 9 0 004.5 4.5L11 9.5l3 1V13a1 1 0 01-1 1C6.5 14 2 9.5 2 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ════════════════════════════════════════════════════════════
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const springY = useSpring(heroParallax, { stiffness: 80, damping: 20 });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: C.bg0,
        fontFamily: "var(--font-plus-jakarta )",
      }}
    >
      {/* ══════════════ NAVBAR ══════════════ */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50"
        style={{
          background: "rgba(250,251,255,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo from public */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image
              src="/img/LOGO_TEMANTUMBUH.svg"
              alt="TemanTumbuh"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span
              className="text-sm font-bold"
              style={{ color: C.textPrimary }}
            >
              TemanTumbuh
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {[
              { label: "Beranda", href: "/" },
              { label: "Fitur", href: "#features" },
              { label: "Tentang Kami", href: "#purpose" },
              { label: "Harga", href: "#" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium transition-opacity hover:opacity-60"
                style={{ color: C.textSecondary }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-70"
              style={{ color: C.teal }}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                background: C.teal,
                boxShadow: `0 2px 12px rgba(26,150,136,0.3)`,
              }}
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* ══════════════ HERO ══════════════
            bg0 → bg1 gradient, min-height equal to viewport
        ════════════════════════════════════ */}
        <section
          className="relative overflow-hidden flex items-center"
          style={{
            background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
            minHeight: "calc(100vh - 64px)",
            paddingBottom: 72,
          }}
        >
          {/* Wave bottom — blends into features bg */}
          <WaveBottom fill={C.bg1} />
          {/* Animated floating background circles */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {/* Large parallax blob — teal, top right */}
            <motion.div
              className="absolute -top-24 right-0 w-[580px] h-[580px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 65%)`,
                y: springY,
                opacity: heroOpacity,
              }}
            />
            {/* Coral blob — bottom left, slow float */}
            <motion.div
              className="absolute -bottom-16 -left-20 w-80 h-80 rounded-full"
              animate={{ y: [0, -24, 0], x: [0, 14, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, ${C.coralPale} 0%, transparent 68%)`,
              }}
            />
            {/* Mid teal — centre-right, medium speed */}
            <motion.div
              className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full"
              animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.08, 1] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 60%)`,
                opacity: 0.7,
              }}
            />
            {/* Small teal — top left, fast */}
            <motion.div
              className="absolute top-16 left-1/4 w-32 h-32 rounded-full"
              animate={{ y: [0, -18, 6, 0], x: [0, 10, -8, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealPale} 0%, transparent 70%)`,
                opacity: 0.5,
              }}
            />
            {/* Tiny coral accent — middle */}
            <motion.div
              className="absolute top-1/2 left-16 w-20 h-20 rounded-full"
              animate={{ y: [0, 20, -10, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
              style={{
                background: `radial-gradient(circle, ${C.coralPale} 0%, transparent 70%)`,
                opacity: 0.6,
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28 w-full">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Pill text="Untuk usia 10–29 tahun" />
                </motion.div>
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
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center gap-8 pt-8"
                  style={{ borderTop: `1px solid ${C.border}` }}
                >
                  <Stat value="10K+" label="Pengguna aktif" />
                  <div className="w-px h-8" style={{ background: C.border }} />
                  <Stat value="4.8★" label="Rating" />
                  <div className="w-px h-8" style={{ background: C.border }} />
                  <Stat value="100%" label="Privasi" />
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
          {/* Floating bg circles */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
              animate={{ y: [0, 28, 0], x: [0, -16, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 65%)`,
                opacity: 0.8,
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-48 h-48 rounded-full"
              animate={{ y: [0, -22, 0], scale: [1, 1.1, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
              style={{
                background: `radial-gradient(circle, ${C.bg1} 0%, transparent 70%)`,
                opacity: 0.9,
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-28 h-28 rounded-full"
              animate={{ y: [0, 18, -12, 0], x: [0, 12, 0] }}
              transition={{
                duration: 13,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealPale} 0%, transparent 70%)`,
                opacity: 0.5,
              }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
                  icon: <Ic.Diary />,
                  title: "Digital Diary",
                  desc: "Tulis perasaan dan pikiranmu setiap hari dengan aman, privat, dan terstruktur.",
                },
                {
                  icon: <Ic.Bolt />,
                  title: "Brave Choice Simulator",
                  desc: "Latih dirimu menghadapi situasi sosial yang sulit melalui simulasi interaktif.",
                },
                {
                  icon: <Ic.Heart />,
                  title: "Mood Check-in",
                  desc: "Lacak suasana hatimu setiap hari dan kenali pola emosi dari waktu ke waktu.",
                },
                {
                  icon: <Ic.Chart />,
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

        {/* ══════════════ PURPOSE ══════════════ */}
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
          {/* Floating bg circles */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute top-10 left-0 w-64 h-64 rounded-full"
              animate={{ y: [0, 24, 0], x: [0, 18, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 65%)`,
                opacity: 0.7,
              }}
            />
            <motion.div
              className="absolute -bottom-10 right-16 w-56 h-56 rounded-full"
              animate={{ y: [0, -20, 0], scale: [1, 1.12, 1] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              style={{
                background: `radial-gradient(circle, ${C.bg5} 0%, transparent 68%)`,
                opacity: 0.8,
              }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
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

        {/* ══════════════ HOW IT WORKS ══════════════
            bg: warm ivory — NOT dark anymore
            Cards: white on warm peach panels
        ════════════════════════════════════════════ */}
        <section
          className="relative py-16 md:py-24"
          style={{
            background: `linear-gradient(180deg, ${C.howBg} 0%, ${C.howBgBot} 100%)`,
            paddingTop: 88,
            paddingBottom: 88,
          }}
        >
          <WaveTop fill={C.howBg} />
          <WaveBottom fill={C.bg5} />
          {/* Floating bg circles */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute -top-16 right-0 w-80 h-80 rounded-full"
              animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, ${C.howPanel} 0%, transparent 60%)`,
                opacity: 0.9,
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-60 h-60 rounded-full"
              animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 65%)`,
                opacity: 0.7,
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full"
              animate={{ scale: [1, 1.15, 1], y: [0, -14, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealPale} 0%, transparent 70%)`,
                opacity: 0.4,
              }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
                  tagColor={{
                    bg: C.tealGhost,
                    text: C.teal,
                    border: C.tealPale,
                  }}
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
          className="relative py-20 md:py-28"
          style={{
            background: `linear-gradient(180deg, ${C.bg5} 0%, ${C.bg6} 100%)`,
            paddingTop: 72,
            paddingBottom: 72,
          }}
        >
          <WaveTop fill={C.bg5} />
          <WaveBottom fill={C.coralDeep} />
          {/* Floating bg circles */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute top-8 right-8 w-64 h-64 rounded-full"
              animate={{ y: [0, -22, 8, 0], x: [0, 12, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, ${C.tealGhost} 0%, transparent 62%)`,
                opacity: 0.8,
              }}
            />
            <motion.div
              className="absolute bottom-8 left-8 w-48 h-48 rounded-full"
              animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
              style={{
                background: `radial-gradient(circle, ${C.bg6} 0%, transparent 65%)`,
                opacity: 0.9,
              }}
            />
            <motion.div
              className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full"
              animate={{ y: [0, 16, -8, 0], x: [0, -12, 6, 0] }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
              style={{
                background: `radial-gradient(circle, ${C.tealPale} 0%, transparent 70%)`,
                opacity: 0.4,
              }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
            background: `linear-gradient(135deg, ${C.coralDeep} 0%, ${C.coral} 60%, ${C.coralLight} 100%)`,
            paddingTop: 88,
          }}
        >
          <WaveTop fill={C.coralDeep} />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15"
              style={{ background: "#ffffff" }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
              style={{ background: "#ffffff" }}
            />
          </div>
          <Reveal>
            <div className="relative max-w-2xl mx-auto px-6 text-center">
              <div className="flex justify-center mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  Gratis & Tanpa Kartu Kredit
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Siap Mulai Perjalananmu?
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                Bergabunglah bersama ribuan pengguna yang telah merasakan
                manfaat TemanTumbuh. Gratis, aman, dan selalu ada untukmu.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
                style={{
                  background: C.white,
                  color: C.coral,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                Mulai Diary Sekarang <Ic.Arrow />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer
        style={{
          background: `linear-gradient(180deg, ${C.footerBg} 0%, ${C.footerMid} 100%)`,
          borderTop: `1px solid rgba(255,255,255,0.1)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image
                  src="/img/LOGO_TEMANTUMBUH.svg"
                  alt="TemanTumbuh"
                  width={32}
                  height={32}
                  className="rounded-lg brightness-0 invert"
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: C.textOnDark }}
                >
                  TemanTumbuh
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: C.textSubOnDark }}
              >
                Platform refleksi diri dan kesadaran sosial untuk usia 10–29
                tahun. Tumbuh bersama, lebih aman.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:TemanTumbuh@gmail.com"
                  className="text-sm flex items-center gap-2 transition-opacity hover:opacity-70"
                  style={{ color: C.textSubOnDark }}
                >
                  <Ic.Mail /> TemanTumbuh@gmail.com
                </a>
                <a
                  href="tel:+6281234567"
                  className="text-sm flex items-center gap-2 transition-opacity hover:opacity-70"
                  style={{ color: C.textSubOnDark }}
                >
                  <Ic.Phone /> +62 8123-4567
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: C.tealLight }}
              >
                Tautan
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Tentang TemanTumbuh",
                  "Fitur",
                  "Sumber Daya",
                  "Live Demo",
                  "Pelajaran",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm transition-opacity hover:opacity-70"
                      style={{ color: C.textSubOnDark }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social + CTA */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: C.tealLight }}
              >
                Ikuti Kami
              </p>
              {/* Social icons — SVG, equal size 40x40 */}
              <div className="flex gap-3 mb-6">
                {[
                  { icon: <Ic.Instagram />, label: "Instagram", href: "#" },
                  { icon: <Ic.Twitter />, label: "Twitter/X", href: "#" },
                  { icon: <Ic.YouTube />, label: "YouTube", href: "#" },
                ].map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="transition-all hover:opacity-80 hover:-translate-y-0.5"
                    style={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      background: C.footerCard,
                      color: C.tealLight,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: C.teal, color: C.white }}
              >
                Mulai Diary →
              </Link>
            </div>
          </div>

          <div
            className="mt-12 pt-6 text-center text-xs"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.42)",
            }}
          >
            TemanTumbuh © 2025. All rights reserved. · Proyek Perangkat Lunak I
            · Kelompok Cegukan · Universitas Padjadjaran
          </div>
        </div>
      </footer>
    </div>
  );
}

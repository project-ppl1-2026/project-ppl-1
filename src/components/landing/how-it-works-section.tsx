"use client";

// ============================================================
// how-it-works-section.tsx — TemanTumbuh How It Works Section
// Paste1 HowCard layout + Paste2 numbered step lists
// ============================================================

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Shield } from "lucide-react";
import {
  WaveTop,
  WaveBottom,
  FloatingBubbles,
  Reveal,
  Pill,
  SectionH2,
} from "./landing-primitives";
import { C, howBubbles, howItWorksSteps } from "@/lib/landing-data";

export function HowItWorksSection() {
  return (
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
          <SectionH2
            title="Bagaimana Cara Kerjanya?"
            sub="Sederhana, cepat, dan aman untuk seluruh keluarga."
          />
        </Reveal>

        <div className="flex flex-col gap-6 mt-12">
          {/* Card: Anak & Remaja */}
          <Reveal>
            <HowCard
              accentBg={C.teal}
              accentShadow="rgba(13,148,136,0.25)"
              tag="UNTUK ANAK & REMAJA"
              tagStyle={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
              title="Mulai dengan Diary Harian"
              titleColor="#ffffff"
              desc="Cukup tulis bagaimana perasaanmu hari ini. AI kami akan membantu memahami emosimu dan memberikan dukungan yang tepat tanpa menghakimi."
              descColor="rgba(255,255,255,0.88)"
              ctaHref="/register"
              ctaLabel="Daftar Sekarang"
              ctaStyle={{ background: C.white, color: C.teal }}
              steps={howItWorksSteps.teens}
              stepBubbleStyle={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
              }}
              stepTextColor="rgba(255,255,255,0.9)"
              panelContent={
                <PanelIcon
                  color={C.teal}
                  borderColor={C.tealPale}
                  dotColors={[C.teal, C.tealPale, C.tealPale]}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </PanelIcon>
              }
              reverse={false}
            />
          </Reveal>

          {/* Card: Orang Tua */}
          <Reveal delay={0.1}>
            <HowCard
              accentBg="linear-gradient(135deg, #FFF9EE 0%, #FFF3D6 100%)"
              accentShadow="rgba(245,158,11,0.18)"
              tag="UNTUK ORANG TUA"
              tagStyle={{ background: "rgba(245,158,11,0.2)", color: C.gold }}
              title="Pantau dengan Laporan Berkala"
              titleColor="#7C3503"
              desc="Terima laporan ringkas tentang perkembangan emosi anak langsung ke email kamu — tanpa menganggu privasi mereka."
              descColor="#7C3503CC"
              ctaHref="/features/parent"
              ctaLabel="Pelajari Fitur Orang Tua"
              ctaStyle={{ background: "#F59E0B", color: C.white }}
              steps={howItWorksSteps.parents}
              stepBubbleStyle={{
                background: "rgba(245,158,11,0.25)",
                color: C.gold,
              }}
              stepTextColor="#7C3503"
              panelContent={
                <PanelIcon
                  color={C.howBorder}
                  borderColor={C.howBorder}
                  dotColors={["#F59E0B", "#F0D898", "#F0D898"]}
                >
                  <Shield className="h-6 w-6" style={{ color: C.gold }} />
                </PanelIcon>
              }
              reverse
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Panel Icon (visual accent inside left/right panel) ───────
function PanelIcon({
  children,
  color,
  borderColor,
  dotColors,
}: {
  children: React.ReactNode;
  color: string;
  borderColor: string;
  dotColors: [string, string, string];
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: C.white,
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 2px 12px ${color}22`,
        }}
      >
        {children}
      </div>
      <div className="flex gap-1.5">
        {dotColors.map((dotColor, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full"
            style={{ width: i === 0 ? 28 : 14, background: dotColor }}
          />
        ))}
      </div>
    </div>
  );
}

// ── How Card ──────────────────────────────────────────────────
function HowCard({
  accentBg,
  accentShadow,
  tag,
  tagStyle,
  title,
  titleColor,
  desc,
  descColor,
  ctaHref,
  ctaLabel,
  ctaStyle,
  steps,
  stepBubbleStyle,
  stepTextColor,
  panelContent,
  reverse,
}: {
  accentBg: string;
  accentShadow: string;
  tag: string;
  tagStyle: React.CSSProperties;
  title: string;
  titleColor: string;
  desc: string;
  descColor: string;
  ctaHref: string;
  ctaLabel: string;
  ctaStyle: React.CSSProperties;
  steps: string[];
  stepBubbleStyle: React.CSSProperties;
  stepTextColor: string;
  panelContent: React.ReactNode;
  reverse: boolean;
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden grid md:grid-cols-2"
      style={{
        background: accentBg,
        boxShadow: `0px 16px 48px ${accentShadow}`,
        border: reverse ? `2px solid ${C.howBorder}33` : "none",
      }}
    >
      {/* Panel (visual side) */}
      <div
        className={`h-52 md:h-auto flex flex-col items-center justify-center gap-5 p-8 relative overflow-hidden ${
          reverse ? "order-1 md:order-2" : ""
        }`}
        style={
          !reverse
            ? {
                background: `linear-gradient(140deg, ${C.teal}CC 0%, ${C.tealMid} 100%)`,
              }
            : {
                background: "transparent",
                borderLeft: `1px solid ${C.howBorder}`,
              }
        }
      >
        {/* Subtle inner bubble */}
        {!reverse && (
          <div
            className="pointer-events-none absolute top-0 right-0 rounded-full opacity-10"
            style={{
              width: 200,
              height: 200,
              background: "#fff",
              transform: "translate(40%, -40%)",
            }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10">{panelContent}</div>
      </div>

      {/* Content side */}
      <div
        className={`p-8 md:p-10 flex flex-col justify-center gap-5 ${
          reverse ? "order-2 md:order-1" : ""
        }`}
      >
        <div
          className="inline-flex items-center self-start gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider"
          style={tagStyle}
        >
          {tag}
        </div>

        <h3 className="text-2xl font-bold" style={{ color: titleColor }}>
          {title}
        </h3>

        {/* Step list */}
        <ul className="space-y-2.5">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-3"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={stepBubbleStyle}
              >
                {i + 1}
              </div>
              <span className="text-sm" style={{ color: stepTextColor }}>
                {step}
              </span>
            </motion.li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed" style={{ color: descColor }}>
          {desc}
        </p>

        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 text-sm font-semibold self-start px-6 py-3 rounded-xl transition-opacity hover:opacity-80 mt-2"
          style={ctaStyle}
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

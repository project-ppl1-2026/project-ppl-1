"use client";

// ============================================================
// features-section.tsx — TemanTumbuh Features Section
// Paste1 visual style + Paste2 lucide icons + stagger animation
// ============================================================

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Heart, BarChart2 } from "lucide-react";
import {
  WaveTop,
  WaveBottom,
  FloatingBubbles,
  Reveal,
  Pill,
  SectionH2,
} from "./landing-primitives";
import { C, features, featuresBubbles } from "@/lib/landing-data";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function FeaturesSection() {
  return (
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
          <SectionH2
            accent="TemanTumbuh"
            title="'s Fitur"
            sub="Semua yang kamu butuhkan untuk memahami diri sendiri dan tumbuh lebih baik setiap harinya."
          />
        </Reveal>

        {/* Staggered grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={staggerItem}
              className="h-full"
            >
              <FeatureCard feat={feat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({ feat }: { feat: (typeof features)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden h-full bg-white"
      style={{
        border: `1.5px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
      }}
    >
      {/* Background number */}
      <span
        className="absolute top-4 right-5 text-6xl font-bold leading-none select-none pointer-events-none"
        style={{ color: C.bg1, fontVariantNumeric: "tabular-nums" }}
      >
        {feat.num}
      </span>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${C.teal}1A` }}
      >
        {feat.imageSrc ? (
          <Image
            src={feat.imageSrc}
            alt={feat.title}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <FeatIcon name={feat.iconName} />
        )}
      </div>

      {/* Tag */}
      <span
        className="self-start text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{
          background: C.tealGhost,
          color: C.teal,
          border: `1px solid ${C.tealPale}`,
        }}
      >
        {feat.tag}
      </span>

      <h3 className="text-sm font-semibold" style={{ color: C.textPrimary }}>
        {feat.title}
      </h3>
      <p
        className="text-xs leading-relaxed flex-1"
        style={{ color: C.textSecondary }}
      >
        {feat.desc}
      </p>

      <Link
        href={feat.learnHref}
        className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
        style={{ color: C.teal }}
      >
        Pelajari <ArrowRight className="h-3 w-3" />
      </Link>
    </motion.div>
  );
}

// ── Icon resolver (lucide-react) ──────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Brain,
  Heart,
  BarChart2,
};

function FeatIcon({ name }: { name: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className="h-5 w-5 text-teal-600" />;
}

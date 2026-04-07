"use client";

// ============================================================
// purpose-section.tsx — TemanTumbuh Purpose / About Section
// Paste1 layout + Paste2 WhiteCard + lucide icons + theme
// ============================================================

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Star, Users } from "lucide-react";
import {
  WaveTop,
  WaveBottom,
  FloatingBubbles,
  Reveal,
  Pill,
  SectionH2,
} from "./landing-primitives";
import {
  C,
  purposes,
  purposeThemes,
  purposeBubbles,
  type PurposeThemeKey,
} from "@/lib/landing-data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Star,
  Users,
};

export function PurposeSection() {
  return (
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
          <SectionH2
            accent="TemanTumbuh"
            title="'s Tujuan"
            sub="Kami hadir untuk menemanimu di setiap tahap pertumbuhan — dari anak-anak hingga dewasa muda."
          />
        </Reveal>

        <motion.div
          className="grid sm:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {purposes.map((p) => {
            const Icon = iconMap[p.iconName];
            const theme = purposeThemes[p.themeKey as PurposeThemeKey];

            return (
              <motion.div
                key={p.title}
                variants={staggerItem}
                className="h-full"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl overflow-hidden flex flex-col h-full bg-white"
                  style={{
                    border: `1.5px solid ${C.border}`,
                    boxShadow: "0 2px 16px rgba(26,40,64,0.07)",
                  }}
                >
                  {/* Top gradient banner */}
                  <div
                    className="h-28 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(140deg, ${C.tealGhost} 0%, ${C.bg5} 100%)`,
                    }}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        theme.iconBg,
                      )}
                      style={{ border: `1.5px solid ${C.tealPale}` }}
                    >
                      <Icon
                        className={cn("h-6 w-6", p.colorClass)}
                        strokeWidth={2.2}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full self-start border",
                        theme.tagBg,
                        theme.tagText,
                        theme.tagBorder,
                      )}
                    >
                      {p.tag}
                    </span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: C.textPrimary }}
                    >
                      {p.title}
                    </p>
                    <p
                      className="text-xs leading-relaxed flex-1"
                      style={{ color: C.textSecondary }}
                    >
                      {p.desc}
                    </p>

                    {/* Accent bar */}
                    <div
                      className={cn("h-1 w-10 rounded-full mt-1", theme.bar)}
                    />

                    <Link
                      href="/register"
                      className="text-xs font-semibold inline-flex items-center gap-1 transition-opacity hover:opacity-70 mt-1"
                      style={{ color: C.teal }}
                    >
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// src/components/landing/home/landing-page.tsx
// Komponen utama landing home page (route "/")
// ============================================================

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import {
  C,
  WaveBottom,
  WaveTop,
  FloatingBubbles,
  Reveal,
  Pill,
  SectionHeading,
  FeatureCard,
  PurposeCard,
  TestiCard,
  heroBubbles,
  featuresBubbles,
  howBubbles,
  purposeBubbles,
  testiBubbles,
  ctaBubbles,
} from "@/components/ui/manual/landing";

function HowSectionCard({
  tag,
  tagStyle,
  title,
  bulletPoints,
  ctaLabel,
  ctaStyle,
  bgStyle,
}: {
  tag: string;
  tagStyle: React.CSSProperties;
  title: string;
  bulletPoints: string[];
  ctaLabel: string;
  ctaStyle: React.CSSProperties;
  bgStyle: React.CSSProperties;
}) {
  return (
    <div
      className="rounded-2xl flex h-full flex-col gap-4 p-6 md:p-8"
      style={{
        ...bgStyle,
        border: `1.5px solid ${C.howBorder}`,
      }}
    >
      <span
        className="self-start rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
        style={tagStyle}
      >
        {tag}
      </span>

      <h3
        className="text-base font-bold md:text-lg"
        style={{ color: tagStyle.color }}
      >
        {title}
      </h3>

      <ul className="flex flex-1 flex-col gap-2">
        {bulletPoints.map((point, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs"
            style={{ color: tagStyle.color }}
          >
            <span
              className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ background: `${String(tagStyle.color)}22` }}
            >
              {i + 1}
            </span>
            {point}
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl px-4 py-2.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={ctaStyle}
      >
        {ctaLabel} →
      </Link>
    </div>
  );
}

function HeroPolaroid({
  src,
  alt,
  label,
  rotate = 0,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: rotate - 2, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotate: rotate + 1, scale: 1.02 }}
      className={`absolute ${className}`}
      style={{ transformOrigin: "center center" }}
    >
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          width: 220,
          background: C.white,
          padding: "12px 12px 42px",
          boxShadow:
            "0 18px 48px rgba(26,40,64,0.16), 0 6px 18px rgba(26,40,64,0.10)",
          border: `1.5px solid ${C.border}`,
        }}
      >
        <div className="relative h-[220px] w-full overflow-hidden rounded-xl bg-[#F3F8FC]">
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>

        <div className="pt-3 text-center">
          <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HeroFloatingCard({
  title,
  subtitle,
  className = "",
  accent = "teal",
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  accent?: "teal" | "green";
  children?: React.ReactNode;
}) {
  const bg =
    accent === "green" ? "rgba(34,197,94,0.10)" : "rgba(26,150,136,0.10)";
  const fg = accent === "green" ? "#16A34A" : C.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.55 },
        scale: { duration: 0.55 },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`absolute ${className}`}
    >
      <div
        className="rounded-2xl px-4 py-3"
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          boxShadow: "0 12px 30px rgba(26,40,64,0.12)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: bg, color: fg }}
          >
            {children}
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: C.textPrimary }}>
              {title}
            </p>
            <p className="text-[11px]" style={{ color: fg }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroFloatingEmoji({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`absolute ${className}`}
    >
      <div
        className="rounded-2xl bg-white p-3"
        style={{
          border: `1px solid ${C.border}`,
          boxShadow: "0 12px 30px rgba(26,40,64,0.12)",
        }}
      >
        <p
          className="mb-1 text-xs font-semibold"
          style={{ color: C.textPrimary }}
        >
          Mood Hari Ini
        </p>

        <div className="flex gap-1.5">
          {[
            "/img/Emojis/FaceVerySad.png",
            "/img/Emojis/FaceSad.png",
            "/img/Emojis/FaceNeutral.png",
            "/img/Emojis/FaceHappy.png",
            "/img/Emojis/FaceVeryHappy.png",
          ].map((src, i) => (
            <div
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                i === 4 ? "bg-teal-50 ring-2 ring-teal-500" : "bg-slate-50"
              }`}
            >
              <Image
                src={src}
                alt="mood"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const springY = useSpring(heroParallax, { stiffness: 80, damping: 20 });

  return (
    <main
      style={{
        background: C.bg0,
        fontFamily: "var(--font-plus-jakarta)",
      }}
    >
      {/* Hero */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
          minHeight: "calc(100vh - 64px)",
          paddingBottom: 72,
        }}
      >
        <WaveBottom fill={C.bg1} />
        <FloatingBubbles bubbles={heroBubbles} />

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
          className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-5 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
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
                className="mb-8 max-w-md text-sm leading-relaxed md:text-base"
                style={{ color: C.textSecondary }}
              >
                Platform refleksi diri dan kesadaran emosional untuk usia 10–29
                tahun. Ceritakan harimu, lacak moodmu, dan tumbuh bersama AI
                yang peduli.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: C.teal,
                    boxShadow: `0 4px 20px rgba(26,150,136,0.32)`,
                  }}
                >
                  Mulai Sekarang
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:bg-[#EEF4FB]"
                  style={{
                    border: `1.5px solid ${C.border}`,
                    color: C.textPrimary,
                  }}
                >
                  Lihat Fitur
                </Link>
              </motion.div>
            </div>

            <div
              className="relative hidden items-center justify-center md:flex"
              style={{ height: 460 }}
            >
              <div className="relative h-[420px] w-full max-w-[460px]">
                <HeroPolaroid
                  src="/img/hero-polaroid-1.jpg"
                  alt="Diary reflection"
                  label="Ceritakan harimu"
                  rotate={-6}
                  className="bottom-2 left-0 z-20"
                />

                <HeroPolaroid
                  src="/img/hero-polaroid-2.jpg"
                  alt="Mood support"
                  label="Tumbuh lebih tenang"
                  rotate={7}
                  className="right-2 top-2 z-10"
                />

                <HeroFloatingCard
                  title="Mood Check-in"
                  subtitle="Streak 12 hari!"
                  accent="green"
                  className="left-1/2 top-0 z-30 -translate-x-1/2"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </HeroFloatingCard>
              </div>
              <HeroFloatingEmoji className="bottom-6 right-0 z-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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
          className="relative mx-auto max-w-6xl px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Fitur Unggulan" />
            <SectionHeading
              accent="TemanTumbuh"
              title="'s Fitur"
              sub="Semua yang kamu butuhkan untuk memahami diri sendiri dan tumbuh lebih baik setiap harinya."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
                  <Image
                    width={60}
                    height={60}
                    src="/img/DigitalDiaryLogo.svg"
                    alt="Digital Diary"
                    className="h-12 w-12 object-contain md:h-14 md:w-14"
                  />
                ),
                title: "Digital Diary",
                desc: "Tulis perasaan dan pikiranmu setiap hari dengan aman, privat, dan terstruktur.",
                badge: "AI-Powered",
              },
              {
                icon: (
                  <Image
                    width={60}
                    height={60}
                    src="/img/BraveChoiceLogo.svg"
                    alt="Brave Choice"
                    className="h-12 w-12 object-contain md:h-14 md:w-14"
                  />
                ),
                title: "Brave Choice Simulator",
                desc: "Latih dirimu menghadapi situasi sosial yang sulit melalui simulasi interaktif.",
                badge: "Gamifikasi",
              },
              {
                icon: (
                  <Image
                    width={60}
                    height={60}
                    src="/img/MoodCheckinLogo.svg"
                    alt="Mood Check-in"
                    className="h-12 w-12 object-contain md:h-14 md:w-14"
                  />
                ),
                title: "Mood Check-in",
                desc: "Lacak suasana hatimu setiap hari dan kenali pola emosi dari waktu ke waktu.",
                badge: "Harian",
              },
              {
                icon: (
                  <Image
                    width={60}
                    height={60}
                    src="/img/InsightDashboardLogo.svg"
                    alt="Insight Dashboard"
                    className="h-12 w-12 object-contain md:h-14 md:w-14"
                  />
                ),
                title: "Insight Dashboard",
                desc: "Visualisasi tren emosimu dan dapatkan rekomendasi yang relevan untukmu.",
                badge: "Premium",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section
        id="how"
        className="relative py-16 md:py-24"
        style={{
          background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.howBg} 100%)`,
          paddingTop: 88,
          paddingBottom: 88,
        }}
      >
        <WaveTop fill={C.bg2} />
        <WaveBottom fill={C.howBg} />
        <FloatingBubbles bubbles={howBubbles} />

        <div
          className="relative mx-auto max-w-6xl px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Cara Kerja" />
            <SectionHeading
              title="Bagaimana Cara Kerjanya?"
              sub="Sederhana dan mudah digunakan oleh semua kalangan."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <HowSectionCard
                tag="Untuk Anak & Remaja"
                tagStyle={{
                  background: "rgba(26,150,136,0.12)",
                  color: C.teal,
                  border: `1px solid ${C.tealPale}`,
                }}
                title="Mulai dengan Diary Harian"
                bulletPoints={[
                  "Tulis perasaanmu dalam 2 menit",
                  "Ceritakan harimu ke AI Diary",
                  "Jawab Brave Choice Tools",
                  "Lihat perkembangan moodmu",
                ]}
                ctaLabel="Coba Sekarang"
                ctaStyle={{ background: C.teal, color: C.white }}
                bgStyle={{
                  background: `linear-gradient(140deg, ${C.tealGhost} 0%, ${C.howBg} 100%)`,
                }}
              />
            </Reveal>

            <Reveal delay={0.1}>
              <HowSectionCard
                tag="Untuk Orang Tua"
                tagStyle={{
                  background: "rgba(224,160,48,0.12)",
                  color: C.gold,
                  border: "1px solid #F0D898",
                }}
                title="Pantau dengan Laporan Khusus"
                bulletPoints={[
                  "Terima undangan dari anak",
                  "Akses laporan mood mingguan",
                  "Pantau tren emosi tanpa mengganggu privasi diary",
                ]}
                ctaLabel="Pelajari Lebih Lanjut"
                ctaStyle={{ background: C.gold, color: C.white }}
                bgStyle={{
                  background:
                    "linear-gradient(140deg, #FDF6E3 0%, #FFF8E7 100%)",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section
        id="purpose"
        className="relative py-20 md:py-28"
        style={{
          background: `linear-gradient(160deg, ${C.howBg} 0%, ${C.bg5} 100%)`,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <WaveTop fill={C.howBg} />
        <WaveBottom fill={C.bg5} />
        <FloatingBubbles bubbles={purposeBubbles} />

        <div
          className="relative mx-auto max-w-6xl px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Tujuan Kami" />
            <SectionHeading
              accent="TemanTumbuh"
              title="'s Tujuan"
              sub="Kami percaya setiap remaja berhak mendapat ruang aman untuk tumbuh."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "Ruang Aman",
                desc: "Privasi penggunanya terlindungi. Diary tidak bisa diakses siapapun tanpa izin.",
              },
              {
                title: "Dukungan Keluarga",
                desc: "Sambungkan orang tua dengan perkembangan anak melalui laporan ringkas yang aman.",
              },
              {
                title: "Berbasis Riset",
                desc: "Mendorong daya kognitif psikologis positif dan praktik kesehatan mental terbaik.",
              },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <PurposeCard {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
          className="relative mx-auto max-w-6xl px-6 lg:px-8"
          style={{ zIndex: 2 }}
        >
          <Reveal>
            <Pill text="Testimoni" />
            <SectionHeading
              title="Apa Kata Mereka?"
              sub="Ribuan pengguna telah merasakan manfaat nyata bersama TemanTumbuh."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Ayla Putri",
                role: "Pelajar SMA, 16 tahun",
                quote:
                  "TemanTumbuh benar-benar membantu aku memahami perasaanku.",
                avatarColor: C.tealGhost,
              },
              {
                name: "Rizky Firmansyah",
                role: "Mahasiswa, 20 tahun",
                quote: "Brave Choice membantu aku buat keputusan lebih bijak.",
                avatarColor: "#FDF0CC",
              },
              {
                name: "Kasandra Daud",
                role: "Ibu, Bandung",
                quote:
                  "Sebagai orang tua, aku merasa tenang karena bisa memantau perkembangan anak tanpa mengganggu privasinya.",
                avatarColor: C.tealGhost,
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <TestiCard {...t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden py-20 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${C.GreenDeep} 0%, ${C.Green} 60%, ${C.GreenLight} 100%)`,
          paddingTop: 88,
        }}
      >
        <WaveTop fill={C.GreenDeep} />
        <FloatingBubbles bubbles={ctaBubbles} />

        <Reveal>
          <div
            className="relative mx-auto max-w-2xl px-6 text-center"
            style={{ zIndex: 2 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
              Siap Mulai Perjalananmu?
            </h2>

            <p
              className="mb-8 text-sm leading-relaxed md:text-base"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              Bergabunglah dengan pengguna TemanTumbuh dan mulai refleksi
              harianmu.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
              style={{
                background: C.white,
                color: C.Green,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              Mulai Diary Sekarang
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

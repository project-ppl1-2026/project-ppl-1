"use client";

// ============================================================
// src/components/layout/Footer.tsx
// Footer — animated bg circles, SVG social icons, logo
// ============================================================

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Colour tokens ────────────────────────────────────────────
const teal = "#1A9688";
const tealLight = "#4ECFC3";
const tealGhost = "#DDF5F2";
const footerBg = "#1C3848";
const footerMid = "#253F50";
const footerCard = "#2E4E62";
const textOnDark = "#EEF8FF";
const textSubOnDark = "#88C8D8";
const white = "#FFFFFF";

// ─── SVG Icons ────────────────────────────────────────────────
function IcInstagram() {
  return (
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
  );
}
function IcTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IcYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function IcMail() {
  return (
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
  );
}
function IcPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 3a1 1 0 011-1h2.5l1 3L5 6.5a9 9 0 004.5 4.5L11 9.5l3 1V13a1 1 0 01-1 1C6.5 14 2 9.5 2 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Animated background circles ──────────────────────────────
function FooterBg() {
  const circles = [
    {
      left: "88%",
      top: "10%",
      size: 320,
      dur: 11,
      delay: 0,
      ay: [0, -22, 8, 0],
      ax: [0, 12, 0],
      op: 0.12,
    },
    {
      left: "-5%",
      top: "60%",
      size: 260,
      dur: 9,
      delay: 2.5,
      ay: [0, 18, 0],
      ax: [0, 0, 0],
      op: 0.1,
    },
    {
      left: "45%",
      top: "40%",
      size: 160,
      dur: 14,
      delay: 4,
      ay: [0, 14, -8, 0],
      ax: [0, -10, 5, 0],
      op: 0.07,
    },
    {
      left: "70%",
      top: "75%",
      size: 90,
      dur: 7,
      delay: 1,
      ay: [0, -10, 0],
      ax: [0, 6, -3, 0],
      op: 0.09,
    },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          animate={{ y: c.ay, x: c.ax }}
          transition={{
            duration: c.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            marginLeft: -(c.size / 2),
            marginTop: -(c.size / 2),
            background: `radial-gradient(circle, ${tealGhost} 0%, transparent 68%)`,
            opacity: c.op,
          }}
        />
      ))}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${footerBg} 0%, ${footerMid} 100%)`,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <FooterBg />

      <div
        className="relative max-w-6xl mx-auto px-6 lg:px-8 py-14"
        style={{ zIndex: 1 }}
      >
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
              <span className="text-sm font-bold" style={{ color: textOnDark }}>
                TemanTumbuh
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: textSubOnDark }}
            >
              Platform refleksi diri dan kesadaran sosial untuk usia 10–29
              tahun. Tumbuh bersama, lebih aman.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:TemanTumbuh@gmail.com"
                className="text-sm flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: textSubOnDark }}
              >
                <IcMail /> TemanTumbuh@gmail.com
              </a>
              <a
                href="tel:+6281234567"
                className="text-sm flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: textSubOnDark }}
              >
                <IcPhone /> +62 8123-4567
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: tealLight }}
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
                    style={{ color: textSubOnDark }}
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
              style={{ color: tealLight }}
            >
              Ikuti Kami
            </p>
            <div className="flex gap-3 mb-6">
              {[
                { icon: <IcInstagram />, label: "Instagram" },
                { icon: <IcTwitter />, label: "Twitter/X" },
                { icon: <IcYouTube />, label: "YouTube" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="transition-all hover:opacity-80 hover:-translate-y-0.5"
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: footerCard,
                    color: tealLight,
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
              style={{ background: teal, color: white }}
            >
              Mulai Diary →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.42)",
          }}
        >
          TemanTumbuh © 2025. All rights reserved. · Proyek Perangkat Lunak I ·
          Kelompok Cegukan · Universitas Padjadjaran
        </div>
      </div>
    </footer>
  );
}

"use client";

// ============================================================
// src/components/layout/Navbar.tsx
//
// FIX 1: Nav items lengkap → Home(dropdown) · About Us · Fitur · Harga | Masuk · Daftar
// FIX 2: Smooth scroll ke section dengan animasi flow yang proper
//        — pakai router.push + scrollIntoView({ behavior: "smooth" })
//        — fallback hash jika sudah di halaman /
//
// 3 mode:
//   Guest  → Home(dropdown) · About Us · Fitur · Harga  |  Masuk · Daftar Gratis
//   User   → sama  |  Profile → Dashboard · Diary · Recommendation · Insight
//   Admin  → sama  |  Profile → Admins · Analytics · Audit Log · Reports · Users · Simulator
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";

import { authClient } from "@/lib/auth-client";

// ─── Colour tokens ────────────────────────────────────────────
const C = {
  teal: "#1A9688",
  tealMid: "#28B0A4",
  tealLight: "#4ECFC3",
  tealPale: "#A8E0DA",
  tealGhost: "#DDF5F2",
  tealDark: "#0F6B60",
  border: "#C8DCED",
  bg: "rgba(250,251,255,0.96)",
  textPrimary: "#1A2840",
  textSecondary: "#3A5068",
  textMuted: "#7090A8",
  dropDark: "#1C2B38",
  dropDarkBorder: "rgba(255,255,255,0.08)",
  dropDarkHover: "#374D60",
  dropText: "#E8F0F8",
  dropTextMuted: "#7A9BB8",
};

// ─── Types ────────────────────────────────────────────────────
type Role = "guest" | "user" | "admin";
interface Session {
  role: Role;
  name: string;
  email: string;
  image?: string | null;
}

const guestSession: Session = {
  role: "guest",
  name: "Guest",
  email: "",
  image: null,
};

// ─── Home dropdown sections (sesuai section di page.tsx) ──────
const homeSections = [
  {
    label: "Hero",
    sectionId: null, // top of page, tidak ada id
    href: "/",
    desc: "Kembali ke atas halaman",
  },
  {
    label: "Fitur",
    sectionId: "features", // id="features" di page.tsx
    href: "/#features",
    desc: "Semua fitur platform",
  },
  {
    label: "Tentang Kami",
    sectionId: "purpose", // id="purpose" di page.tsx
    href: "/#purpose",
    desc: "Tujuan & segmentasi usia",
  },
  {
    label: "Cara Kerja",
    sectionId: "how", // pastikan section di page.tsx punya id="how"
    href: "/#how",
    desc: "Bagaimana platform bekerja",
  },
  {
    label: "Testimoni",
    sectionId: "testi", // pastikan section di page.tsx punya id="testi"
    href: "/#testi",
    desc: "Kata pengguna kami",
  },
];

// ─── Top nav items (NON-dropdown) ─────────────────────────────
// Sesuai permintaan: Home · About Us · Fitur · Harga
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mainNavItems = [
  { label: "About Us", href: "./about", sectionId: "about" },
  { label: "Fitur", href: "/#features", sectionId: "features" },
  { label: "Harga", href: "/harga", sectionId: null },
];

function IcUserCircle() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M13.5 13.5c0-3-2.5-4.5-6-4.5s-6 1.5-6 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── User menu ────────────────────────────────────────────────
const userMenuItems = [
  { label: "Profile", href: "/profile", icon: <IcUserCircle /> },
  { label: "Dashboard", href: "/dashboard", icon: <IcGrid /> },
  { label: "Diary", href: "/diary", icon: <IcDiary /> },
  { label: "Recommendation", href: "/recommendation", icon: <IcStar /> },
  { label: "Insight", href: "/insight", icon: <IcChart /> },
];

// ─── Admin menu ───────────────────────────────────────────────
const adminMenuItems = [
  { label: "Admins", href: "/admin", icon: <IcShield /> },
  { label: "Analytics", href: "/admin/analytics", icon: <IcBarChart /> },
  { label: "Audit Log", href: "/admin/audit-log", icon: <IcList /> },
  { label: "Reports", href: "/admin/reports", icon: <IcDoc /> },
  { label: "Users", href: "/admin/users", icon: <IcUsers /> },
  { label: "Simulator", href: "/admin/simulator", icon: <IcBolt /> },
];

// ─── Smooth scroll helper ──────────────────────────────────────
// Kalau sudah di "/" → langsung scrollIntoView
// Kalau di halaman lain → navigate ke "/" dulu, lalu scroll setelah mount
function useSmoothScroll() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (sectionId: string | null, href: string) => {
      if (sectionId === null) {
        // Scroll ke top
        if (pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push("/");
        }
        return;
      }

      if (pathname === "/") {
        // Sudah di home — langsung scroll
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // Update hash tanpa reload
          window.history.pushState(null, "", `/#${sectionId}`);
        }
      } else {
        // Navigate ke "/" dengan hash, browser akan scroll setelah load
        router.push(href);
      }
    },
    [pathname, router],
  );
}

// ─── Icons ────────────────────────────────────────────────────
function IcGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1"
        y="1"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="8.5"
        y="1"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="1"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="8.5"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function IcDiary() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M4 2h7a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0111 14H4a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 014 2z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 6h5M5 8.5h5M5 11h3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IcStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 1.5l1.7 3.6 3.8.5-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8L2 5.6l3.8-.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 11l3-3.5 3 1.5 5-6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 1.5l6 2.5v4C13.5 11 10.5 13.5 7.5 14 4.5 13.5 1.5 11 1.5 8v-4l6-2.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M5 7.5l2 2 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcBarChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1.5"
        y="8"
        width="3"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="6"
        y="5"
        width="3"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="10.5"
        y="2"
        width="3"
        height="11"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
function IcList() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 4h11M2 7.5h11M2 11h7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IcDoc() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M4 1.5h5l3.5 3.5V13A1.5 1.5 0 0111 14.5H4A1.5 1.5 0 012.5 13V3A1.5 1.5 0 014 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M9 1.5V5H12.5M5 8h5M5 10.5h3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IcUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M10 6a2 2 0 100-4M11 9.5c1.5.5 3 1.8 3 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IcBolt() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M9 1.5L4 8.5h5.5L6 13.5l6-7H6.5L9 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10.5l3-3-3-3M13 7.5H6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcChevronDown({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path
        d="M2 4l3.5 3.5L9 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
function IcHome() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M1 6.5L6.5 1.5 12 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 5.2V11a.5.5 0 00.5.5h2.5V8h2v3.5H10a.5.5 0 00.5-.5V5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IcSection() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2 3.5h9M2 6.5h9M2 9.5h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Outside click hook ───────────────────────────────────────
function useOutsideClick(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cb]);
  return ref;
}

// ─── Animated nav link (with underline active indicator) ──────
function NavLink({
  label,
  isActive,
  onClick,
  href,
}: {
  label: string;
  isActive: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <motion.span
        className="text-sm font-medium"
        animate={
          { color: isActive ? C.teal : C.textSecondary } as TargetAndTransition
        }
        whileHover={{ color: C.teal } as TargetAndTransition}
        transition={{ duration: 0.16 }}
      >
        {label}
      </motion.span>
      {/* Active underline */}
      <motion.span
        className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
        style={{ background: C.teal, originX: 0.5 }}
        animate={
          {
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          } as TargetAndTransition
        }
        whileHover={{ scaleX: 1, opacity: 1 } as TargetAndTransition}
        transition={{ duration: 0.18 }}
      />
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative flex flex-col items-center pb-0.5 outline-none"
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={href!} className="relative flex flex-col items-center pb-0.5">
      {inner}
    </Link>
  );
}

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({
  name,
  image,
  size = 32,
}: {
  name: string;
  image?: string | null;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size < 30 ? 11 : 12,
        background: `linear-gradient(135deg, ${C.tealDark}, ${C.teal})`,
        color: "#fff",
      }}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── Home Section Dropdown ────────────────────────────────────
function HomeDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();

  useEffect(() => setOpen(false), [pathname]);

  const handleClick = (sectionId: string | null, href: string) => {
    setOpen(false);
    smoothScroll(sectionId, href);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex flex-col items-center gap-0.5 outline-none pb-0.5"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <motion.span
          className="text-sm font-medium flex items-center gap-1.5"
          animate={
            {
              color: isActive || open ? C.teal : C.textSecondary,
            } as TargetAndTransition
          }
          whileHover={{ color: C.teal } as TargetAndTransition}
          transition={{ duration: 0.16 }}
        >
          Home <IcChevronDown open={open} />
        </motion.span>
        <motion.span
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
          style={{ background: C.teal, originX: 0.5 }}
          animate={
            {
              scaleX: isActive || open ? 1 : 0,
              opacity: isActive || open ? 1 : 0,
            } as TargetAndTransition
          }
          whileHover={{ scaleX: 1, opacity: 1 } as TargetAndTransition}
          transition={{ duration: 0.18 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 mt-4 w-60 rounded-2xl overflow-hidden z-50"
            style={{
              background: "rgba(255,255,255,0.99)",
              border: `1.5px solid ${C.border}`,
              boxShadow:
                "0 20px 64px rgba(26,40,64,0.16), 0 4px 16px rgba(26,40,64,0.08)",
            }}
          >
            {/* Pointer arrow */}
            <div
              className="absolute -top-1.75 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
              style={{
                background: "white",
                borderTop: `1.5px solid ${C.border}`,
                borderLeft: `1.5px solid ${C.border}`,
              }}
            />

            {/* Top accent */}
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${C.tealDark}, ${C.teal}, ${C.tealLight})`,
              }}
            />

            {/* Items */}
            <div className="p-2">
              {homeSections.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleClick(item.sectionId, item.href)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: i * 0.045 }}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  whileHover={
                    { backgroundColor: C.tealGhost } as TargetAndTransition
                  }
                  style={{ background: "transparent" }}
                >
                  {/* Icon */}
                  <motion.span
                    className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
                    style={{ background: C.tealGhost, color: C.teal }}
                    whileHover={
                      {
                        scale: 1.1,
                        background: C.tealPale,
                      } as TargetAndTransition
                    }
                    transition={{ duration: 0.15 }}
                  >
                    {i === 0 ? <IcHome /> : <IcSection />}
                  </motion.span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <motion.p
                      className="text-[13px] font-semibold"
                      style={{ color: C.textPrimary }}
                      whileHover={{ color: C.teal } as TargetAndTransition}
                      transition={{ duration: 0.13 }}
                    >
                      {item.label}
                    </motion.p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: C.textMuted }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <motion.span
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    style={{ color: C.teal }}
                    initial={{ x: -4, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 } as TargetAndTransition}
                    transition={{ duration: 0.15 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6h7M6.5 3l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                </motion.button>
              ))}
            </div>

            {/* Footer hint */}
            <div
              className="px-4 py-2.5 flex items-center gap-1.5"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <span className="text-[10px]" style={{ color: C.textMuted }}>
                Klik untuk scroll langsung ke section
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Profile dropdown (dark card) ────────────────────────────
function ProfileDropdown({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const pathname = usePathname();
  const items = session.role === "admin" ? adminMenuItems : userMenuItems;
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-xl px-3 py-2 outline-none transition-all"
        style={{
          background: open ? C.tealGhost : "transparent",
          border: `1.5px solid ${open ? C.tealPale : C.border}`,
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar name={session.name} image={session.image} size={26} />
        <span
          className="text-sm font-semibold hidden sm:block max-w-25 truncate"
          style={{ color: C.textPrimary }}
        >
          {session.name}
        </span>
        <IcChevronDown open={open} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 w-52 rounded-2xl overflow-hidden z-50"
            style={{
              background: C.dropDark,
              border: `1px solid ${C.dropDarkBorder}`,
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="px-4 py-3.5 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${C.dropDarkBorder}` }}
            >
              <Avatar name={session.name} image={session.image} size={34} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-semibold truncate"
                  style={{ color: C.dropText }}
                >
                  {session.name}
                </p>
                <p
                  className="text-[11px] truncate"
                  style={{ color: C.dropTextMuted }}
                >
                  {session.role === "admin" ? "Administrator" : "Pengguna"}
                </p>
              </div>
            </div>

            <div className="p-2">
              {items.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.14, delay: i * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        color: isActive ? C.tealLight : C.dropText,
                        background: isActive
                          ? "rgba(78,207,195,0.12)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            C.dropDarkHover;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                      }}
                    >
                      <span
                        className="shrink-0"
                        style={{
                          color: isActive ? C.tealLight : C.dropTextMuted,
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                      {isActive && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ background: C.tealLight }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div
              className="p-2"
              style={{ borderTop: `1px solid ${C.dropDarkBorder}` }}
            >
              <button
                onClick={async () => {
                  setOpen(false);
                  await authClient.signOut();
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: "#F87171" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <IcLogout /> Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile menu ──────────────────────────────────────────────
function MobileMenu({
  open,
  session,
  onClose,
}: {
  open: boolean;
  session: Session;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();
  const isLoggedIn = session.role !== "guest";
  const items = session.role === "admin" ? adminMenuItems : userMenuItems;

  const handleSectionClick = (sectionId: string | null, href: string) => {
    onClose();
    setTimeout(() => smoothScroll(sectionId, href), 150); // kecil delay biar menu tutup dulu
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t md:hidden"
          style={{ borderColor: C.border }}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {/* Halaman section */}
            <p
              className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
              style={{ color: C.textMuted }}
            >
              Halaman
            </p>

            {homeSections.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => handleSectionClick(item.sectionId, item.href)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, delay: i * 0.04 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                style={{ color: C.textSecondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.tealGhost)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg"
                  style={{ background: C.tealGhost, color: C.teal }}
                >
                  {i === 0 ? <IcHome /> : <IcSection />}
                </span>
                {item.label}
              </motion.button>
            ))}

            <div className="my-2 h-px" style={{ background: C.border }} />

            {/* Harga */}
            <Link
              href="/harga"
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{
                color: pathname === "/harga" ? C.teal : C.textSecondary,
                background: pathname === "/harga" ? C.tealGhost : "transparent",
              }}
            >
              Harga
            </Link>

            <div className="my-2 h-px" style={{ background: C.border }} />

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex h-11 items-center justify-center rounded-xl text-sm font-semibold"
                  style={{ border: `1.5px solid ${C.border}`, color: C.teal }}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: C.teal,
                    boxShadow: "0 2px 12px rgba(26,150,136,0.28)",
                  }}
                >
                  Daftar Gratis
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                  <Avatar name={session.name} image={session.image} size={32} />
                  <div>
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: C.textPrimary }}
                    >
                      {session.name}
                    </p>
                    <p className="text-[11px]" style={{ color: C.textMuted }}>
                      {session.role === "admin" ? "Administrator" : "Pengguna"}
                    </p>
                  </div>
                </div>
                {items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                      style={{
                        color: active ? C.teal : C.textSecondary,
                        background: active ? C.tealGhost : "transparent",
                      }}
                    >
                      <span style={{ color: active ? C.teal : C.textMuted }}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={async () => {
                    onClose();
                    await authClient.signOut();
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-1"
                  style={{ color: "#EF4444" }}
                >
                  <IcLogout /> Keluar
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────
function IcHamburger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <motion.line
        x1="3"
        y1="6"
        x2="19"
        y2="6"
        stroke={C.textPrimary}
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={
          {
            x1: open ? 4 : 3,
            y1: open ? 4 : 6,
            x2: open ? 18 : 19,
            y2: open ? 18 : 6,
          } as TargetAndTransition
        }
        transition={{ duration: 0.22 }}
      />
      <motion.line
        x1="3"
        y1="11"
        x2="19"
        y2="11"
        stroke={C.textPrimary}
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={{ opacity: open ? 0 : 1 } as TargetAndTransition}
        transition={{ duration: 0.15 }}
      />
      <motion.line
        x1="3"
        y1="16"
        x2="19"
        y2="16"
        stroke={C.textPrimary}
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={
          {
            x1: open ? 4 : 3,
            y1: open ? 18 : 16,
            x2: open ? 18 : 19,
            y2: open ? 4 : 16,
          } as TargetAndTransition
        }
        transition={{ duration: 0.22 }}
      />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════
// NAVBAR
// ════════════════════════════════════════════════════════════
export function Navbar() {
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session>(guestSession);
  const isLoggedIn = session.role !== "guest";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Loads the current Better Auth session so navbar can switch between guest and profile states.
  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!mounted) {
          return;
        }

        if (!data?.user) {
          setSession(guestSession);
          return;
        }

        let userImage = data.user.image;
        if (!userImage) {
          // Fallback: trigger API profil untuk ekstrak image (Google OAuth fallback)
          try {
            const profileRes = await fetch("/api/profile/me");
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              if (profileData.image) {
                userImage = profileData.image;
              }
            }
          } catch (e) {
            console.error("Gagal mendapatkan gambar profil up-to-date", e);
          }
        }

        setSession({
          role: "user",
          name: data.user.name,
          email: data.user.email,
          image: userImage,
        });
      } catch (error) {
        console.error("Navbar session error:", error);
        if (mounted) {
          setSession(guestSession);
        }
      }
    };

    void syncSession();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const isHome = pathname === "/";
  const isHarga = pathname === "/harga";

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50"
      style={{
        background: C.bg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        fontFamily: "var(--font-plus-jakarta, sans-serif)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/img/LOGO_TEMANTUMBUH.svg"
            alt="TemanTumbuh"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-sm font-bold" style={{ color: C.textPrimary }}>
            TemanTumbuh
          </span>
        </Link>

        {/* Desktop nav: Home · About Us · Fitur · Harga */}
        <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {/* Home — dropdown per section */}
          <HomeDropdown isActive={isHome} />

          {/* About Us → scroll ke #purpose */}
          <NavLink
            label="About Us"
            isActive={false}
            onClick={() => smoothScroll("about", "/(main)/about")}
          />

          {/* Fitur → scroll ke #features */}
          <NavLink
            label="Fitur"
            isActive={false}
            onClick={() => smoothScroll("features", "/#features")}
          />

          {/* Harga — halaman sendiri */}
          <NavLink label="Harga" isActive={isHarga} href="/harga" />
        </nav>

        {/* Desktop right: Login · Register atau Profile */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="relative inline-flex text-sm font-semibold px-4 py-2 rounded-xl overflow-hidden"
                style={{ color: C.teal }}
              >
                <motion.span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: C.tealGhost }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.16 }}
                />
                <span className="relative">Masuk</span>
              </Link>
              <Link
                href="/register"
                className="relative inline-flex text-sm font-semibold px-4 py-2.5 rounded-xl text-white overflow-hidden active:scale-[0.97] transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 60%, ${C.tealMid} 100%)`,
                  boxShadow: "0 2px 14px rgba(26,150,136,0.32)",
                }}
              >
                <motion.span
                  className="absolute inset-0 rounded-xl"
                  initial={{ background: "rgba(255,255,255,0)" }}
                  whileHover={{ background: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.16 }}
                />
                <span className="relative">Daftar Gratis</span>
              </Link>
            </>
          ) : (
            <ProfileDropdown session={session} />
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <IcHamburger open={mobileOpen} />
        </button>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileOpen}
        session={session}
        onClose={() => setMobileOpen(false)}
      />
    </motion.header>
  );
}

export default Navbar;

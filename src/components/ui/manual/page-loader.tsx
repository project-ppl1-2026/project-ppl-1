// src/components/ui/page-loader.tsx
// Global page loading overlay — bisa dipakai di mana saja
// Usage:
//   import { PageLoader } from "@/components/ui/page-loader"
//   if (isLoading) return <PageLoader message="Memeriksa sesi..." />

"use client";

import { motion } from "framer-motion";

interface PageLoaderProps {
  /** Pesan yang ditampilkan di bawah spinner */
  message?: string;
  /** Kalau true, overlay penuh (fixed). Default: false (fill parent) */
  fullscreen?: boolean;
}

export function PageLoader({
  message = "Memuat...",
  fullscreen = false,
}: PageLoaderProps) {
  const Wrapper = fullscreen ? FullscreenWrapper : InlineWrapper;
  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <TealSpinner />
        {message && (
          <p
            className="text-sm"
            style={{ color: "var(--color-text-brand-muted)" }}
          >
            {message}
          </p>
        )}
      </motion.div>
    </Wrapper>
  );
}

// ─── Wrappers ─────────────────────────────────────────
function InlineWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[calc(100vh-128px)] items-center justify-center"
      style={{ background: "var(--color-page-bg0, #FAFBFF)" }}
    >
      {children}
    </div>
  );
}

function FullscreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-page-bg0, #FAFBFF)" }}
    >
      {children}
    </div>
  );
}

// ─── Spinner pakai warna brand ────────────────────────
function TealSpinner() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className="animate-spin"
      style={{ animationDuration: "0.8s" }}
    >
      <circle
        cx="18"
        cy="18"
        r="15"
        stroke="var(--color-brand-teal-ghost, #DDF5F2)"
        strokeWidth="3"
      />
      <path
        d="M18 3a15 15 0 0115 15"
        stroke="var(--color-brand-teal, #1A9688)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Suspense fallback siap pakai ─────────────────────
export function PageLoaderFallback() {
  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-[#FAFBFF]">
      <TealSpinner />
    </div>
  );
}

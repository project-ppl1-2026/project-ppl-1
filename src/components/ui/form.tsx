// src/components/ui/form.tsx
// Reusable form primitives — Field, TextInput, SelectInput, SubmitBtn
// Pakai CSS variables dari global.css bukan hardcoded hex

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Field wrapper ────────────────────────────────────
export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold"
        style={{ color: "var(--color-text-brand-primary)" }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p
          className="text-[11px]"
          style={{ color: "var(--color-text-brand-muted)" }}
        >
          {hint}
        </p>
      )}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-red-500"
          >
            <ErrorCircleIcon /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────
export function TextInput({
  hasError,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150",
        "border-[1.5px] focus:ring-2",
        hasError
          ? "border-red-400 focus:ring-red-400/20"
          : "border-[--color-brand-border] hover:border-[--color-brand-teal-pale] focus:border-[--color-brand-teal] focus:ring-[--color-brand-teal]/15",
        className,
      )}
      style={{
        background: "var(--color-background, #fff)",
        color: "var(--color-text-brand-primary)",
      }}
      {...props}
    />
  );
}

// ─── Select Input ─────────────────────────────────────
export function SelectInput({
  hasError,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      className={cn(
        "w-full cursor-pointer appearance-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150",
        "border-[1.5px] focus:ring-2",
        hasError
          ? "border-red-400 focus:ring-red-400/20"
          : "border-[--color-brand-border] hover:border-[--color-brand-teal-pale] focus:border-[--color-brand-teal] focus:ring-[--color-brand-teal]/15",
        className,
      )}
      style={{
        background: "var(--color-background, #fff)",
        color: "var(--color-text-brand-primary)",
      }}
      {...props}
    />
  );
}

// ─── Submit Button ────────────────────────────────────
export function SubmitBtn({
  isLoading,
  label,
  loadingLabel,
  className,
}: {
  isLoading: boolean;
  label: React.ReactNode;
  loadingLabel: string;
  className?: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={isLoading ? {} : { scale: 1.01 }}
      whileTap={isLoading ? {} : { scale: 0.98 }}
      className={cn(
        "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white",
        "disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      style={{
        background: "var(--gradient-brand-btn)",
        boxShadow: isLoading ? "none" : "0 4px 18px rgba(26,150,136,0.28)",
      }}
    >
      {isLoading ? (
        <>
          <SpinnerIcon />
          <span>{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}

// ─── Back Button ─────────────────────────────────────
export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
      style={{
        border: "1.5px solid var(--color-brand-border)",
        color: "var(--color-text-brand-secondary)",
      }}
    >
      <ArrowLeftIcon /> Kembali
    </button>
  );
}

// ─── Info Banner ─────────────────────────────────────
export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[12px]"
      style={{
        background: "var(--color-brand-teal-ghost)",
        borderColor: "var(--color-brand-teal-pale)",
        color: "var(--color-brand-teal)",
      }}
    >
      <span className="mt-0.5 shrink-0">
        <InfoIcon />
      </span>
      <span style={{ color: "var(--color-text-brand-secondary)" }}>
        {children}
      </span>
    </div>
  );
}

// ─── Micro icons (hanya yang dipakai di form) ─────────
function SpinnerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      <path
        d="M9 2a7 7 0 017 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
      <path
        d="M6 4v2.5M6 8h.01"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11 7H3M7 3L3 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4M8 5.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

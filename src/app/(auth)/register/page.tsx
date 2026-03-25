"use client";

// ============================================================
// src/app/(auth)/register/page.tsx — TemanTumbuh Register
// Multi-step: 1) Akun  2) Data Diri  3) Opsional (email ortu)
// Google OAuth support
// TODO Backend: hubungkan setiap step ke API
//
// FIXES dari error TS:
// - Blob `animate` prop: `object` → `TargetAndTransition` (framer-motion)
// - z.enum errorMap → `error` (Zod v4 API)
// ============================================================

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Color system ─────────────────────────────────────────────
const C = {
  teal: "#1A9688",
  tealMid: "#28B0A4",
  tealLight: "#4ECFC3",
  tealPale: "#A8E0DA",
  tealGhost: "#DDF5F2",
  tealDark: "#0F6B60",
  bg0: "#FAFBFF",
  bg1: "#EEF4FB",
  howBg: "#E0F5F0",
  coralPale: "#FDE8DC",
  goldPale: "#FDF0CC",
  border: "#C8DCED",
  white: "#FFFFFF",
  textPrimary: "#1A2840",
  textSecondary: "#3A5068",
  textMuted: "#7090A8",
  errorRed: "#EF4444",
  successGreen: "#166534",
};

// ─── Validation schemas — Zod v4 compatible ───────────────────
const step1Schema = z
  .object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Password tidak cocok",
    path: ["confirm"],
  });

const step2Schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, "Tahun tidak valid")
    .refine((y) => {
      const yr = parseInt(y, 10);
      const now = new Date().getFullYear();
      return yr >= now - 29 && yr <= now - 10;
    }, "Usia harus antara 10–29 tahun"),
  // FIX: Zod v4 — gunakan `error` bukan `errorMap`
  gender: z.enum(["male", "female", "prefer_not"] as const, {
    error: "Pilih salah satu",
  }),
});

const step3Schema = z.object({
  parentEmail: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Format email tidak valid",
    }),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

// ─── Animated blob ────────────────────────────────────────────
// FIX: `animate` typed as `TargetAndTransition` bukan `object`
function Blob({
  w,
  h,
  color,
  style,
  animate,
  duration,
  delay,
}: {
  w: number;
  h: number;
  color: string;
  style?: React.CSSProperties;
  animate: TargetAndTransition; // ← FIX
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      animate={animate}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay ?? 0,
      }}
      style={{
        position: "absolute",
        width: w,
        height: h,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

// ─── SVG Icons ────────────────────────────────────────────────
const Ic = {
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2l12 12M6.5 6.6A2 2 0 0010 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.2 4.3C2.6 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.7-1M6.4 3.1C6.9 3 7.5 3 8 3c4.5 0 7 5 7 5s-.6 1.2-1.7 2.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Spinner: () => (
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
  ),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle
        cx="24"
        cy="24"
        r="20"
        fill={C.tealGhost}
        stroke={C.tealPale}
        strokeWidth="1.5"
      />
      <path
        d="M15 24l6 6 12-12"
        stroke={C.teal}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ErrorCircle: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
      <path
        d="M6 4v2.5M6 8h.01"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  ArrowRight: () => (
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
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11 7H3M7 3L3 7l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Parent: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13 10c2 0 4.5 1.5 4.5 4.5V17h-15v-2.5C2.5 11.5 5 10 7 10"
        stroke={C.teal}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6" r="3" stroke={C.teal} strokeWidth="1.5" />
      <path
        d="M15 6a2 2 0 100-4M5 6a2 2 0 110-4"
        stroke={C.teal}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4M8 5.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Field wrapper ────────────────────────────────────────────
function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold"
        style={{ color: C.textPrimary }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px]" style={{ color: C.textMuted }}>
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
            className="flex items-center gap-1.5 text-xs"
            style={{ color: C.errorRed }}
          >
            <Ic.ErrorCircle /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────
function TextInput({
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
          : "border-[#C8DCED] hover:border-[#A8E0DA] focus:border-[#1A9688] focus:ring-[#1A9688]/15",
        className,
      )}
      style={{ background: C.white, color: C.textPrimary }}
      {...props}
    />
  );
}

// ─── Select Input ─────────────────────────────────────────────
function SelectInput({
  hasError,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      className={cn(
        "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150 appearance-none cursor-pointer",
        "border-[1.5px] focus:ring-2",
        hasError
          ? "border-red-400 focus:ring-red-400/20"
          : "border-[#C8DCED] hover:border-[#A8E0DA] focus:border-[#1A9688] focus:ring-[#1A9688]/15",
        className,
      )}
      style={{ background: C.white, color: C.textPrimary }}
      {...props}
    />
  );
}

// ─── Submit button (shared) ───────────────────────────────────
function SubmitBtn({
  isLoading,
  label,
  loadingLabel,
}: {
  isLoading: boolean;
  label: React.ReactNode;
  loadingLabel: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={isLoading ? {} : { scale: 1.01 }}
      whileTap={isLoading ? {} : { scale: 0.98 }}
      className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      style={{
        background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 60%, ${C.tealMid} 100%)`,
        boxShadow: isLoading ? "none" : `0 4px 18px rgba(26,150,136,0.28)`,
      }}
    >
      {isLoading ? (
        <>
          <Ic.Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}

// ─── Step indicator ───────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Akun", "Data Diri", "Laporan"];
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: isDone ? C.teal : isActive ? C.white : C.bg1,
                  borderColor: isDone || isActive ? C.teal : C.border,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold"
                style={{
                  color: isDone ? C.white : isActive ? C.teal : C.textMuted,
                }}
              >
                {isDone ? <Ic.Check /> : <span>{i + 1}</span>}
              </motion.div>
              <span
                className="mt-1.5 text-[10px] font-medium"
                style={{ color: isActive ? C.teal : C.textMuted }}
              >
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className="w-12 h-[2px] mb-4 mx-1 transition-colors duration-300"
                style={{ background: i < current ? C.teal : C.border }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Akun ─────────────────────────────────────────────
function Step1Form({
  onNext,
  onGoogle,
  defaultValues,
}: {
  onNext: (data: Step1) => void;
  onGoogle: () => void;
  defaultValues: Partial<Step1>;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold mb-1" style={{ color: C.textPrimary }}>
          Buat Akun
        </h2>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Mulai dengan email atau Google
        </p>
      </div>

      {/* Google OAuth */}
      <motion.button
        type="button"
        onClick={onGoogle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition-all"
        style={{
          border: `1.5px solid ${C.border}`,
          color: C.textPrimary,
          background: C.white,
        }}
      >
        <Ic.Google /> Daftar dengan Google
      </motion.button>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: C.border }} />
        <span className="text-xs" style={{ color: C.textMuted }}>
          atau dengan email
        </span>
        <div className="h-px flex-1" style={{ background: C.border }} />
      </div>

      <form
        onSubmit={handleSubmit(onNext)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Field id="reg-email" label="Email" error={errors.email?.message}>
          <TextInput
            id="reg-email"
            type="email"
            placeholder="email@contoh.com"
            autoComplete="email"
            autoFocus
            hasError={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field
          id="reg-password"
          label="Password"
          error={errors.password?.message}
          hint="Minimal 8 karakter"
        >
          <div className="relative">
            <TextInput
              id="reg-password"
              type={showPw ? "text" : "password"}
              placeholder="Buat password"
              autoComplete="new-password"
              hasError={!!errors.password}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: C.textMuted }}
              aria-label="Toggle password"
            >
              {showPw ? <Ic.EyeOff /> : <Ic.Eye />}
            </button>
          </div>
        </Field>

        <Field
          id="reg-confirm"
          label="Konfirmasi Password"
          error={errors.confirm?.message}
        >
          <div className="relative">
            <TextInput
              id="reg-confirm"
              type={showCf ? "text" : "password"}
              placeholder="Ulangi password"
              autoComplete="new-password"
              hasError={!!errors.confirm}
              className="pr-11"
              {...register("confirm")}
            />
            <button
              type="button"
              onClick={() => setShowCf((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: C.textMuted }}
              aria-label="Toggle confirm"
            >
              {showCf ? <Ic.EyeOff /> : <Ic.Eye />}
            </button>
          </div>
        </Field>

        <div className="mt-2 flex gap-3">
          <SubmitBtn
            isLoading={isSubmitting}
            label={
              <span className="flex items-center gap-2">
                Lanjut <Ic.ArrowRight />
              </span>
            }
            loadingLabel="Memproses..."
          />
        </div>
      </form>
    </motion.div>
  );
}

// ─── Step 2: Data Diri ────────────────────────────────────────
function Step2Form({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: Step2) => void;
  onBack: () => void;
  defaultValues: Partial<Step2>;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 - i);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold mb-1" style={{ color: C.textPrimary }}>
          Data Diri
        </h2>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Kami sesuaikan pengalaman untukmu
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onNext)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Field id="reg-name" label="Nama Lengkap" error={errors.name?.message}>
          <TextInput
            id="reg-name"
            type="text"
            placeholder="Nama kamu"
            autoComplete="name"
            autoFocus
            hasError={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field
          id="reg-birthYear"
          label="Tahun Lahir"
          error={errors.birthYear?.message}
          hint="Usia 10–29 tahun"
        >
          <SelectInput
            id="reg-birthYear"
            hasError={!!errors.birthYear}
            {...register("birthYear")}
          >
            <option value="">Pilih tahun lahir</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field
          id="reg-gender"
          label="Jenis Kelamin"
          error={errors.gender?.message}
        >
          <SelectInput
            id="reg-gender"
            hasError={!!errors.gender}
            {...register("gender")}
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
            <option value="prefer_not">Tidak ingin menyebutkan</option>
          </SelectInput>
        </Field>

        {/* Privacy note */}
        <div
          className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[12px]"
          style={{
            background: C.tealGhost,
            borderColor: C.tealPale,
            color: C.teal,
          }}
        >
          <span className="mt-0.5 flex-shrink-0">
            <Ic.Info />
          </span>
          <span>
            Data ini hanya digunakan untuk menyesuaikan konten sesuai usiamu dan
            tidak akan dibagikan kepada pihak ketiga.
          </span>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              border: `1.5px solid ${C.border}`,
              color: C.textSecondary,
            }}
          >
            <Ic.ArrowLeft /> Kembali
          </button>
          <SubmitBtn
            isLoading={isSubmitting}
            label={
              <span className="flex items-center gap-2">
                Lanjut <Ic.ArrowRight />
              </span>
            }
            loadingLabel="Memproses..."
          />
        </div>
      </form>
    </motion.div>
  );
}

// ─── Step 3: Email Orang Tua (Opsional) ───────────────────────
function Step3Form({
  onSubmit: onFinalSubmit,
  onBack,
  defaultValues,
  isLoading,
}: {
  onSubmit: (data: Step3) => void;
  onBack: () => void;
  defaultValues: Partial<Step3>;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues,
  });

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold mb-1" style={{ color: C.textPrimary }}>
          Laporan Mingguan
        </h2>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Opsional — bisa dilewati kapan saja
        </p>
      </div>

      {/* Info card */}
      <div
        className="mb-6 rounded-xl border p-4"
        style={{ background: C.tealGhost, borderColor: C.tealPale }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Ic.Parent />
          <span
            className="text-sm font-semibold"
            style={{ color: C.textPrimary }}
          >
            Laporan untuk Orang Tua / Wali
          </span>
        </div>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: C.textSecondary }}
        >
          Orang tua atau wali akan menerima ringkasan tren emosi mingguanmu.
          Laporan ini <strong>tidak mengandung</strong> isi diary — hanya
          insight umum.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onFinalSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Field
          id="reg-parentEmail"
          label="Email Orang Tua / Wali (Opsional)"
          error={errors.parentEmail?.message}
          hint="Kosongkan jika tidak ingin mengirim laporan"
        >
          <TextInput
            id="reg-parentEmail"
            type="email"
            placeholder="email-orangtua@contoh.com"
            autoComplete="off"
            hasError={!!errors.parentEmail}
            {...register("parentEmail")}
          />
        </Field>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              border: `1.5px solid ${C.border}`,
              color: C.textSecondary,
            }}
          >
            <Ic.ArrowLeft /> Kembali
          </button>
          <SubmitBtn
            isLoading={isLoading}
            label={
              <span className="flex items-center gap-2">
                Selesai &amp; Daftar <Ic.ArrowRight />
              </span>
            }
            loadingLabel="Mendaftar..."
          />
        </div>

        <p className="text-center text-[11px]" style={{ color: C.textMuted }}>
          Email orang tua bisa ditambahkan nanti melalui pengaturan akun.
        </p>
      </form>
    </motion.div>
  );
}

// ─── Success screen ───────────────────────────────────────────
function SuccessScreen({ name }: { name: string }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-5"
      >
        <Ic.CheckCircle />
      </motion.div>
      <h2 className="text-xl font-bold mb-2" style={{ color: C.textPrimary }}>
        Selamat Datang, {name || "Teman"}!
      </h2>
      <p
        className="text-sm leading-relaxed mb-8 max-w-xs"
        style={{ color: C.textMuted }}
      >
        Akunmu berhasil dibuat. Kamu siap memulai perjalanan tumbuh bersama
        TemanTumbuh.
      </p>
      <Link
        href="/dashboard"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white transition-all hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 60%, ${C.tealMid} 100%)`,
          boxShadow: `0 4px 18px rgba(26,150,136,0.28)`,
        }}
      >
        Mulai Sekarang <Ic.ArrowRight />
      </Link>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// REGISTER PAGE
// ════════════════════════════════════════════════════════════
export default function RegisterPage() {
  const shouldReduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Partial<Step1>>({});
  const [step2Data, setStep2Data] = useState<Partial<Step2>>({});

  const handleStep1 = useCallback((data: Step1) => {
    setStep1Data(data);
    setStep(1);
  }, []);

  const handleStep2 = useCallback((data: Step2) => {
    setStep2Data(data);
    setStep(2);
  }, []);

  // TODO BE: ganti dengan API call ke /api/auth/register
  // Contoh:
  //   const res = await fetch("/api/auth/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ ...step1Data, ...step2Data, ...data }),
  //   });
  //   if (!res.ok) { const { error } = await res.json(); toast.error(error); return; }
  //   router.push("/dashboard");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFinalSubmit = useCallback(async (_data: Step3) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
    toast.success("Akun berhasil dibuat! (mode demo)");
  }, []);

  const handleGoogle = useCallback(() => {
    // TODO BE: implement Google OAuth (next-auth atau custom)
    toast.info("Google OAuth belum terhubung.");
  }, []);

  return (
    <div
      className="relative min-h-[calc(100vh-128px)] overflow-hidden flex items-center justify-center px-4 py-16"
      style={{
        background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 55%, ${C.howBg} 100%)`,
      }}
    >
      {/* Animated background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Blob
          w={480}
          h={480}
          color={C.tealGhost}
          style={{ top: -100, right: -100 }}
          duration={16}
          animate={{ y: [0, 36, 0], x: [0, -24, 0] }}
        />
        <Blob
          w={300}
          h={300}
          color={C.coralPale}
          style={{ bottom: -80, left: -60 }}
          duration={12}
          delay={2}
          animate={{ y: [0, -26, 0], x: [0, 18, 0] }}
        />
        <Blob
          w={180}
          h={180}
          color={C.tealPale}
          style={{ top: "35%", left: "25%" }}
          duration={9}
          delay={4}
          animate={{ scale: [1, 1.18, 1], y: [0, -18, 0] }}
        />
        <Blob
          w={110}
          h={110}
          color={C.goldPale}
          style={{ top: "15%", left: "60%" }}
          duration={7}
          delay={1}
          animate={{ y: [0, 16, -8, 0], x: [0, -10, 0] }}
        />
        <Blob
          w={150}
          h={150}
          color={C.tealGhost}
          style={{ bottom: "20%", right: "18%" }}
          duration={11}
          delay={3}
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: 460,
          background: C.white,
          border: `1.5px solid ${C.border}`,
          boxShadow:
            "0 20px 60px rgba(26,40,64,0.11), 0 4px 16px rgba(26,40,64,0.07)",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${C.tealDark}, ${C.teal}, ${C.tealLight})`,
          }}
        />

        <div className="px-8 pt-8 pb-8 sm:px-10 sm:pt-10 sm:pb-10">
          {/* Logo */}
          {!done && (
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex justify-center mb-6"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: C.tealGhost,
                  border: `1.5px solid ${C.tealPale}`,
                }}
              >
                <Image
                  src="/img/LOGO_TEMANTUMBUH.svg"
                  alt="TemanTumbuh"
                  width={24}
                  height={24}
                />
              </div>
            </motion.div>
          )}

          {/* Step indicator */}
          {!done && <StepIndicator current={step} total={3} />}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {done ? (
              <SuccessScreen key="done" name={step2Data.name ?? ""} />
            ) : step === 0 ? (
              <Step1Form
                key="s1"
                onNext={handleStep1}
                onGoogle={handleGoogle}
                defaultValues={step1Data}
              />
            ) : step === 1 ? (
              <Step2Form
                key="s2"
                onNext={handleStep2}
                onBack={() => setStep(0)}
                defaultValues={step2Data}
              />
            ) : (
              <Step3Form
                key="s3"
                onSubmit={handleFinalSubmit}
                onBack={() => setStep(1)}
                defaultValues={{}}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>

          {/* Login link */}
          {!done && (
            <p
              className="mt-6 text-center text-sm"
              style={{ color: C.textMuted }}
            >
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: C.teal }}
              >
                Masuk
              </Link>
            </p>
          )}
        </div>

        {/* ToS */}
        {!done && (
          <div
            className="px-8 pb-6 text-center text-[11px] sm:px-10"
            style={{
              color: C.textMuted,
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
            }}
          >
            Dengan mendaftar, kamu menyetujui{" "}
            <Link
              href="/terms"
              className="underline-offset-2 hover:underline"
              style={{ color: C.textSecondary }}
            >
              Syarat &amp; Ketentuan
            </Link>{" "}
            dan{" "}
            <Link
              href="/privacy"
              className="underline-offset-2 hover:underline"
              style={{ color: C.textSecondary }}
            >
              Kebijakan Privasi
            </Link>
            .
          </div>
        )}
      </motion.div>
    </div>
  );
}

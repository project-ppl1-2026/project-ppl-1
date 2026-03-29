"use client";

// ============================================================
// src/app/(auth)/login/page.tsx — TemanTumbuh Login (v3)
// Design: satu kartu terpusat, bersih, elegant, sesuai segmen 10-29 thn
// Tidak ada data dummy / stats fiktif
// TODO Backend: ganti onSubmit dengan API call ke /api/auth/login
//
// FIX: Blob `animate` prop typed as `TargetAndTransition` (framer-motion)
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validations";
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5v3.5M8 10.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
};

// ─── Field wrapper ────────────────────────────────────────────
function Field({
  id,
  label,
  error,
  children,
  rightLabel,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  rightLabel?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[13px] font-semibold"
          style={{ color: C.textPrimary }}
        >
          {label}
        </label>
        {rightLabel}
      </div>
      {children}
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
            <Ic.ErrorCircle />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────
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

// ─── Alert banner ─────────────────────────────────────────────
function Alert({
  type,
  children,
  onClose,
}: {
  type: "info" | "success" | "error";
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const s = {
    info: {
      bg: C.tealGhost,
      border: C.tealPale,
      text: C.teal,
      icon: <Ic.Info />,
    },
    success: {
      bg: "#ECFDF5",
      border: "#BBF7D0",
      text: C.successGreen,
      icon: <Ic.Check />,
    },
    error: {
      bg: "#FEF2F2",
      border: "#FECACA",
      text: "#B91C1C",
      icon: <Ic.AlertCircle />,
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px]"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <span className="flex-1">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="transition-opacity hover:opacity-60"
          aria-label="Tutup"
        >
          <Ic.Close />
        </button>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoSuccess, setIsDemoSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const shouldReduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Redirects authenticated users to the data completion step after login.
  useEffect(() => {
    let mounted = true;

    const getProfileStatus = async () => {
      const response = await fetch("/api/profile/status", {
        method: "GET",
        cache: "no-store",
      });
      return (await response.json()) as {
        isAuthenticated: boolean;
        isComplete: boolean;
      };
    };

    const checkSession = async () => {
      try {
        const status = await getProfileStatus();
        if (mounted && status.isAuthenticated) {
          router.replace(
            status.isComplete ? "/" : "/register?completeProfile=1",
          );
          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        if (mounted) {
          setIsPageLoading(false);
        }
      }
    };

    void checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Signs in with email and redirects to the data completion step.
  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    setIsDemoSuccess(false);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/register?completeProfile=1",
      });

      if (response.error) {
        setServerError(
          response.error.message ?? "Email atau password tidak valid.",
        );
        return;
      }

      const statusResponse = await fetch("/api/profile/status", {
        method: "GET",
        cache: "no-store",
      });
      const status = (await statusResponse.json()) as {
        isAuthenticated: boolean;
        isComplete: boolean;
      };

      toast.success("Login berhasil.");
      reset();
      router.replace(status.isComplete ? "/" : "/register?completeProfile=1");
    } catch (error) {
      setServerError("Gagal login. Silakan coba lagi.");
      console.error("Email login error:", error);
    }
  };

  // Starts the Better Auth Google flow from the login page button.
  const handleGoogleLogin = async () => {
    setServerError("");
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/register?completeProfile=1",
      });
    } catch (error) {
      setServerError("Gagal memulai login Google. Silakan coba lagi.");
      toast.error("Google sign-in gagal dimulai.");
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div
        className="min-h-[calc(100vh-128px)] flex items-center justify-center"
        style={{ background: C.bg0 }}
      >
        <p className="text-sm" style={{ color: C.textMuted }}>
          Memeriksa sesi...
        </p>
      </div>
    );
  }

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
          w={320}
          h={320}
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
          style={{ top: "40%", left: "30%" }}
          duration={9}
          delay={4}
          animate={{ scale: [1, 1.18, 1], y: [0, -18, 0] }}
        />
        <Blob
          w={100}
          h={100}
          color={C.goldPale}
          style={{ top: "18%", left: "58%" }}
          duration={7}
          delay={1}
          animate={{ y: [0, 16, -8, 0], x: [0, -10, 0] }}
        />
        <Blob
          w={140}
          h={140}
          color={C.tealGhost}
          style={{ bottom: "18%", right: "22%" }}
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

        <div className="px-8 pt-8 pb-2 sm:px-10 sm:pt-10">
          {/* Logo + heading */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 flex flex-col items-center text-center"
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: C.tealGhost,
                border: `1.5px solid ${C.tealPale}`,
              }}
            >
              <Image
                src="/img/LOGO_TEMANTUMBUH.svg"
                alt="TemanTumbuh"
                width={26}
                height={26}
              />
            </div>
            <h1
              className="text-xl font-bold mb-1"
              style={{ color: C.textPrimary }}
            >
              Selamat Datang Kembali
            </h1>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Masuk ke akun TemanTumbuh-mu
            </p>
          </motion.div>

          {/* Demo banner */}
          <div className="mb-6">
            <Alert type="info">
              <strong className="font-semibold">Mode demo.</strong> Data tidak
              dikirim ke backend.
            </Alert>
          </div>

          {/* Success / error banners */}
          <AnimatePresence>
            {isDemoSuccess && (
              <div className="mb-5">
                <Alert type="success" onClose={() => setIsDemoSuccess(false)}>
                  Form berhasil disubmit — simulasi tanpa autentikasi backend.
                </Alert>
              </div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {serverError && (
              <div className="mb-5">
                <Alert type="error" onClose={() => setServerError("")}>
                  {serverError}
                </Alert>
              </div>
            )}
          </AnimatePresence>

          {/* Google button */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            whileHover={isGoogleLoading ? {} : { scale: 1.01 }}
            whileTap={isGoogleLoading ? {} : { scale: 0.98 }}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition-all"
            style={{
              border: `1.5px solid ${C.border}`,
              color: C.textPrimary,
              background: C.white,
              opacity: isGoogleLoading ? 0.7 : 1,
            }}
          >
            <Ic.Google />
            {isGoogleLoading ? "Menghubungkan..." : "Masuk dengan Google"}
          </motion.button>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: C.border }} />
            <span className="text-xs" style={{ color: C.textMuted }}>
              atau masuk dengan email
            </span>
            <div className="h-px flex-1" style={{ background: C.border }} />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            <Field id="login-email" label="Email" error={errors.email?.message}>
              <TextInput
                id="login-email"
                type="email"
                placeholder="email@contoh.com"
                autoComplete="email"
                autoFocus
                hasError={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field
              id="login-password"
              label="Password"
              error={errors.password?.message}
              rightLabel={
                <Link
                  href="/forgot-password"
                  tabIndex={-1}
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: C.teal }}
                >
                  Lupa password?
                </Link>
              }
            >
              <div className="relative">
                <TextInput
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  hasError={!!errors.password}
                  className="pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: C.textMuted }}
                  aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPassword ? <Ic.EyeOff /> : <Ic.Eye />}
                </button>
              </div>
            </Field>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.01 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              className={cn(
                "mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl",
                "text-[15px] font-semibold text-white transition-all duration-200",
                isSubmitting ? "cursor-not-allowed opacity-70" : "",
              )}
              style={{
                background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 60%, ${C.tealMid} 100%)`,
                boxShadow: isSubmitting
                  ? "none"
                  : `0 4px 18px rgba(26,150,136,0.3)`,
              }}
            >
              {isSubmitting ? (
                <>
                  <Ic.Spinner />
                  <span>Masuk...</span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  Masuk <Ic.ArrowRight />
                </span>
              )}
            </motion.button>
          </form>
        </div>

        {/* Register link */}
        <div
          className="mt-6 px-8 py-5 text-center text-sm sm:px-10"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <span style={{ color: C.textMuted }}>Belum punya akun? </span>
          <Link
            href="/register"
            className="font-semibold underline-offset-2 hover:underline"
            style={{ color: C.teal }}
          >
            Daftar Gratis
          </Link>
        </div>

        {/* ToS note */}
        <div
          className="px-8 pb-6 text-center text-[11px] sm:px-10"
          style={{ color: C.textMuted }}
        >
          Dengan masuk, kamu menyetujui{" "}
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
      </motion.div>
    </div>
  );
}

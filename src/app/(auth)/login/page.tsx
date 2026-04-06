"use client";

import QueryProvider from "@/components/providers/query-providers";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validations";
import {
  fadeUpVariants,
  logoDropVariants,
  springSmooth,
} from "@/lib/animations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageLoader, PageLoaderFallback } from "@/components/ui/page-loader";
import { GoogleIcon } from "@/components/ui/google-icon";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthField } from "@/components/auth/auth-field";
import { BrandPageBackground } from "@/components/layout/brand-page-background";

type SessionUser = {
  profileFilled?: boolean | null;
};

type SessionStatus = {
  isAuthenticated: boolean;
  isComplete: boolean;
};

const SESSION_QUERY_KEY = ["login", "session"] as const;

async function fetchSessionStatus(): Promise<SessionStatus> {
  const { data } = await authClient.getSession();
  const user = data?.user as SessionUser | undefined;

  return {
    isAuthenticated: Boolean(user),
    isComplete: Boolean(user?.profileFilled),
  };
}

function resolveLoginErrorMessage(error: {
  status?: number;
  message?: string;
  code?: string;
}) {
  const message = (error.message || "").toLowerCase();
  const code = (error.code || "").toLowerCase();

  if (
    error.status === 403 ||
    message.includes("verify") ||
    message.includes("verifikasi")
  ) {
    return "Email belum terverifikasi. Silakan cek inbox/spam untuk verifikasi.";
  }

  if (
    error.status === 429 ||
    message.includes("too many") ||
    message.includes("rate")
  ) {
    return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
  }

  if (
    error.status === 401 ||
    error.status === 400 ||
    message.includes("invalid") ||
    message.includes("credential") ||
    code.includes("invalid")
  ) {
    return "Email atau password tidak valid.";
  }

  if (message.includes("not found") || code.includes("not_found")) {
    return "Akun tidak ditemukan. Silakan daftar terlebih dahulu.";
  }

  return error.message ?? "Gagal login. Silakan coba lagi.";
}

function LoginPageContent() {
  const shouldReduce = useReducedMotion();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { data: sessionData, isLoading: isSessionLoading } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSessionStatus,
    retry: 1,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (isSessionLoading || !sessionData?.isAuthenticated) return;
  }, [isSessionLoading, sessionData]);

  const loginMutation = useMutation<
    unknown,
    { status?: number; message?: string; code?: string },
    LoginInput
  >({
    mutationFn: async (data) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/baseline",
      });

      if (response.error) {
        throw response.error;
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Login berhasil.");
      reset();
    },
    onError: (error) => {
      setServerError(resolveLoginErrorMessage(error));
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/baseline",
      });
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setServerError("Gagal memulai login Google. Silakan coba lagi.");
      toast.error("Google sign-in gagal dimulai.");
    },
  });

  const onSubmit = useCallback(
    async (data: LoginInput) => {
      setServerError("");
      await loginMutation.mutateAsync(data);
    },
    [loginMutation],
  );

  if (isSessionLoading) {
    return <PageLoader message="Memeriksa sesi..." />;
  }

  return (
    <BrandPageBackground fillViewport>
      <AuthShell maxWidth={400} compact>
        <motion.div
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={fadeUpVariants}
          transition={springSmooth}
        >
          <motion.div
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            variants={logoDropVariants}
            transition={{ ...springSmooth, delay: 0.05 }}
            className="mb-5 text-center"
          >
            <h1
              className="mb-1 text-lg font-bold"
              style={{ color: "var(--color-text-brand-primary)" }}
            >
              Selamat Datang Kembali
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-brand-muted)" }}
            >
              Masuk ke akun TemanTumbuh-mu
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {serverError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mb-3.5"
              >
                <Alert
                  className="rounded-xl border"
                  style={{
                    background: "#FEF2F2",
                    borderColor: "#FECACA",
                    color: "#B91C1C",
                  }}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login gagal</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setServerError("");
              googleMutation.mutate();
            }}
            disabled={googleMutation.isPending}
            className="mb-3.5 h-10.5 w-full gap-3 rounded-xl border-[1.5px] bg-white font-semibold"
            style={{
              borderColor: "var(--color-brand-border)",
              color: "var(--color-text-brand-primary)",
            }}
          >
            {googleMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleMutation.isPending
              ? "Menghubungkan..."
              : "Masuk dengan Google"}
          </Button>

          <div className="mb-3.5 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ background: "var(--color-brand-border)" }}
            />
            <span
              className="text-[11px]"
              style={{ color: "var(--color-text-brand-muted)" }}
            >
              atau masuk dengan email
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--color-brand-border)" }}
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            noValidate
          >
            <AuthField
              id="login-email"
              label="Email"
              error={errors.email?.message}
            >
              <Input
                id="login-email"
                type="email"
                placeholder="email@contoh.com"
                autoComplete="email"
                autoFocus
                className="h-10.5 rounded-xl"
                {...register("email")}
              />
            </AuthField>

            <AuthField
              id="login-password"
              label="Password"
              error={errors.password?.message}
            >
              <PasswordInput
                id="login-password"
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="h-10.5 rounded-xl"
                hasError={!!errors.password}
                {...register("password")}
              />
            </AuthField>

            <div className="pt-0.5">
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--color-brand-teal)" }}
              >
                Lupa password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="mt-1 h-10.5 w-full rounded-xl font-semibold text-white"
              style={{
                background: "var(--gradient-brand-btn)",
                boxShadow: "0 4px 18px rgba(26,150,136,0.18)",
              }}
            >
              {isSubmitting || loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p
            className="mt-4 text-center text-sm"
            style={{ color: "var(--color-text-brand-muted)" }}
          >
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: "var(--color-brand-teal)" }}
            >
              Daftar Gratis
            </Link>
          </p>
        </motion.div>
      </AuthShell>
    </BrandPageBackground>
  );
}

export default function LoginPage() {
  return (
    <QueryProvider>
      <Suspense fallback={<PageLoaderFallback />}>
        <LoginPageContent />
      </Suspense>
    </QueryProvider>
  );
}

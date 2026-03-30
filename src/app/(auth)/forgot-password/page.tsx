"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const response = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo,
      });

      if (response.error) {
        const message = (response.error.message || "").toLowerCase();
        const code = (response.error.code || "").toLowerCase();

        if (message.includes("not found") || code.includes("not_found")) {
          toast.error(
            "Email belum terdaftar. Silakan register terlebih dahulu.",
          );
          return;
        }

        toast.error(
          response.error.message || "Gagal mengirim link reset password.",
        );
        return;
      }

      setIsSubmitted(true);
      toast.success("Link reset password berhasil dikirim ke email tersebut.");
    } catch (error) {
      console.error("Request reset password error:", error);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Lupa Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Masukkan email akunmu. Kami akan kirim link untuk mengatur ulang
          password.
        </p>

        {isSubmitted ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Link reset sudah diproses. Cek inbox/spam email kamu.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
            noValidate
          >
            <div>
              <label
                className="mb-1 block text-sm font-medium text-slate-700"
                htmlFor="forgot-email"
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
                placeholder="email@contoh.com"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah ingat password?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-700 hover:underline"
          >
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}

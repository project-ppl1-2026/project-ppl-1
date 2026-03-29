"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error(
        "Token reset password tidak ditemukan atau sudah tidak valid.",
      );
      return;
    }

    try {
      const response = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (response.error) {
        toast.error(response.error.message || "Gagal mengatur ulang password.");
        return;
      }

      toast.success("Password berhasil diubah. Silakan login kembali.");
      router.replace("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="mt-3 text-sm text-red-700">
            Link reset tidak valid atau sudah kedaluwarsa.
          </p>
          <p className="mt-5 text-sm text-slate-600">
            <Link
              href="/forgot-password"
              className="font-semibold text-teal-700 hover:underline"
            >
              Minta link reset baru
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Atur Ulang Password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Masukkan password baru untuk akunmu.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="reset-new-password"
            >
              Password Baru
            </label>
            <input
              id="reset-new-password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              placeholder="Minimal 8 karakter"
              {...register("newPassword")}
            />
            {errors.newPassword?.message && (
              <p className="mt-1 text-xs text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="reset-confirm-password"
            >
              Konfirmasi Password Baru
            </label>
            <input
              id="reset-confirm-password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              placeholder="Ulangi password baru"
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword?.message && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}

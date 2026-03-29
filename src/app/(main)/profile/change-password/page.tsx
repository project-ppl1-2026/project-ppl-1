"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations";

export default function ChangePasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      const response = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      });

      if (response.error) {
        toast.error(response.error.message || "Gagal mengganti password.");
        return;
      }

      toast.success("Password berhasil diperbarui.");
      reset();
      router.replace("/profile");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-lg items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Ganti Password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Demi keamanan, semua sesi lain akan keluar otomatis setelah password
            diubah.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="current-password"
            >
              Password Saat Ini
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600"
              placeholder="Masukkan password saat ini"
              {...register("currentPassword")}
            />
            {errors.currentPassword?.message && (
              <p className="mt-1 text-xs text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="new-password"
            >
              Password Baru
            </label>
            <input
              id="new-password"
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
              htmlFor="confirm-new-password"
            >
              Konfirmasi Password Baru
            </label>
            <input
              id="confirm-new-password"
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
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link
            href="/profile"
            className="font-semibold text-teal-700 hover:underline"
          >
            Kembali ke Profil
          </Link>
        </p>
      </div>
    </div>
  );
}

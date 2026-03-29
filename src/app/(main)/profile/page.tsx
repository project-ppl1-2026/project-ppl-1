"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  profileEditFormSchema,
  type ProfileEditFormInput,
} from "@/lib/validations";

// Definisi tipe data profil lengkap
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  birthYear: number | null;
  gender: string | null;
  parentEmail: string | null;
  profileFilled: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormInput>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      name: "",
      birthYear: "",
      gender: "prefer_not",
      parentEmail: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          reset({
            name: data.name || "",
            birthYear: data.birthYear ? String(data.birthYear) : "",
            gender:
              data.gender === "male" ||
              data.gender === "female" ||
              data.gender === "prefer_not"
                ? data.gender
                : "prefer_not",
            parentEmail: data.parentEmail || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset, router]);

  const onSubmitProfile = async (data: ProfileEditFormInput) => {
    try {
      const response = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const payload = (await response.json()) as
        | UserProfile
        | { error?: string };

      if (!response.ok) {
        toast.error(
          (payload as { error?: string }).error || "Gagal memperbarui profil.",
        );
        return;
      }

      setProfile(payload as UserProfile);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  const years = Array.from({ length: 20 }, (_, i) =>
    String(new Date().getFullYear() - 10 - i),
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Memuat profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Anda belum login.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50/50">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Profil Saya
          </h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          {/* Header Profil (Avatar & Nama Dasar) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-4xl font-bold text-teal-700 ring-4 ring-white shadow-sm">
              {profile.image && profile.image.startsWith("http") ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-gray-500 mt-1">{profile.email}</p>
              {!profile.profileFilled && (
                <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  ?? Profil belum lengkap
                </span>
              )}
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Form / Data Lengkap Profil */}
          <form
            onSubmit={handleSubmit(onSubmitProfile)}
            className="space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-teal-600"
                      {...register("name")}
                    />
                    {errors.name?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                    {profile.name || "-"}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Tahun Lahir
                </label>
                {isEditing ? (
                  <>
                    <select
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-teal-600"
                      {...register("birthYear")}
                    >
                      <option value="">Pilih tahun lahir</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.birthYear?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.birthYear.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100 flex items-center justify-between">
                    <span>{profile.birthYear || "-"}</span>
                    {profile.birthYear && (
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                        {new Date().getFullYear() - profile.birthYear} Tahun
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Jenis Kelamin
                </label>
                {isEditing ? (
                  <>
                    <select
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-teal-600"
                      {...register("gender")}
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                      <option value="prefer_not">
                        Tidak ingin menyebutkan
                      </option>
                    </select>
                    {errors.gender?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                    {profile.gender === "male"
                      ? "Laki-laki"
                      : profile.gender === "female"
                        ? "Perempuan"
                        : "Tidak ingin menyebutkan"}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email Orang Tua (Wali)
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-teal-600"
                      placeholder="email-orangtua@contoh.com"
                      {...register("parentEmail")}
                    />
                    {errors.parentEmail?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.parentEmail.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                    {profile.parentEmail || "-"}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset({
                        name: profile.name || "",
                        birthYear: profile.birthYear
                          ? String(profile.birthYear)
                          : "",
                        gender:
                          profile.gender === "male" ||
                          profile.gender === "female" ||
                          profile.gender === "prefer_not"
                            ? profile.gender
                            : "prefer_not",
                        parentEmail: profile.parentEmail || "",
                      });
                    }}
                    className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Edit Profil
                </button>
              )}

              <Link
                href="/profile/change-password"
                className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Ganti Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

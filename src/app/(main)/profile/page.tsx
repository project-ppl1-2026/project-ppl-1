"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

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
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Nama */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                  {profile.name || "-"}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                  {profile.email}
                </div>
              </div>

              {/* Tahun Lahir / Umur */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Tahun Lahir
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100 flex items-center justify-between">
                  <span>{profile.birthYear || "-"}</span>
                  {profile.birthYear && (
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                      {new Date().getFullYear() - profile.birthYear} Tahun
                    </span>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Jenis Kelamin
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100 capitalize">
                  {profile.gender === "L"
                    ? "Laki-laki"
                    : profile.gender === "P"
                      ? "Perempuan"
                      : "-"}
                </div>
              </div>

              {/* Email Orang Tua */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email Orang Tua (Wali)
                </label>
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-900 border border-gray-100">
                  {profile.parentEmail || "-"}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/profile/change-password"
                className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Ganti Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

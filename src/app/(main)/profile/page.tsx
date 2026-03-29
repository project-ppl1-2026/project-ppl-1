"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function ProfilePage() {
  const [session, setSession] = useState<{
    user: { name: string; email: string; image?: string | null };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Memuat profil...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Anda belum login.</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Profil Saya</h1>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-3xl font-bold text-teal-700">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900">
                  {user.email}
                </div>
              </div>
              {/* Optional: Tambahkan field role atau informasi langganan lainnya jika sudah terhubung */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="rounded-lg bg-green-50 px-4 py-3 text-green-700 font-medium border border-green-100">
                  Aktif
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

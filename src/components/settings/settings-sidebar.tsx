"use client";

import { User, LogOut, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SettingsSidebarProps {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    image?: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setProfile({
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Berhasil keluar.");
      router.push("/login");
    } catch {
      toast.error("Gagal keluar.");
    }
  };

  return (
    <aside className="sticky top-20 flex flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm w-full">
      {/* Profile Card */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-6 flex flex-col items-center">
        <div className="relative mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-800 text-white shadow-md">
          {profile?.image ? (
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-black">
              {profile?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
        <p className="mb-1 text-center text-sm font-extrabold text-slate-900">
          {profile?.name || "Memuat..."}
        </p>
        <p className="mb-3 text-center text-[11px] text-slate-500">
          {profile?.email || "memuat@email.com"}
        </p>
        <div className="flex justify-center">
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border-slate-200 text-[11px] font-bold text-slate-600 bg-slate-100"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Free Plan
          </Badge>
        </div>
      </div>

      {/* Nav Items */}
      <div className="py-2">
        <button
          onClick={() => onTabChange(0)}
          className={`flex w-full items-center gap-3 border-l-[3px] px-5 py-3.5 text-left text-sm font-bold transition-all ${
            activeTab === 0
              ? "border-teal-800 bg-teal-50 text-teal-800"
              : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"
          }`}
        >
          <User className="h-4 w-4" />
          Profil Pengguna
        </button>
        <button
          onClick={() => onTabChange(1)}
          className={`flex w-full items-center gap-3 border-l-[3px] px-5 py-3.5 text-left text-sm font-bold transition-all ${
            activeTab === 1
              ? "border-teal-800 bg-teal-50 text-teal-800"
              : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"
          }`}
        >
          <Users className="h-4 w-4" />
          Laporan Orang Tua
        </button>
      </div>

      {/* Divider + Logout */}
      <div className="border-t border-slate-200 pb-1.5 pt-2.5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

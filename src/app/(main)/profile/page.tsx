"use client";

import { useState } from "react";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileContent } from "@/components/settings/profile-content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  // tab 0 = Profil, tab 1 = Laporan Orang Tua
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans border-t border-slate-200">
      {/* Page Title Strip */}
      <div className="border-b border-slate-200 bg-white px-12 pb-8 pt-9 mt-16 md:mt-0">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            AKUN KAMU
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight text-teal-900">
              Pengaturan
            </h1>
            <Button variant="outline" size="sm" asChild>
              <Link
                href="/dashboard"
                className="gap-2 font-bold text-teal-800 border-teal-200 bg-teal-50 hover:bg-teal-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-[260px_1fr] items-start gap-7 p-12 pb-24 px-4 md:px-12">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col gap-6 w-full">
          <ProfileContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

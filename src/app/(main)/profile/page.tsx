"use client";

import { useState } from "react";
import { SettingsSidebar } from "../../../components/settings/settings-sidebar";
import { ProfileContent } from "../../../components/settings/profile-content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="min-h-screen border-t border-slate-200 bg-slate-50 font-sans">
      <div className="mx-auto mt-16 w-full max-w-6xl px-8 pb-2 pt-8 md:mt-0">
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-(--brand-primary) transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-7 px-8 pb-24 pt-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex w-full flex-col gap-7">
          <ProfileContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SettingsSidebar } from "../../../components/settings/settings-sidebar";
import { ProfileContent } from "../../../components/settings/profile-content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type SessionProfile = {
  name: string;
  email: string;
  image?: string | null;
  createdAt?: string | null;
  birthYear?: number | null;
  gender?: "male" | "female" | "prefer_not" | null;
  parentEmail?: string | null;
  isPremium: boolean;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [sessionProfile, setSessionProfile] = useState<SessionProfile | null>(
    null,
  );
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const [{ data }, accountsResponse] = await Promise.all([
          authClient.getSession(),
          authClient.listAccounts(),
        ]);

        if (data?.user) {
          setSessionProfile({
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
            createdAt: data.user.createdAt
              ? new Date(data.user.createdAt).toISOString()
              : null,
            birthYear: (data.user as { birthYear?: number }).birthYear ?? null,
            gender:
              (
                data.user as {
                  gender?: "male" | "female" | "prefer_not";
                }
              ).gender ?? null,
            parentEmail:
              (data.user as { parentEmail?: string }).parentEmail ?? null,
            isPremium:
              (data.user as { isPremium?: boolean }).isPremium ?? false,
          });
        }

        if (accountsResponse?.data) {
          setIsGoogleLinked(
            accountsResponse.data.some(
              (account: { providerId: string }) =>
                account.providerId === "google",
            ),
          );
        }
      } catch {
        setSessionProfile(null);
      }
    };

    void loadSession();
  }, []);

  return (
    <div className="min-h-screen border-t border-slate-200 bg-slate-50 font-sans">
      <div className="mx-auto w-full max-w-5xl px-6 pb-2 pt-6 md:px-8 md:pt-8">
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

      <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-2 md:px-8 md:pt-4">
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 md:hidden">
          <Button
            type="button"
            variant={activeTab === 0 ? "default" : "ghost"}
            onClick={() => setActiveTab(0)}
            className={
              activeTab === 0
                ? "bg-(--brand-primary) text-white"
                : "text-slate-600"
            }
          >
            Profil
          </Button>
          <Button
            type="button"
            variant={activeTab === 1 ? "default" : "ghost"}
            onClick={() => setActiveTab(1)}
            className={
              activeTab === 1
                ? "bg-(--brand-primary) text-white"
                : "text-slate-600"
            }
          >
            Orang Tua
          </Button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[260px_1fr]">
          <div className="hidden md:block">
            <SettingsSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              profile={sessionProfile}
            />
          </div>

          <div className="flex w-full flex-col gap-7">
            <ProfileContent
              activeTab={activeTab}
              initialProfile={sessionProfile}
              initialIsGoogleLinked={isGoogleLinked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

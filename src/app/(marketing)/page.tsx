// ============================================================
// src/app/page.tsx
// Route "/" utama
// ============================================================

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import PublicShell from "@/components/layout/PublicShell";
import LandingPage from "@/components/landing/home/landing-page";

export default async function RootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.id) {
    redirect("/home");
  }

  return (
    <PublicShell>
      <LandingPage />
    </PublicShell>
  );
}

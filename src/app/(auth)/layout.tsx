// src/app/(auth)/layout.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/get-post-login-redirect";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika user sudah login, langsung redirect ke halaman yang sesuai.
  // Ini mencegah flash Navbar+Footer kosong saat proses redirect.
  if (session?.user?.id) {
    const nextRoute = await getPostLoginRedirect(session.user.id);
    // Jika nextRoute bukan halaman auth (login/register), redirect langsung
    if (nextRoute !== "/login" && !nextRoute.startsWith("/register")) {
      redirect(nextRoute);
    }

    // User authenticated tapi perlu complete profile → render tanpa Navbar/Footer
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
      >
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta)" }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

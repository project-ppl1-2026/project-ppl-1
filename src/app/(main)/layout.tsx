import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBaselineByUserId } from "@/lib/baseline/service";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileFilled: true },
  });

  if (!user?.profileFilled) {
    redirect("/register?completeProfile=1");
  }

  const baseline = await getBaselineByUserId(userId);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta)" }}
    >
      {!baseline ? null : null}
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}

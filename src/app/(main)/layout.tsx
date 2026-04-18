import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBaselineByUserId } from "@/lib/baseline/service";

import { AppSidebarShell } from "@/components/layout/app-sidebar-shell";

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
    select: {
      name: true,
      email: true,
      profileFilled: true,
      isPremium: true,
    },
  });

  if (!user?.profileFilled) {
    redirect("/register?completeProfile=1");
  }

  const baseline = await getBaselineByUserId(userId);

  if (!baseline) {
    redirect("/baseline");
  }

  return (
    <AppSidebarShell
      user={{
        name: user.name ?? "Teman",
        email: user.email ?? "",
        isPremium: Boolean(user.isPremium),
      }}
    >
      {children}
    </AppSidebarShell>
  );
}

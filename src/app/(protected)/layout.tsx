import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function MoodLayout({
  children,
}: {
  children: ReactNode;
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
      role: true,
      profileFilled: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "user") {
    redirect("/admin");
  }

  if (!user.profileFilled) {
    redirect("/register?completeProfile=1");
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "var(--tt-dashboard-page-bg)",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}

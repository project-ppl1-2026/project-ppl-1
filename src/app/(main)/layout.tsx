import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBaselineByUserId } from "@/lib/baseline/service";

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

  if (!baseline) {
    redirect("/baseline");
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta)" }}
    >
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

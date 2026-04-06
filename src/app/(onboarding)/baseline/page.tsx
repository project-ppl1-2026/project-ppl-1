import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getBaselineByUserId } from "@/lib/baseline/service";
import prisma from "@/lib/prisma";

import BaselinePageClient from "./BaselinePageClient";

export default async function BaselinePage() {
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

  if (baseline) {
    redirect("/");
  }

  return <BaselinePageClient />;
}

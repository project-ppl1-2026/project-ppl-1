import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import InsightPageContent from "@/features/insight/components/InsightPageContent";

export default async function InsightPage() {
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
      profileFilled: true,
      isPremium: true,
    },
  });

  if (!user?.profileFilled) {
    redirect("/register?completeProfile=1");
  }

  if (!user?.isPremium) {
    redirect("/subscription");
  }

  return <InsightPageContent />;
}

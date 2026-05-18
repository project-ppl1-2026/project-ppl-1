import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SubscriptionPageClient } from "./SubscriptionPageClient";

export default async function SubscriptionPage() {
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
      id: true,
      isPremium: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SubscriptionPageClient
      midtransClientKey={process.env.MIDTRANS_CLIENT_KEY || ""}
      midtransIsProduction={process.env.MIDTRANS_IS_PRODUCTION === "true"}
    />
  );
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSubscriptionStatus } from "@/lib/subscription/service";

import SubscriptionClient from "./SubscriptionClient";

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

  const subStatus = await getSubscriptionStatus(userId);
  const activeSubscription = subStatus.subscription;
  const pendingPayment = subStatus.pendingPayment;

  return (
    <SubscriptionClient
      isPremium={subStatus.isPremium}
      pendingPayment={
        pendingPayment
          ? {
              id: pendingPayment.id,
              orderId: pendingPayment.orderId,
              token: pendingPayment.snapToken || "",
              durationMonths: pendingPayment.durationMonths,
              grossAmount: pendingPayment.grossAmount.toString(),
              status: pendingPayment.status,
              createdAt: pendingPayment.createdAt.toISOString(),
            }
          : null
      }
      midtransClientKey={process.env.MIDTRANS_CLIENT_KEY || ""}
      midtransIsProduction={process.env.MIDTRANS_IS_PRODUCTION === "true"}
      subscription={
        activeSubscription
          ? {
              startedAt: activeSubscription.startedAt.toISOString(),
              expiresAt: activeSubscription.expiresAt.toISOString(),
              isActive: activeSubscription.isActive,
            }
          : null
      }
    />
  );
}

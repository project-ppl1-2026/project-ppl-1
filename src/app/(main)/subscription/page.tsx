import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { syncUserPremiumStatus } from "@/lib/subscription/service";
import { SubscriptionPageClient } from "./SubscriptionPageClient";

export default async function SubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  // Sync subscription status (auto-downgrade if expired)
  await syncUserPremiumStatus(userId);

  return (
    <SubscriptionPageClient
      midtransClientKey={process.env.MIDTRANS_CLIENT_KEY || ""}
      midtransIsProduction={process.env.MIDTRANS_IS_PRODUCTION === "true"}
    />
  );
}

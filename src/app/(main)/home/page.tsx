import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { syncUserPremiumStatus } from "@/lib/subscription/service";
import { HomeDashboardContent } from "@/features/home/components/HomeDashboardContent";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  // Sync subscription status (auto-downgrade if expired)
  await syncUserPremiumStatus(userId);

  return <HomeDashboardContent />;
}

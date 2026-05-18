"use client";

import { useQuery } from "@tanstack/react-query";
import SubscriptionClient from "./SubscriptionClient";
import { PageLoader } from "@/components/ui/manual/page-loader";

export function SubscriptionPageClient({
  midtransClientKey,
  midtransIsProduction,
}: {
  midtransClientKey: string;
  midtransIsProduction: boolean;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const res = await fetch("/api/subscription/status");
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      const json = await res.json();
      return json;
    },
    staleTime: 10_000,
  });

  if (isLoading) {
    return <PageLoader message="Memuat subscription..." />;
  }

  if (error || !data) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-red-500">
        Gagal memuat status langganan. Silakan coba sesaat lagi.
      </div>
    );
  }

  const { isPremium, subscription: activeSubscription, pendingPayment } = data;

  return (
    <SubscriptionClient
      isPremium={isPremium}
      pendingPayment={
        pendingPayment
          ? {
              id: pendingPayment.id,
              orderId: pendingPayment.orderId,
              token: pendingPayment.snapToken || "",
              durationMonths: pendingPayment.durationMonths,
              grossAmount: pendingPayment.grossAmount,
              status: pendingPayment.status,
              createdAt: pendingPayment.createdAt,
            }
          : null
      }
      midtransClientKey={midtransClientKey}
      midtransIsProduction={midtransIsProduction}
      subscription={
        activeSubscription
          ? {
              startedAt: activeSubscription.startedAt,
              expiresAt: activeSubscription.expiresAt,
              isActive: activeSubscription.isActive,
            }
          : null
      }
    />
  );
}

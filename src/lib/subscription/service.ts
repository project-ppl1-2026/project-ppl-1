import prisma from "@/lib/prisma";

const PENDING_PAYMENT_STATUSES = ["pending", "challenge"];

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export async function getLatestPendingPayment(userId: string) {
  return prisma.payment.findFirst({
    where: {
      userId,
      status: { in: PENDING_PAYMENT_STATUSES },
      snapToken: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderId: true,
      grossAmount: true,
      status: true,
      snapToken: true,
      durationMonths: true,
      createdAt: true,
    },
  });
}

/**
 * Creates a Subscription record and sets user.isPremium = true.
 * Renewals are appended after the user's furthest active expiry so remaining
 * premium time is preserved.
 */
export async function activateSubscription({
  userId,
  paymentId,
  durationMonths,
}: {
  userId: string;
  paymentId: string;
  durationMonths: number;
}) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { lte: now },
      },
      data: { isActive: false },
    });

    const furthestActiveSubscription = await tx.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: now },
      },
      orderBy: { expiresAt: "desc" },
    });

    const startedAt =
      furthestActiveSubscription && furthestActiveSubscription.expiresAt > now
        ? furthestActiveSubscription.expiresAt
        : now;

    const subscription = await tx.subscription.create({
      data: {
        userId,
        paymentId,
        startedAt,
        expiresAt: addMonths(startedAt, durationMonths),
        isActive: true,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });

    return subscription;
  });
}

/**
 * Deactivates expired rows, recalculates current premium access from all
 * subscription rows, and mirrors the result into user.isPremium.
 */
export async function syncUserPremiumStatus(userId: string) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { lte: now },
      },
      data: { isActive: false },
    });

    const activeSubscriptions = await tx.subscription.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: now },
      },
      orderBy: { expiresAt: "desc" },
    });

    const currentSubscription =
      activeSubscriptions.find(
        (subscription) =>
          subscription.startedAt <= now && subscription.expiresAt > now,
      ) ?? null;

    const premiumUntil = activeSubscriptions[0]?.expiresAt ?? null;
    const isPremium = currentSubscription !== null;

    await tx.user.update({
      where: { id: userId },
      data: { isPremium },
    });

    return {
      isPremium,
      subscription: activeSubscriptions[0] ?? null,
      premiumUntil,
      activeSubscriptionCount: activeSubscriptions.length,
    };
  });
}

/**
 * Gets current subscription status for a user, with auto-downgrade check.
 */
export async function getSubscriptionStatus(userId: string) {
  const result = await syncUserPremiumStatus(userId);
  const pendingPayment = await getLatestPendingPayment(userId);

  const canRenew = pendingPayment === null;

  return {
    isPremium: result.isPremium,
    subscription: result.subscription
      ? {
          id: result.subscription.id,
          startedAt: result.subscription.startedAt,
          expiresAt: result.subscription.expiresAt,
          isActive: result.subscription.isActive,
        }
      : null,
    activeSubscriptionCount: result.activeSubscriptionCount,
    premiumUntil: result.premiumUntil,
    pendingPayment,
    canRenew,
  };
}

export const checkAndDowngradeExpiredSubscription = syncUserPremiumStatus;

import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { getSubscriptionStatus } from "@/lib/subscription/service";

/**
 * GET /api/subscription/status
 * Returns the current subscription status for the logged-in user.
 * Also performs an auto-downgrade check if the subscription has expired.
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getSubscriptionStatus(userId);
    const pendingPayment = status.pendingPayment
      ? {
          id: status.pendingPayment.id,
          orderId: status.pendingPayment.orderId,
          grossAmount: status.pendingPayment.grossAmount.toString(),
          status: status.pendingPayment.status,
          snapToken: status.pendingPayment.snapToken,
          durationMonths: status.pendingPayment.durationMonths,
          createdAt: status.pendingPayment.createdAt,
        }
      : null;

    return NextResponse.json({
      success: true,
      ...status,
      pendingPayment,
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil status langganan." },
      { status: 500 },
    );
  }
}

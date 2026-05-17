import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getLatestPendingPayment } from "@/lib/subscription/service";

async function cancelMidtransTransaction(orderId: string) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not configured.");
  }

  const baseUrl =
    process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";

  const authHeader = Buffer.from(`${serverKey}:`).toString("base64");
  const response = await fetch(`${baseUrl}/v2/${orderId}/cancel`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok || response.status === 404) {
    return;
  }

  throw new Error(`Midtrans cancel failed with status ${response.status}.`);
}

/**
 * POST /api/payment/cancel
 * Cancels the logged-in user's latest pending Midtrans payment.
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingPayment = await getLatestPendingPayment(userId);

    if (!pendingPayment) {
      return NextResponse.json(
        { error: "Tidak ada pembayaran tertunda." },
        { status: 404 },
      );
    }

    await cancelMidtransTransaction(pendingPayment.orderId);

    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        status: "cancel",
        expiredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      cancelledPayment: {
        id: pendingPayment.id,
        orderId: pendingPayment.orderId,
      },
    });
  } catch (error) {
    console.error("Payment cancel error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat membatalkan pembayaran." },
      { status: 500 },
    );
  }
}

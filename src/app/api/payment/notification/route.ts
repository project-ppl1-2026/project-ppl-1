import crypto from "crypto";

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  activateSubscription,
  syncUserPremiumStatus,
} from "@/lib/subscription/service";

/**
 * POST /api/payment/notification
 * Midtrans webhook handler — receives payment status notifications.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      va_numbers,
    } = body;

    // Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    console.log(
      `[Midtrans Webhook] Received for Order: ${order_id}, Status: ${transaction_status}`,
    );

    if (signature_key !== expectedSignature) {
      console.error(
        "[Midtrans Webhook] Error: Invalid signature for order",
        order_id,
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { orderId: order_id },
    });

    if (!payment) {
      console.error("Payment not found for order:", order_id);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (
      payment.status === "settlement" &&
      transaction_status !== "settlement" &&
      transaction_status !== "capture"
    ) {
      return NextResponse.json({ success: true });
    }

    // Determine the VA number if available
    const vaNumber =
      Array.isArray(va_numbers) && va_numbers.length > 0
        ? va_numbers[0].va_number
        : null;

    // Handle transaction status
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      // For capture, check fraud status
      if (transaction_status === "capture" && fraud_status !== "accept") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "challenge",
            paymentType: payment_type || null,
            vaNumber,
          },
        });

        return NextResponse.json({ success: true });
      }

      // Idempotent — skip if already settled
      if (payment.status === "settlement") {
        return NextResponse.json({ success: true });
      }

      // Mark payment as settled
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "settlement",
          paymentType: payment_type || null,
          vaNumber,
          paidAt: new Date(),
        },
      });

      // Activate subscription
      await activateSubscription({
        userId: payment.userId,
        paymentId: payment.id,
        durationMonths: payment.durationMonths,
      });
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: transaction_status,
          paymentType: payment_type || null,
          vaNumber,
          expiredAt:
            transaction_status === "expire" ? new Date() : payment.expiredAt,
        },
      });

      await syncUserPremiumStatus(payment.userId);
    } else if (transaction_status === "pending") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "pending",
          paymentType: payment_type || null,
          vaNumber,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment notification error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses notifikasi pembayaran." },
      { status: 500 },
    );
  }
}

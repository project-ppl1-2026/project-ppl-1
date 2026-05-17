import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  generateDailyInsight,
  InsightServiceError,
} from "@/lib/insight/service";

/**
 * POST /api/insight/generate
 * Generates one daily insight for the logged-in premium user.
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as {
      date?: unknown;
      timezone?: unknown;
    };

    if (typeof payload.date !== "string") {
      return NextResponse.json(
        { error: "Berdasarkan tanggal (date) diperlukan." },
        { status: 400 },
      );
    }

    const data = await generateDailyInsight({
      userId,
      date: payload.date,
      timezone:
        typeof payload.timezone === "string" ? payload.timezone : undefined,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Insight generate error:", error);

    if (error instanceof InsightServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghasilkan insight." },
      { status: 500 },
    );
  }
}

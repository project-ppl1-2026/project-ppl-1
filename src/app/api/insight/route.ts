import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  getInsightMapForUser,
  InsightServiceError,
} from "@/lib/insight/service";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getInsightMapForUser(userId);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Insight GET error:", error);

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
      { error: "Terjadi kesalahan saat mengambil insight." },
      { status: 500 },
    );
  }
}

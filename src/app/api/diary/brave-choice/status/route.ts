import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  BraveChoiceServiceError,
  getBraveChoiceStatusForUser,
} from "@/lib/diary/brave-choice-service";
import { braveChoiceQuerySchema } from "@/lib/diary/validation";

/**
 * GET /api/diary/brave-choice/status?timezone=Asia/Jakarta
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = braveChoiceQuerySchema.safeParse({
      timezone: searchParams.get("timezone") || undefined,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          error:
            parsedQuery.error.issues[0]?.message ||
            "Parameter BraveChoice tidak valid.",
        },
        { status: 400 },
      );
    }

    const result = await getBraveChoiceStatusForUser({
      userId,
      timezone: parsedQuery.data.timezone,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("BraveChoice status GET error:", error);

    if (error instanceof BraveChoiceServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil status BraveChoice." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  BraveChoiceServiceError,
  resetBraveChoiceProgressForUser,
} from "@/lib/diary/brave-choice-service";

/**
 * POST /api/diary/brave-choice/reset
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await resetBraveChoiceProgressForUser({
      userId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("BraveChoice reset POST error:", error);

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
      { error: "Terjadi kesalahan saat mereset progres BraveChoice." },
      { status: 500 },
    );
  }
}

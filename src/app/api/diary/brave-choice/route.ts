import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  BraveChoiceServiceError,
  getBraveChoiceQuizForUser,
  submitBraveChoiceAnswerForUser,
} from "@/lib/diary/brave-choice-service";
import {
  braveChoiceAnswerPayloadSchema,
  braveChoiceQuerySchema,
} from "@/lib/diary/validation";

/**
 * GET /api/diary/brave-choice?timezone=Asia/Jakarta
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

    const result = await getBraveChoiceQuizForUser({
      userId,
      timezone: parsedQuery.data.timezone,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("BraveChoice GET error:", error);

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
      { error: "Terjadi kesalahan saat mengambil soal BraveChoice." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/diary/brave-choice
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsedPayload = braveChoiceAnswerPayloadSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error:
            parsedPayload.error.issues[0]?.message ||
            "Payload BraveChoice tidak valid.",
        },
        { status: 400 },
      );
    }

    const result = await submitBraveChoiceAnswerForUser({
      userId,
      questionId: parsedPayload.data.questionId,
      chosenOption: parsedPayload.data.chosenOption,
      timezone: parsedPayload.data.timezone,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("BraveChoice POST error:", error);

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
      { error: "Terjadi kesalahan saat menyimpan jawaban BraveChoice." },
      { status: 500 },
    );
  }
}

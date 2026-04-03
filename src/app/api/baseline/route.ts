import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  analyzeAndSaveBaseline,
  getBaselineByUserId,
} from "@/lib/baseline/service";
import { baselineAnswersSchema } from "@/lib/baseline/validation";

export const runtime = "nodejs";

async function getAuthenticatedUserId(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user?.id ?? null;
}

async function saveBaselineResult(request: Request) {
  const userId = await getAuthenticatedUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsedPayload = baselineAnswersSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error:
          parsedPayload.error.issues[0]?.message ||
          "Payload baseline tidak valid.",
      },
      { status: 400 },
    );
  }

  const result = await analyzeAndSaveBaseline({
    answers: parsedPayload.data.answers,
    userId,
  });

  return NextResponse.json({
    success: true,
    baseline: result.baseline,
    prediction: {
      labelIndex: result.inference.labelIndex,
      label: result.inference.label,
      isBeginner: result.inference.isBeginner,
      confidenceScore: result.inference.confidenceScore,
      inputName: result.inference.inputName,
    },
  });
}

/**
 * GET /api/baseline
 * Returns the saved baseline result for the logged-in user.
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseline = await getBaselineByUserId(userId);

    return NextResponse.json({
      success: true,
      baseline,
    });
  } catch (error) {
    console.error("Baseline GET error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil baseline." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/baseline
 * Runs inference and stores the first baseline result for the logged-in user.
 */
export async function POST(request: Request) {
  try {
    return await saveBaselineResult(request);
  } catch (error) {
    console.error("Baseline POST error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses baseline." },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/baseline
 * Re-runs baseline inference and overwrites the saved result for the logged-in user.
 */
export async function PATCH(request: Request) {
  try {
    return await saveBaselineResult(request);
  } catch (error) {
    console.error("Baseline PATCH error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui baseline." },
      { status: 500 },
    );
  }
}

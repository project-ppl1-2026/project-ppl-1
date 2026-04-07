import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { resetStreakIfMissed } from "@/lib/mood/service";

/**
 * PATCH /api/mood/streak
 * Mengevaluasi secara "Lazy" maupun On-Demand apakah streak dari pengguna
 * sudah telat lebih dari 1 hari dan harus di-reset ke 0.
 *
 * Menerima body: { timezone: "Asia/Jakarta" }
 */
export async function PATCH(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();

    if (!payload?.timezone || typeof payload.timezone !== "string") {
      return NextResponse.json(
        { error: "Timezone identifier (misal: Asia/Jakarta) diperlukan." },
        { status: 400 },
      );
    }

    await resetStreakIfMissed(userId, payload.timezone);

    return NextResponse.json({
      success: true,
      message: "Proses evaluasi streak selesai dijalankan.",
    });
  } catch (error) {
    console.error("Mood Streak PATCH error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses reset streak." },
      { status: 500 },
    );
  }
}

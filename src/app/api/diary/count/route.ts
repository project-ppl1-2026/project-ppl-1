import { NextResponse } from "next/server";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { getTotalDiaryCount } from "@/lib/diary/service";

/**
 * GET /api/diary/count
 * Mengambil total diary dari user yang sedang login.
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Kamu harus login dulu." },
        { status: 401 },
      );
    }

    const count = await getTotalDiaryCount(userId);

    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("[GET /api/diary/count]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil total diary.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  ParentReportError,
  sendWeeklyParentReportForUser,
} from "@/lib/parent-report/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => ({}))) as {
      timezone?: unknown;
    };
    const result = await sendWeeklyParentReportForUser({
      userId,
      timezone:
        typeof payload.timezone === "string" ? payload.timezone : undefined,
      force: true,
    });

    return NextResponse.json({
      success: true,
      message:
        result.skipped && result.reason === "no_data"
          ? "Belum ada data mood untuk periode ini, jadi laporan tidak dikirim."
          : result.skipped
            ? "Laporan periode ini sudah pernah dikirim."
            : "Laporan mingguan berhasil dikirim.",
      data: result,
    });
  } catch (error) {
    console.error("Manual parent report send error:", error);

    if (error instanceof ParentReportError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim laporan mingguan." },
      { status: 500 },
    );
  }
}

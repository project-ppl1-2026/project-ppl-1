import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createMoodLog, getMoodLogs } from "@/lib/mood/service";
import { moodSubmitSchema } from "@/lib/mood/validation";

export const runtime = "nodejs";

/**
 * Helper untuk mendapatkan ID user yang sedang login dari session.
 */
async function getAuthenticatedUserId(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user?.id ?? null;
}

/**
 * GET /api/mood
 * Mengambil histori mood check-in dari pengguna yang sedang login.
 * Menerima query string opsional: `?date=YYYY-MM-DD` & `?timezone=Asia/Jakarta`
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const timezoneParam = searchParams.get("timezone");

    const logs = await getMoodLogs(
      userId,
      dateParam || undefined,
      timezoneParam || undefined,
    );

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Mood GET error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil riwayat mood." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/mood
 * Menyimpan data mood check-in untuk pengguna yang sedang login pada hari yang berjalan.
 * Memvalidasi input dan memastikan hanya bisa 1x submit per hari per timezone.
 * Mensinkronisasikan penambahan / pengulangan nilai streak otomatis.
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsedPayload = moodSubmitSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error:
            parsedPayload.error.issues[0]?.message ||
            "Payload mood tidak valid.",
        },
        { status: 400 },
      );
    }

    const { newLog, updatedUser } = await createMoodLog({
      userId,
      moodScore: parsedPayload.data.moodScore,
      note: parsedPayload.data.note,
      timezone: parsedPayload.data.timezone,
    });

    return NextResponse.json({
      success: true,
      message: "Mood berhasil disubmit.",
      data: {
        mood: newLog,
        currentStreak: updatedUser.currentStreak,
      },
    });
  } catch (error: unknown) {
    console.error("Mood POST error:", error);

    // Mengembalikan pesan spesifik misal error "Kamu sudah mengisi mood check-in hari ini."
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan mood.",
      },
      {
        status:
          error instanceof Error && error.message.includes("sudah mengisi")
            ? 409
            : 500,
      },
    );
  }
}

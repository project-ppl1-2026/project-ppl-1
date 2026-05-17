import { NextResponse } from "next/server";

import { sendWeeklyParentReports } from "@/lib/parent-report/service";

export const runtime = "nodejs";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-cron-secret")?.trim() || "";
}

async function handleCron(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;

    if (!secret || getBearerToken(request) !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "200");
    const timezone = searchParams.get("timezone") || undefined;
    const result = await sendWeeklyParentReports({
      timezone,
      limit: Number.isFinite(limit) ? limit : 200,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Weekly parent report cron error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menjalankan cron laporan." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handleCron(request);
}

export async function POST(request: Request) {
  return handleCron(request);
}

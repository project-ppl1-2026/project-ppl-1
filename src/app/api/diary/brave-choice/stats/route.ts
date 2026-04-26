import { NextResponse } from "next/server";
import { getBraveChoiceStatsForUser } from "@/lib/diary/brave-choice-service";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const stats = await getBraveChoiceStatsForUser(userId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[Brave Choice Stats API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

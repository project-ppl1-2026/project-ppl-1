import { NextResponse } from "next/server";

import {
  getAuthenticatedUserIdFromRequest,
  getUserSecurityState,
} from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasPassword, isGoogleLinked, providerIds } =
      await getUserSecurityState(userId);

    return NextResponse.json({
      success: true,
      hasPassword,
      isGoogleLinked,
      providerIds,
    });
  } catch (error) {
    console.error("Profile security-state GET error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil status keamanan akun." },
      { status: 500 },
    );
  }
}

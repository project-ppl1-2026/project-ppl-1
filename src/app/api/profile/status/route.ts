import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Returns profile completion status for the currently authenticated user.
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ isAuthenticated: false, isComplete: false });
    }

    const rows = await prisma.$queryRaw<Array<{ profileFilled: boolean }>>`
      SELECT "profileFilled"
      FROM "user"
      WHERE "id" = ${session.user.id}
      LIMIT 1
    `;

    return NextResponse.json({
      isAuthenticated: true,
      isComplete: Boolean(rows[0]?.profileFilled),
    });
  } catch (error) {
    console.error("Profile status error:", error);
    return NextResponse.json(
      { message: "Failed to get profile status" },
      { status: 500 },
    );
  }
}

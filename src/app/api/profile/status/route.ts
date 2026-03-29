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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profileFilled: true },
    });

    return NextResponse.json({
      isAuthenticated: true,
      isComplete: Boolean(user?.profileFilled),
      userName: session.user.name ?? "",
    });
  } catch (error) {
    console.error("Profile status error:", error);
    return NextResponse.json(
      { message: "Failed to get profile status" },
      { status: 500 },
    );
  }
}

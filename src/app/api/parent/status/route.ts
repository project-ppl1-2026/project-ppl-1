import { NextResponse } from "next/server";

import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parent = await prisma.parent.findFirst({
      where: {
        userId,
      },
      select: {
        email: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!parent) {
      return NextResponse.json({
        email: null,
        status: null,
        expiresAt: null,
      });
    }

    if (
      parent.status === "pending" &&
      parent.expiresAt &&
      parent.expiresAt <= new Date()
    ) {
      await prisma.parent.update({
        where: {
          userId,
        },
        data: {
          status: "expired",
          token: null,
        },
      });

      return NextResponse.json({
        email: parent.email,
        status: "expired",
        expiresAt: parent.expiresAt,
      });
    }

    return NextResponse.json(parent);
  } catch (error) {
    console.error("Parent status error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}

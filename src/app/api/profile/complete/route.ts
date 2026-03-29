import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Persists profile completion data for the current authenticated user.
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      name: string;
      birthYear: string;
      gender: "male" | "female" | "prefer_not";
      parentEmail?: string;
    };

    const birthYear = Number(body.birthYear);
    if (!Number.isInteger(birthYear)) {
      return NextResponse.json(
        { message: "Invalid birth year" },
        { status: 400 },
      );
    }

    await prisma.$executeRaw`
      UPDATE "user"
      SET
        "name" = ${body.name},
        "birthYear" = ${birthYear},
        "gender" = ${body.gender},
        "parentEmail" = ${body.parentEmail || null},
        "profileFilled" = ${true},
        "updatedAt" = NOW()
      WHERE "id" = ${session.user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { message: "Failed to complete profile" },
      { status: 500 },
    );
  }
}

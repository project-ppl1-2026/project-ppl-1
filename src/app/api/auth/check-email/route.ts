import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/auth/check-email
 * Checks if an email is registered in the system.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Email diperlukan." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    return NextResponse.json({ exists: !!user });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

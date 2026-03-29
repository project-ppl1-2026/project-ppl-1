import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { registerStatusApiSchema } from "@/lib/validations";

// Checks whether a user row exists after signup attempt.
export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = registerStatusApiSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload tidak valid" },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return NextResponse.json({ exists: Boolean(user) });
  } catch (error) {
    console.error("Register status check error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}

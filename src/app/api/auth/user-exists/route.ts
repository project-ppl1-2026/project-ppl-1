import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = forgotPasswordSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload tidak valid" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    return NextResponse.json({ exists: Boolean(user) });
  } catch (error) {
    console.error("User exists check error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type RegisterStatusBody = {
  email?: string;
};

// Checks whether a user row exists after signup attempt.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterStatusBody;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

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

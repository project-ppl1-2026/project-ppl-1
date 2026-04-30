// src/app/api/auth/check-email/route.ts
// Endpoint untuk cek apakah email sudah terdaftar sebelum signup

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          exists: false,
          error: "Email wajib diisi",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      exists: Boolean(existing),
    });
  } catch (error) {
    console.error("check-email error:", error);

    return NextResponse.json(
      {
        exists: false,
        error: "Gagal memeriksa email",
      },
      { status: 500 },
    );
  }
}

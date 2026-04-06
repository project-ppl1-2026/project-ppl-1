import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        providerId: true,
        password: true,
      },
    });

    const providerIds = accounts.map((account) => account.providerId);

    const isGoogleLinked = providerIds.includes("google");

    const hasPassword = accounts.some(
      (account) =>
        account.providerId === "credential" ||
        (typeof account.password === "string" &&
          account.password.trim().length > 0),
    );

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

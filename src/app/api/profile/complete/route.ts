import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileCompleteApiSchema } from "@/lib/validations";

// Persists profile completion data for the current authenticated user.
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await req.json();
    const parsed = profileCompleteApiSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Payload tidak valid" },
        { status: 400 },
      );
    }

    const { name, birthYear, gender, parentEmail } = parsed.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        birthYear,
        gender,
        parentEmail: parentEmail || null,
        profileFilled: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { message: "Failed to complete profile" },
      { status: 500 },
    );
  }
}

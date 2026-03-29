import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { requestParentConsentEmail } from "@/lib/parent-consent";
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
    const userId = session.user.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, parentEmail: true },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const normalizedCurrentParentEmail =
      currentUser.parentEmail?.toLowerCase() || null;
    const normalizedIncomingParentEmail = parentEmail?.toLowerCase() || null;

    if (
      normalizedIncomingParentEmail &&
      normalizedIncomingParentEmail !== normalizedCurrentParentEmail
    ) {
      const appUrl =
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        new URL(req.url).origin;

      try {
        await requestParentConsentEmail({
          userId,
          childName: name,
          parentEmail: normalizedIncomingParentEmail,
          appUrl,
        });
      } catch (emailError) {
        console.error(
          "Gagal mengirim email persetujuan orang tua saat complete:",
          emailError,
        );
        return NextResponse.json(
          { message: "Gagal mengirim email persetujuan orang tua/wali." },
          { status: 500 },
        );
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        birthYear,
        gender,
        parentEmail:
          normalizedIncomingParentEmail &&
          normalizedIncomingParentEmail === normalizedCurrentParentEmail
            ? normalizedIncomingParentEmail
            : normalizedIncomingParentEmail
              ? null
              : null,
        profileFilled: true,
      },
    });

    if (
      normalizedIncomingParentEmail &&
      normalizedIncomingParentEmail !== normalizedCurrentParentEmail
    ) {
      return NextResponse.json({
        success: true,
        requiresParentConsent: true,
        pendingParentEmail: normalizedIncomingParentEmail,
        message:
          "Email persetujuan telah dikirim ke orang tua/wali. Hubungan email akan aktif setelah disetujui.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { message: "Failed to complete profile" },
      { status: 500 },
    );
  }
}

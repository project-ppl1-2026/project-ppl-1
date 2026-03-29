import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  extractPendingParentEmail,
  requestParentConsentEmail,
} from "@/lib/parent-consent";
import prisma from "@/lib/prisma";
import { profileUpdateApiSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = sessionResponse;

    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthYear: true,
        gender: true,
        parentEmail: true,
        profileFilled: true,
      },
    });

    if (!fullProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pendingConsent = await prisma.verification.findFirst({
      where: {
        identifier: {
          startsWith: `parent-consent:${user.id}:`,
        },
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        identifier: true,
      },
    });

    const pendingParentEmail = pendingConsent
      ? extractPendingParentEmail(pendingConsent.identifier)
      : null;

    // Auto-update Avatar dari Google jika user belum punya image
    if (!fullProfile.image) {
      const googleAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          providerId: "google",
        },
        orderBy: { createdAt: "desc" },
      });

      if (googleAccount?.idToken) {
        try {
          const base64Url = googleAccount.idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );
          const payload = JSON.parse(jsonPayload);

          if (payload.picture) {
            // Update db
            await prisma.user.update({
              where: { id: user.id },
              data: { image: payload.picture },
            });
            // Update current response object
            fullProfile.image = payload.picture;
          }
        } catch (e) {
          console.error("Gagal ekstrak gambar dari Google idToken:", e);
        }
      }
    }

    return NextResponse.json({
      ...fullProfile,
      pendingParentEmail,
    });
  } catch (error: unknown) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    const parsed = profileUpdateApiSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload tidak valid" },
        { status: 400 },
      );
    }

    const userId = sessionResponse.user.id;
    const incomingParentEmail = parsed.data.parentEmail;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        parentEmail: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateCommon = {
      name: parsed.data.name,
      birthYear: parsed.data.birthYear,
      gender: parsed.data.gender,
    };

    const normalizedCurrentParentEmail =
      currentUser.parentEmail?.toLowerCase() || null;
    const normalizedIncomingParentEmail =
      incomingParentEmail?.toLowerCase() || null;

    if (!normalizedIncomingParentEmail) {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateCommon,
          parentEmail: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          birthYear: true,
          gender: true,
          parentEmail: true,
          profileFilled: true,
        },
      });

      return NextResponse.json(updated);
    }

    if (normalizedIncomingParentEmail === normalizedCurrentParentEmail) {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateCommon,
          parentEmail: normalizedIncomingParentEmail,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          birthYear: true,
          gender: true,
          parentEmail: true,
          profileFilled: true,
        },
      });

      return NextResponse.json(updated);
    }

    const appUrl =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    try {
      await requestParentConsentEmail({
        userId,
        childName: currentUser.name,
        parentEmail: normalizedIncomingParentEmail,
        appUrl,
      });
    } catch (emailError) {
      console.error("Gagal mengirim email persetujuan orang tua:", emailError);
      return NextResponse.json(
        { error: "Gagal mengirim email persetujuan orang tua/wali." },
        { status: 500 },
      );
    }

    const updatedWithoutParentLink = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateCommon,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthYear: true,
        gender: true,
        parentEmail: true,
        profileFilled: true,
      },
    });

    return NextResponse.json({
      ...updatedWithoutParentLink,
      requiresParentConsent: true,
      pendingParentEmail: normalizedIncomingParentEmail,
      message:
        "Email persetujuan telah dikirim ke orang tua/wali. Hubungan email akan aktif setelah disetujui.",
    });
  } catch (error: unknown) {
    console.error("PATCH Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

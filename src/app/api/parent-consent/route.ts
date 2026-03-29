import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  parentConsentDecisionSchema,
  parentConsentTokenQuerySchema,
} from "@/lib/validations";

function decodeIdentifier(identifier: string) {
  const parts = identifier.split(":");
  if (parts.length < 3 || parts[0] !== "parent-consent") {
    return null;
  }

  const userId = parts[1];
  const encodedEmail = parts.slice(2).join(":");

  try {
    const parentEmail = decodeURIComponent(encodedEmail);
    return { userId, parentEmail };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const decision = url.searchParams.get("decision");

    const parsedQuery = parentConsentDecisionSchema.safeParse({
      token,
      decision,
    });

    if (!parsedQuery.success) {
      const fallbackToken = parentConsentTokenQuerySchema.safeParse({ token });
      if (fallbackToken.success) {
        return new NextResponse(
          '<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>Keputusan belum dipilih</h2><p>Gunakan link Setuju/Tolak dari email untuk memberikan persetujuan.</p></body></html>',
          {
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          },
        );
      }

      return new NextResponse(
        '<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>Link tidak valid</h2><p>Token atau parameter keputusan tidak valid.</p></body></html>',
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    const verification = await prisma.verification.findFirst({
      where: {
        value: parsedQuery.data.token,
        identifier: {
          startsWith: "parent-consent:",
        },
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        identifier: true,
        expiresAt: true,
      },
    });

    if (!verification) {
      return new NextResponse(
        '<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>Link kedaluwarsa</h2><p>Link persetujuan sudah tidak valid atau sudah pernah digunakan.</p></body></html>',
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    const decoded = decodeIdentifier(verification.identifier);
    if (!decoded) {
      return new NextResponse(
        '<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>Data verifikasi tidak valid</h2></body></html>',
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    if (parsedQuery.data.decision === "accept") {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          parentEmail: decoded.parentEmail,
        },
      });
    }

    await prisma.verification.delete({
      where: { id: verification.id },
    });

    const title =
      parsedQuery.data.decision === "accept"
        ? "Persetujuan Berhasil"
        : "Permintaan Ditolak";
    const description =
      parsedQuery.data.decision === "accept"
        ? `Email ${decoded.parentEmail} sekarang akan menerima laporan dari TemanTumbuh.`
        : "Email tidak akan dihubungkan ke akun tersebut.";

    return new NextResponse(
      `<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>${title}</h2><p>${description}</p></body></html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  } catch (error: unknown) {
    console.error("Parent consent GET error:", error);
    return new NextResponse(
      '<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>Terjadi kesalahan sistem</h2><p>Silakan coba lagi nanti.</p></body></html>',
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = parentConsentDecisionSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload tidak valid" },
        { status: 400 },
      );
    }

    const verification = await prisma.verification.findFirst({
      where: {
        value: parsed.data.token,
        identifier: {
          startsWith: "parent-consent:",
        },
      },
      select: {
        id: true,
        identifier: true,
        expiresAt: true,
      },
    });

    if (!verification || verification.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "Link sudah tidak valid." },
        { status: 404 },
      );
    }

    const decoded = decodeIdentifier(verification.identifier);
    if (!decoded) {
      return NextResponse.json(
        { error: "Data verifikasi tidak valid." },
        { status: 400 },
      );
    }

    if (parsed.data.decision === "accept") {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          parentEmail: decoded.parentEmail,
        },
      });
    }

    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return NextResponse.json({
      success: true,
      decision: parsed.data.decision,
    });
  } catch (error: unknown) {
    console.error("Parent consent POST error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}

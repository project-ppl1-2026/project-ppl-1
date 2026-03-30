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

    const isAccept = parsedQuery.data.decision === "accept";
    const title = isAccept ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan";
    const description = isAccept
      ? `Anda akan menyetujui email ${decoded.parentEmail} untuk menerima laporan TemanTumbuh.`
      : "Anda akan menolak penghubungan email ini dengan akun anak.";
    const actionLabel = isAccept ? "Setujui Sekarang" : "Tolak Sekarang";

    return new NextResponse(
      `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:24px;background:#f3f8ff;color:#1f2937;">
          <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #dbe7f3;border-radius:14px;overflow:hidden;">
            <div style="background:linear-gradient(90deg,#0f6b60,#1a9688,#28b0a4);height:6px;"></div>
            <div style="padding:24px;">
              <h2 style="margin:0 0 12px;color:#0f6b60;">${title}</h2>
              <p style="margin:0 0 18px;line-height:1.6;">${description}</p>
              <form method="POST" action="/api/parent-consent" style="margin:0;">
                <input type="hidden" name="token" value="${parsedQuery.data.token}" />
                <input type="hidden" name="decision" value="${parsedQuery.data.decision}" />
                <button type="submit" style="border:0;background:${isAccept ? "#1a9688" : "#ef4444"};color:#fff;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;cursor:pointer;">
                  ${actionLabel}
                </button>
              </form>
              <p style="margin:14px 0 0;font-size:12px;color:#6b7280;">Langkah ini mencegah tautan otomatis dari email scanner menghabiskan token.</p>
            </div>
          </div>
        </body>
      </html>`,
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
    const contentType = request.headers.get("content-type") || "";
    const rawBody = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
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
    } else {
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          parentEmail: null,
        },
      });
    }

    await prisma.verification.delete({
      where: { id: verification.id },
    });

    if (!contentType.includes("application/json")) {
      const title =
        parsed.data.decision === "accept"
          ? "Persetujuan Berhasil"
          : "Permintaan Ditolak";
      const description =
        parsed.data.decision === "accept"
          ? `Email ${decoded.parentEmail} sekarang akan menerima laporan dari TemanTumbuh.`
          : "Email tidak dihubungkan ke akun anak.";

      return new NextResponse(
        `<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2>${title}</h2><p>${description}</p></body></html>`,
        {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    return NextResponse.json({ success: true, decision: parsed.data.decision });
  } catch (error: unknown) {
    console.error("Parent consent POST error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}

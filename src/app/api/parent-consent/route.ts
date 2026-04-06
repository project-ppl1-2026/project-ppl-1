import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  parentConsentDecisionSchema,
  parentConsentTokenQuerySchema,
} from "@/lib/validations";

type ParentConsentRow = {
  id: string;
  userId: string;
  email: string;
  status: "pending" | "verified" | "expired";
  expiresAt: Date | null;
};

async function getParentByToken(token: string) {
  return prisma.parent.findFirst({
    where: { token },
    select: {
      id: true,
      userId: true,
      email: true,
      status: true,
      expiresAt: true,
    },
  }) as Promise<ParentConsentRow | null>;
}

async function markParentExpired(parentId: string) {
  await prisma.parent.update({
    where: { id: parentId },
    data: {
      status: "expired",
      token: null,
    },
  });
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

      return NextResponse.json(
        {
          success: false,
          title: "Link tidak valid",
          description: "Token atau parameter keputusan tidak valid.",
        },
        { status: 400 },
      );
    }

    const parent = await getParentByToken(parsedQuery.data.token);

    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          title: "Link kedaluwarsa",
          description:
            "Link persetujuan sudah tidak valid atau sudah pernah digunakan.",
        },
        { status: 404 },
      );
    }

    if (parent.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          title: "Link tidak lagi aktif",
          description: "Permintaan ini sudah diproses sebelumnya.",
        },
        { status: 400 },
      );
    }

    if (!parent.expiresAt || parent.expiresAt <= new Date()) {
      await markParentExpired(parent.id);

      return NextResponse.json(
        {
          success: false,
          title: "Link kedaluwarsa",
          description:
            "Link persetujuan sudah tidak valid atau sudah kedaluwarsa.",
        },
        { status: 404 },
      );
    }

    if (parsedQuery.data.decision === "accept") {
      await prisma.user.update({
        where: { id: parent.userId },
        data: {
          parentEmail: parent.email,
        },
      });

      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          status: "verified",
          verifiedAt: new Date(),
          token: null,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: parent.userId },
        data: {
          parentEmail: null,
        },
      });

      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          status: "expired",
          rejectedAt: new Date(),
          token: null,
        },
      });
    }

    const title =
      parsedQuery.data.decision === "accept"
        ? "Persetujuan Berhasil"
        : "Permintaan Ditolak";
    const description =
      parsedQuery.data.decision === "accept"
        ? `Email ${parent.email} sekarang akan menerima laporan dari TemanTumbuh.`
        : "Email tidak dihubungkan ke akun anak.";

    return NextResponse.json({
      success: true,
      title,
      description,
      email: parent.email,
      decision: parsedQuery.data.decision,
    });
  } catch (error: unknown) {
    console.error("Parent consent GET error:", error);
    return NextResponse.json(
      {
        success: false,
        title: "Terjadi kesalahan sistem",
        description: "Silakan coba lagi nanti.",
      },
      { status: 500 },
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

    const parent = await getParentByToken(parsed.data.token);

    if (!parent || parent.status !== "pending") {
      return NextResponse.json(
        { error: "Link sudah tidak valid." },
        { status: 404 },
      );
    }

    if (!parent.expiresAt || parent.expiresAt <= new Date()) {
      await markParentExpired(parent.id);

      return NextResponse.json(
        { error: "Link sudah tidak valid." },
        { status: 404 },
      );
    }

    if (parsed.data.decision === "accept") {
      await prisma.user.update({
        where: { id: parent.userId },
        data: {
          parentEmail: parent.email,
        },
      });

      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          status: "verified",
          verifiedAt: new Date(),
          token: null,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: parent.userId },
        data: {
          parentEmail: null,
        },
      });

      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          status: "expired",
          rejectedAt: new Date(),
          token: null,
        },
      });
    }

    if (!contentType.includes("application/json")) {
      const title =
        parsed.data.decision === "accept"
          ? "Persetujuan Berhasil"
          : "Permintaan Ditolak";
      const description =
        parsed.data.decision === "accept"
          ? `Email ${parent.email} sekarang akan menerima laporan dari TemanTumbuh.`
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

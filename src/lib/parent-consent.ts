import { randomBytes, randomUUID } from "node:crypto";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function requestParentConsentEmail(input: {
  userId: string;
  childName: string;
  parentEmail: string;
  appUrl: string;
}) {
  const parentEmail = input.parentEmail.toLowerCase().trim();
  const parentConsentToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);

  await prisma.parent.upsert({
    where: {
      userId: input.userId,
    },
    create: {
      id: randomUUID(),
      userId: input.userId,
      email: parentEmail,
      status: "pending",
      token: parentConsentToken,
      requestedAt: new Date(),
      lastSentAt: new Date(),
      expiresAt,
    },
    update: {
      email: parentEmail,
      status: "pending",
      token: parentConsentToken,
      requestedAt: new Date(),
      lastSentAt: new Date(),
      expiresAt,
      verifiedAt: null,
      rejectedAt: null,
    },
  });

  const acceptUrl = `${input.appUrl}/api/parent-consent?token=${parentConsentToken}&decision=accept`;
  const rejectUrl = `${input.appUrl}/api/parent-consent?token=${parentConsentToken}&decision=reject`;

  try {
    await sendEmail({
      to: parentEmail,
      subject: "Konfirmasi Persetujuan Laporan TemanTumbuh",
      text:
        `Halo,\n\n` +
        `${input.childName} ingin menghubungkan email ini sebagai email orang tua/wali di TemanTumbuh.\n` +
        "Pilih salah satu keputusan berikut:\n" +
        `Setuju: ${acceptUrl}\n` +
        `Tolak: ${rejectUrl}\n\n` +
        "Link berlaku 3 hari.",
      html: `
        <div style="background:#f3f8ff;padding:24px 12px;font-family:Arial,sans-serif;color:#1f2937;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbe7f3;border-radius:14px;overflow:hidden;">
            <div style="background:linear-gradient(90deg,#0f6b60,#1a9688,#28b0a4);height:6px;"></div>
            <div style="padding:28px 24px;">
              <h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f6b60;">Permintaan Persetujuan Email Orang Tua/Wali</h2>
              <p style="margin:0 0 10px;font-size:15px;line-height:1.7;">${input.childName} ingin menghubungkan email ini untuk menerima laporan dari TemanTumbuh.</p>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">Silakan pilih keputusan Anda langsung dari email ini.</p>

              <div style="margin:22px 0 16px;text-align:center;">
                <a href="${acceptUrl}" style="display:inline-block;background:#1a9688;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;margin-right:8px;">Setuju</a>
                <a href="${rejectUrl}" style="display:inline-block;background:#ef4444;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">Tolak</a>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#4b5563;">Jika tombol tidak berfungsi, salin link berikut:</p>
              <p style="margin:0 0 4px;word-break:break-all;">
                <a href="${acceptUrl}" style="color:#0f6b60;font-size:13px;">Setuju: ${acceptUrl}</a>
              </p>
              <p style="margin:0 0 8px;word-break:break-all;">
                <a href="${rejectUrl}" style="color:#0f6b60;font-size:13px;">Tolak: ${rejectUrl}</a>
              </p>

              <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">Link berlaku selama 3 hari.</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    await prisma.parent.updateMany({
      where: {
        userId: input.userId,
        token: parentConsentToken,
      },
      data: {
        token: null,
      },
    });
    throw error;
  }

  return { pendingParentEmail: parentEmail };
}

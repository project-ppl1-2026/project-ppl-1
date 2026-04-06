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

  const acceptUrl = `${input.appUrl}/parent-consent?token=${parentConsentToken}&decision=accept`;
  const rejectUrl = `${input.appUrl}/parent-consent?token=${parentConsentToken}&decision=reject`;

  // Kirim email DAHULU sebelum mengupdate database
  // Jika gagal mengirim (misal koneksi terputus), error akan dilempar
  // dan database sama sekali belum disentuh (tidak ada sisa data yang salah).
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
      <div style="margin:0;padding:0;background:#eef6f5;font-family:Arial,sans-serif;color:#1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef6f5;padding:32px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #d8ebe8;border-radius:20px;overflow:hidden;">
                
                <tr>
                  <td style="height:6px;background:linear-gradient(90deg,#0f6b60,#1a9688,#28b0a4);font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <tr>
                  <td style="padding:32px 28px 12px;text-align:center;">
                    <div style="display:inline-block;background:#e8f7f4;border:1px solid #bfe9e1;border-radius:16px;padding:10px 14px;font-size:14px;font-weight:700;color:#1a9688;">
                      TemanTumbuh
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 28px 0;text-align:center;">
                    <h1 style="margin:0;font-size:26px;line-height:1.3;color:#16313b;font-weight:700;">
                      Permintaan Persetujuan
                    </h1>
                    <p style="margin:10px 0 0;font-size:15px;line-height:1.8;color:#58707c;">
                      ${input.childName} ingin menghubungkan email ini sebagai email orang tua/wali
                      untuk menerima laporan dari <strong style="color:#1a9688;">TemanTumbuh</strong>.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7fbfb;border:1px solid #d8ebe8;border-radius:16px;">
                      <tr>
                        <td style="padding:18px 18px 16px;">
                          <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#16313b;font-weight:700;">
                            Apa arti persetujuan ini?
                          </p>
                          <p style="margin:0;font-size:14px;line-height:1.8;color:#5f7380;">
                            Jika Anda menyetujui, email ini akan dicatat sebagai email orang tua/wali
                            dan dapat menerima laporan terkait aktivitas anak di TemanTumbuh sesuai kebijakan aplikasi.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:28px 28px 8px;text-align:center;">
                    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#58707c;">
                      Silakan pilih salah satu keputusan berikut:
                    </p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding:0 6px 12px;">
                          <a
                            href="${acceptUrl}"
                            style="display:inline-block;background:linear-gradient(90deg,#0f6b60,#1a9688,#28b0a4);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;line-height:1;padding:14px 24px;border-radius:12px;"
                          >
                            Setuju
                          </a>
                        </td>
                        <td style="padding:0 6px 12px;">
                          <a
                            href="${rejectUrl}"
                            style="display:inline-block;background:#e85d4f;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;line-height:1;padding:14px 24px;border-radius:12px;"
                          >
                            Tolak
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 28px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff8e8;border:1px solid #f2df9b;border-radius:14px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#8a6a00;font-weight:700;">
                            Penting
                          </p>
                          <p style="margin:0;font-size:13px;line-height:1.7;color:#7a6a3d;">
                            Tautan ini hanya berlaku selama <strong>3 hari</strong>. Setelah itu,
                            Anda perlu meminta pengiriman ulang dari aplikasi.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 28px 0;">
                    <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#58707c;font-weight:700;">
                      Jika tombol tidak berfungsi, gunakan tautan berikut:
                    </p>

                    <p style="margin:0 0 10px;font-size:12px;line-height:1.8;word-break:break-all;">
                      <span style="display:block;color:#16313b;font-weight:700;margin-bottom:4px;">Setuju</span>
                      <a href="${acceptUrl}" style="color:#1a9688;text-decoration:none;">${acceptUrl}</a>
                    </p>

                    <p style="margin:0;font-size:12px;line-height:1.8;word-break:break-all;">
                      <span style="display:block;color:#16313b;font-weight:700;margin-bottom:4px;">Tolak</span>
                      <a href="${rejectUrl}" style="color:#1a9688;text-decoration:none;">${rejectUrl}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:28px 28px 0;">
                    <div style="height:1px;background:#e6efee;"></div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 28px 28px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:12px;line-height:1.7;color:#7b8d97;">
                      Email ini dikirim otomatis oleh sistem TemanTumbuh.
                    </p>
                    <p style="margin:0;font-size:12px;line-height:1.7;color:#9aa9b1;">
                      Jika Anda merasa tidak pernah menerima permintaan ini, Anda dapat mengabaikan email ini.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  // Jika sukses kirim email, BARU simpan data ke database
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

  return { pendingParentEmail: parentEmail };
}

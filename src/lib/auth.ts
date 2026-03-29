import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path

import { sendEmail } from "./email";
import prisma from "./prisma";

export const auth = betterAuth({
  // Uses the app URL so OAuth redirects always resolve to this Next.js app.
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Enables email/password sign up and requires verification before login.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  // Sends verification links through SMTP and avoids timing attacks by not awaiting from auth flow.
  emailVerification: {
    autoSignInAfterVerification: true, // AUTO LOGIN AFTER VERIFICATION CLICK
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const greetingName = user.name?.trim() || "Teman";

        // Harus kita await, agar kalau gagal mengirim email (misal tidak ada koneksi/kredensial SMTP mati),
        // kita bisa menangkap throw error nya dan membatalkan pembuatan user tersebut.
        await sendEmail({
          to: user.email,
          subject: "Verifikasi Email Akun TemanTumbuh",
          text:
            `Halo ${greetingName},\n\n` +
            "Terima kasih sudah mendaftar di TemanTumbuh.\n" +
            "Untuk melanjutkan dan mengamankan akunmu, silakan verifikasi email terlebih dahulu.\n\n" +
            `Link verifikasi: ${url}\n\n` +
            "Jika kamu tidak merasa membuat akun ini, kamu bisa abaikan email ini.",
          html: `
            <div style="background:#f3f8ff;padding:24px 12px;font-family:Arial,sans-serif;color:#1f2937;">
              <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbe7f3;border-radius:14px;overflow:hidden;">
                <div style="background:linear-gradient(90deg,#0f6b60,#1a9688,#28b0a4);height:6px;"></div>
                <div style="padding:28px 24px;">
                  <h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f6b60;">Selamat datang di TemanTumbuh, ${greetingName}!</h2>
                  <p style="margin:0 0 10px;font-size:15px;line-height:1.7;">Terima kasih sudah membuat akun. Sebelum mulai, kami perlu memastikan bahwa email ini benar milikmu.</p>
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.7;">Klik tombol di bawah untuk verifikasi email. Setelah terverifikasi, kamu akan langsung bisa lanjut melengkapi profil.</p>

                  <div style="margin:22px 0 24px;text-align:center;">
                    <a href="${url}" style="display:inline-block;background:#1a9688;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">Verifikasi Email Sekarang</a>
                  </div>

                  <p style="margin:0 0 8px;font-size:13px;color:#4b5563;">Jika tombol tidak berfungsi, salin dan buka link ini di browser:</p>
                  <p style="margin:0 0 18px;word-break:break-all;"><a href="${url}" style="color:#0f6b60;font-size:13px;">${url}</a></p>

                  <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">Kalau kamu tidak merasa membuat akun ini, abaikan email ini. Tidak ada perubahan apa pun pada akunmu.</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error(
          "Gagal mengirim email verifikasi, membatalkan pembuatan akun:",
          error,
        );
        // Hapus akun yang terlanjur terbuat jika email gagal terkirim.
        await prisma.user.deleteMany({
          where: {
            OR: [{ id: user.id }, { email: user.email }],
          },
        });
        throw new Error("Gagal mengirim email. Pembuatan akun dibatalkan.");
      }
    },
  },
  // Allows implicit linking by email for trusted OAuth providers.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      disableImplicitLinking: false,
    },
  },
  // Configures Google OAuth and forces consent flow so refresh tokens can be issued.
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
